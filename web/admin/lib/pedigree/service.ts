import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { pinDocumentReference, pinJson } from '@/lib/ipfs';
import { DEMO_HORSE_ID, demoHorseRecord } from '@/lib/pedigree/demo';
import { horsePedigrees, horses, type HorseLineage } from '@/lib/schema';
import { pedigreeChainId, pedigreeContractAddress } from '@/lib/web3/constants';

export type MintableHorse = {
  id: string;
  slug: string;
  name: string;
  registryId: string;
  breed: string;
  color: string | null;
  foaledYear: number | null;
  description: string | null;
  pedigreePdfPath: string | null;
  heroImageUrl: string | null;
  pedigree: {
    sireName: string;
    sireRegistryId: string | null;
    damName: string;
    damRegistryId: string | null;
    sourceDocumentName: string | null;
    lineage: HorseLineage;
  };
};

export type PreparedMintPayload = {
  horseId: string;
  horseName: string;
  registryId: string;
  sireRegistryId: string;
  damRegistryId: string;
  metadataUri: string;
  metadataCid: string;
  pedigreeDocCid: string;
  pedigreeDocUri: string;
  recipientWallet: `0x${string}`;
  contractAddress: `0x${string}`;
  chainId: number;
};

function toHexAddress(value: string | undefined | null): `0x${string}` {
  if (value && /^0x[a-fA-F0-9]{40}$/.test(value)) {
    return value as `0x${string}`;
  }

  return '0x0000000000000000000000000000000000000000';
}

async function getHorseFromDatabase(horseId: string): Promise<MintableHorse | null> {
  if (!db) {
    return null;
  }

  const rows = await db
    .select({
      horse: horses,
      pedigree: horsePedigrees,
    })
    .from(horses)
    .leftJoin(horsePedigrees, eq(horses.id, horsePedigrees.horseId))
    .where(eq(horses.id, horseId))
    .limit(1);

  const row = rows[0];
  if (!row?.horse || !row.pedigree) {
    return null;
  }

  return {
    id: row.horse.id,
    slug: row.horse.slug,
    name: row.horse.name,
    registryId: row.horse.registryId,
    breed: row.horse.breed,
    color: row.horse.color,
    foaledYear: row.horse.foaledYear,
    description: row.horse.description,
    pedigreePdfPath: row.horse.pedigreePdfPath,
    heroImageUrl: row.horse.heroImageUrl,
    pedigree: {
      sireName: row.pedigree.sireName,
      sireRegistryId: row.pedigree.sireRegistryId,
      damName: row.pedigree.damName,
      damRegistryId: row.pedigree.damRegistryId,
      sourceDocumentName: row.pedigree.sourceDocumentName,
      lineage: row.pedigree.lineage,
    },
  };
}

export async function getMintableHorse(horseId: string): Promise<MintableHorse> {
  if (horseId === DEMO_HORSE_ID) {
    return demoHorseRecord;
  }

  try {
    const record = await getHorseFromDatabase(horseId);
    return record ?? demoHorseRecord;
  } catch (error) {
    console.warn('[Pedigree] Falling back to demo horse data.', error);
    return demoHorseRecord;
  }
}

export async function prepareMintPayload(
  horseId: string,
  recipientWallet?: string
): Promise<PreparedMintPayload> {
  const horse = await getMintableHorse(horseId);

  const documentRef = await pinDocumentReference(
    `${horse.name} pedigree source`,
    horse.pedigreePdfPath ?? horse.pedigree.sourceDocumentName ?? `${horse.slug}.pdf`
  );

  const metadata = {
    name: `${horse.name} Digital Pedigree`,
    description: horse.description,
    image: horse.heroImageUrl,
    external_url: `${process.env.APP_URL ?? 'http://localhost:3000'}/horses/${horse.slug}`,
    attributes: [
      { trait_type: 'Registry', value: horse.registryId },
      { trait_type: 'Breed', value: horse.breed },
      { trait_type: 'Color', value: horse.color },
      { trait_type: 'Foaled', value: horse.foaledYear },
      { trait_type: 'Sire', value: horse.pedigree.sireName },
      { trait_type: 'Dam', value: horse.pedigree.damName },
      { trait_type: 'Issuer', value: 'Bear Creek Ranch' },
      { trait_type: 'Certificate Type', value: 'Digital Pedigree' },
    ],
    pedigree: horse.pedigree.lineage,
    source_document: {
      name: horse.pedigree.sourceDocumentName,
      cid: documentRef.cid,
      sha256: documentRef.sha256,
    },
  };

  const metadataRef = await pinJson(`${horse.slug}-digital-pedigree`, metadata);

  return {
    horseId: horse.id,
    horseName: horse.name,
    registryId: horse.registryId,
    sireRegistryId: horse.pedigree.sireRegistryId ?? '',
    damRegistryId: horse.pedigree.damRegistryId ?? '',
    metadataUri: metadataRef.uri,
    metadataCid: metadataRef.cid,
    pedigreeDocCid: documentRef.cid,
    pedigreeDocUri: documentRef.uri,
    recipientWallet: toHexAddress(recipientWallet ?? process.env.MINT_ADMIN_WALLET),
    contractAddress: pedigreeContractAddress,
    chainId: pedigreeChainId,
  };
}

export async function recordMintSubmission(args: {
  horseId: string;
  txHash: string;
  recipientWallet: string;
  metadataCid: string;
  metadataUri: string;
  contractAddress: string;
  chainId: number;
}) {
  if (!db) {
    return;
  }

  await db
    .update(horsePedigrees)
    .set({
      txHash: args.txHash,
      mintedToWallet: args.recipientWallet,
      metadataCid: args.metadataCid,
      metadataUri: args.metadataUri,
      contractAddress: args.contractAddress,
      chainId: args.chainId,
      mintStatus: 'submitted',
      mintedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(horsePedigrees.horseId, args.horseId));
}
