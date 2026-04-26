/**
 * Bear Creek Ranch — horses domain schema
 *
 * Four-layer architecture:
 *
 *   CMS ops layer    → horse records, pedigree data, inspection reports entered by staff
 *   Postgres truth   → all structured data, queryable, relational
 *   IPFS proof layer → source documents (pedigree PDFs, vet reports) pinned with CID + sha256
 *                      metadata JSON (NFT attributes) pinned with CID + URI
 *   NFT / contract   → pedigree NFT minted from metadataUri, tracked by tokenId + txHash
 *
 * Tables:
 *   horses              — horse identity records
 *   horse_pedigrees     — pedigree data + NFT mint lifecycle
 *   horse_documents     — supporting docs (vet records, registration papers)
 *                         pinned to IPFS, optionally minted
 *   inspection_reports  — formal inspection reports pinned to IPFS
 *   exclusive_listings  — token-gated sale listings per horse
 */

import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from '-orm/pg-core';

import { assets, documents, organizations } from '../../core';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const horseSexEnum = pgEnum('horse_sex', [
  'mare',
  'stallion',
  'gelding',
  'filly',
  'colt',
]);

export const horseStatusEnum = pgEnum('horse_status', [
  'active',     // On-property, in use
  'for_sale',   // Listed for sale
  'reserved',   // Sale pending
  'sold',       // Transferred
  'retired',    // Retired from activity, still on-property
  'deceased',
  'archived',   // Removed from public view
]);

/**
 * Mint status lifecycle — shared pattern across both domains.
 * draft     → data entered, document not yet pinned
 * ready     → document + metadata pinned to IPFS, awaiting mint trigger
 * submitted → mint tx broadcast, waiting for on-chain confirmation
 * confirmed → tokenId confirmed on-chain
 * failed    → tx failed, can re-trigger
 */
export const mintStatusEnum = pgEnum('mint_status', [
  'draft',
  'ready',
  'submitted',
  'confirmed',
  'failed',
]);

export const listingStatusEnum = pgEnum('listing_status', [
  'draft',
  'private',
  'published',
  'sold',
]);

export const horseDocTypeEnum = pgEnum('horse_doc_type', [
  'registration_papers',  // USEF, AQHA, etc.
  'vet_record',
  'coggins',              // EIA / Coggins test
  'health_certificate',
  'farrier_record',
  'breeding_contract',
  'sale_contract',
  'insurance',
  'other',
]);

// ─── Pedigree node types ──────────────────────────────────────────────────────

export type PedigreeNode = {
  name: string;
  registryId?: string | null;
  color?: string | null;
  foaledYear?: number | null;
};

export type HorseLineage = {
  subject: {
    name: string;
    registryId: string;
    color?: string | null;
    foaledYear?: number | null;
  };
  parents: {
    sire: PedigreeNode;
    dam: PedigreeNode;
  };
  highlights?: PedigreeNode[];
};

// ─── horses ───────────────────────────────────────────────────────────────────
/**
 * Primary horse identity record.
 * One row per horse — all other tables FK to this.
 *
 * CMS / Postgres layer only. The NFT lives on horse_pedigrees,
 * not here, because the pedigree document is what gets minted.
 */
export const horses = pgTable(
  'horses',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    slug:           text('slug').notNull(),
    name:           text('name').notNull(),
    registryId:     text('registry_id').notNull(),
    breed:          text('breed').notNull().default('Arabian'),
    color:          text('color'),
    sex:            horseSexEnum('sex'),
    foaledYear:     integer('foaled_year'),
    description:    text('description'),
    status:         horseStatusEnum('status').notNull().default('active'),

    /** Path to pedigree PDF in R2 storage — source document for IPFS pinning */
    pedigreePdfPath: text('pedigree_pdf_path'),

    /** Cover image asset */
    heroAssetId:    uuid('hero_asset_id').references(() => assets.id),
    heroImageUrl:   text('hero_image_url'),

    /** Public-facing listing price (display string e.g. "$45,000" or "Contact for Price") */
    priceDisplay:   text('price_display'),
    /** Exact price in cents — for internal use and sorting */
    priceCents:     integer('price_cents'),

    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:      index('horses_organization_id_idx').on(t.organizationId),
    slugIdx:     index('horses_org_slug_idx').on(t.organizationId, t.slug),
    registryIdx: index('horses_org_registry_id_idx').on(t.organizationId, t.registryId),
    statusIdx:   index('horses_status_idx').on(t.status),
  })
);

// ─── horse_pedigrees ─────────────────────────────────────────────────────────
/**
 * Pedigree record + NFT mint lifecycle for a horse.
 *
 * This table spans all four layers:
 *
 *   CMS ops          → sireName, damName, lineage JSON, source document upload
 *   Postgres truth   → all fields stored and queryable here
 *   IPFS proof layer → sourceDocumentCid / sourceDocumentSha256
 *                        (the actual pedigree PDF pinned to IPFS)
 *                      metadataCid / metadataUri
 *                        (the NFT metadata JSON pinned to IPFS)
 *   NFT / contract   → contractAddress, chainId, tokenId, txHash,
 *                        mintedToWallet, mintStatus, mintedAt
 *
 * Mint flow:
 *   1. Staff uploads pedigree PDF in CMS → sourceDocumentId FK written
 *   2. PDF pinned to IPFS → sourceDocumentCid + sourceDocumentSha256 written
 *   3. Metadata JSON assembled (name, image, attributes, lineage, source_document)
 *      and pinned to IPFS → metadataCid + metadataUri written
 *   4. mintStatus = 'ready'
 *   5. Admin triggers mint → contract called with metadataUri as tokenURI
 *   6. On broadcast → txHash written, mintStatus = 'submitted'
 *   7. On confirmation → tokenId written, mintStatus = 'confirmed'
 */
export const horsePedigrees = pgTable(
  'horse_pedigrees',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    horseId:        uuid('horse_id').notNull().references(() => horses.id),

    // ── CMS / Postgres layer ─────────────────────────────────────────────────
    sireName:           text('sire_name').notNull(),
    sireRegistryId:     text('sire_registry_id'),
    damName:            text('dam_name').notNull(),
    damRegistryId:      text('dam_registry_id'),
    /** Full pedigree tree — serialized as JSONB for depth-N traversal */
    lineage:            jsonb('lineage').$type<HorseLineage>().notNull(),
    /** FK to core documents (R2 storage URL for the source pedigree PDF) */
    sourceDocumentId:   uuid('source_document_id').references(() => documents.id),
    sourceDocumentName: text('source_document_name'),

    // ── IPFS proof layer ─────────────────────────────────────────────────────
    /**
     * CID of the pinned source pedigree PDF.
     * sha256(pdf_bytes) must equal sourceDocumentSha256 — independently verifiable.
     */
    sourceDocumentCid:  text('source_document_cid'),
    sourceDocumentSha256: text('source_document_sha256'),
    /**
     * FK to core documents for the NFT metadata JSON file (stored in R2 as backup).
     * The canonical version lives on IPFS at metadataCid.
     */
    metadataDocumentId: uuid('metadata_document_id').references(() => documents.id),
    /**
     * CID of the NFT metadata JSON pinned to IPFS.
     * Contains: name, description, image (heroImageUrl), attributes (breed, registry ID,
     * sire, dam, foaled year, issuer), pedigree (lineage), source_document { cid, sha256 }.
     */
    metadataCid:        text('metadata_cid'),
    /** ipfs://<metadataCid>/<slug>-digital-pedigree.json */
    metadataUri:        text('metadata_uri'),

    // ── NFT / smart contract layer ───────────────────────────────────────────
    contractAddress:    text('contract_address'),
    /** EIP-155: 1=mainnet, 137=polygon, 8453=base, 84532=base-sepolia */
    chainId:            integer('chain_id'),
    /** On-chain token ID — written after mint confirmation */
    tokenId:            text('token_id'),
    /** Mint transaction hash */
    txHash:             text('tx_hash'),
    /** Wallet the NFT was minted to */
    mintedToWallet:     text('minted_to_wallet'),
    mintStatus:         mintStatusEnum('mint_status').notNull().default('draft'),
    mintedAt:           timestamp('minted_at', { withTimezone: true }),

    createdAt:          timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:          timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:       index('horse_pedigrees_organization_id_idx').on(t.organizationId),
    horseIdx:     index('horse_pedigrees_horse_id_idx').on(t.horseId),
    tokenIdx:     index('horse_pedigrees_token_id_idx').on(t.tokenId),
    mintStatusIdx:index('horse_pedigrees_mint_status_idx').on(t.mintStatus),
    cidIdx:       index('horse_pedigrees_source_cid_idx').on(t.sourceDocumentCid),
  })
);

// ─── horse_documents ─────────────────────────────────────────────────────────
/**
 * Supporting documents per horse — vet records, Coggins tests, registration papers, etc.
 * Each document can be independently pinned to IPFS for tamper-proof storage.
 * Optionally minted as an NFT (e.g. a Coggins test with an expiry date as an attribute).
 *
 * This is the general-purpose document table. Pedigree specifically lives on
 * horse_pedigrees. Formal inspections live on inspection_reports.
 */
export const horseDocuments = pgTable(
  'horse_documents',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    horseId:        uuid('horse_id').notNull().references(() => horses.id),

    // ── CMS / Postgres layer ─────────────────────────────────────────────────
    documentId:     uuid('document_id').references(() => documents.id),
    type:           horseDocTypeEnum('type').notNull(),
    title:          text('title').notNull(),
    issuedBy:       text('issued_by'),
    /** ISO date "YYYY-MM-DD" */
    issuedDate:     text('issued_date'),
    /** ISO date "YYYY-MM-DD" — for Coggins, health certs, etc. */
    expiresDate:    text('expires_date'),
    notes:          text('notes'),

    // ── IPFS proof layer ─────────────────────────────────────────────────────
    documentCid:    text('document_cid'),
    documentSha256: text('document_sha256'),
    metadataCid:    text('metadata_cid'),
    metadataUri:    text('metadata_uri'),

    // ── NFT / contract layer (optional — not all docs get minted) ────────────
    contractAddress: text('contract_address'),
    chainId:         integer('chain_id'),
    tokenId:         text('token_id'),
    txHash:          text('tx_hash'),
    mintedToWallet:  text('minted_to_wallet'),
    mintStatus:      mintStatusEnum('mint_status').notNull().default('draft'),
    mintedAt:        timestamp('minted_at', { withTimezone: true }),

    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:       index('horse_documents_organization_id_idx').on(t.organizationId),
    horseIdx:     index('horse_documents_horse_id_idx').on(t.horseId),
    typeIdx:      index('horse_documents_type_idx').on(t.type),
    mintStatusIdx:index('horse_documents_mint_status_idx').on(t.mintStatus),
    cidIdx:       index('horse_documents_cid_idx').on(t.documentCid),
  })
);

// ─── inspection_reports ───────────────────────────────────────────────────────
/**
 * Formal inspection reports — veterinary pre-purchase exams, farrier assessments, etc.
 * Always pinned to IPFS. The CID + sha256 is the proof that the report is unaltered.
 */
export const inspectionReports = pgTable(
  'inspection_reports',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    horseId:        uuid('horse_id').notNull().references(() => horses.id),

    // ── CMS / Postgres layer ─────────────────────────────────────────────────
    documentId:     uuid('document_id').references(() => documents.id),
    title:          text('title').notNull(),
    issuedBy:       text('issued_by'),
    issuedAt:       timestamp('issued_at', { withTimezone: true }),
    notes:          text('notes'),
    passed:         boolean('passed'),

    // ── IPFS proof layer ─────────────────────────────────────────────────────
    /** CID of the pinned inspection report PDF */
    reportCid:      text('report_cid').notNull(),
    /** sha256 of the PDF — independently verifiable against the CID */
    reportSha256:   text('report_sha256').notNull(),

    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:   index('inspection_reports_organization_id_idx').on(t.organizationId),
    horseIdx: index('inspection_reports_horse_id_idx').on(t.horseId),
    cidIdx:   index('inspection_reports_cid_idx').on(t.reportCid),
  })
);

// ─── exclusive_listings ───────────────────────────────────────────────────────
/**
 * Token-gated sale listings.
 * Holding the horse's pedigree NFT (or a specified token) gates access
 * to the full listing details (price, contact, due diligence docs).
 *
 * CMS / Postgres layer only — no IPFS or minting here.
 * The gate is enforced by checking the buyer's wallet for the required token.
 */
export const exclusiveListings = pgTable(
  'exclusive_listings',
  {
    id:             uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').notNull().references(() => organizations.id),
    horseId:        uuid('horse_id').references(() => horses.id),

    title:          text('title').notNull(),
    summary:        text('summary'),
    status:         listingStatusEnum('status').notNull().default('draft'),

    /** Display price string e.g. "$45,000" or "Contact for Price" */
    price:          text('price'),
    /** Exact price in cents for internal sorting */
    priceCents:     integer('price_cents'),

    // ── Token gate ───────────────────────────────────────────────────────────
    /**
     * Minimum token balance required to view this listing.
     * Default 1 = must hold at least 1 token (own the pedigree NFT).
     */
    minimumTokenBalance:  integer('minimum_token_balance').default(1),
    tokenContractAddress: text('token_contract_address'),
    /** "erc721" | "erc1155" | "erc20" */
    tokenType:            text('token_type').notNull().default('erc721'),
    chainId:              integer('chain_id').notNull().default(84532),

    createdAt:      timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt:      timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    orgIdx:       index('exclusive_listings_organization_id_idx').on(t.organizationId),
    horseIdx:     index('exclusive_listings_horse_id_idx').on(t.horseId),
    tokenGateIdx: index('exclusive_listings_token_gate_idx').on(t.tokenContractAddress, t.chainId),
    statusIdx:    index('exclusive_listings_status_idx').on(t.status),
  })
);

// ─── Inferred types ───────────────────────────────────────────────────────────
export type Horse              = typeof horses.$inferSelect;
export type NewHorse           = typeof horses.$inferInsert;
export type HorsePedigree      = typeof horsePedigrees.$inferSelect;
export type NewHorsePedigree   = typeof horsePedigrees.$inferInsert;
export type HorseDocument      = typeof horseDocuments.$inferSelect;
export type NewHorseDocument   = typeof horseDocuments.$inferInsert;
export type InspectionReport   = typeof inspectionReports.$inferSelect;
export type NewInspectionReport= typeof inspectionReports.$inferInsert;
export type ExclusiveListing   = typeof exclusiveListings.$inferSelect;
export type NewExclusiveListing= typeof exclusiveListings.$inferInsert;
