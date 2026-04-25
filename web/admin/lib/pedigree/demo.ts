import type { HorseLineage } from '@/lib/schema';

export const DEMO_HORSE_ID = 'demo-aspecial-ali';

export const demoPedigreeLineage: HorseLineage = {
  subject: {
    name: 'ASPECIAL ALI',
    registryId: 'AHR*548467',
    color: 'Bay',
    foaledYear: 1998,
  },
  parents: {
    sire: {
      name: 'RUMINAJA ALI',
      registryId: 'AHR*134937',
      color: 'Grey',
      foaledYear: 1976,
    },
    dam: {
      name: 'MAHRDEE GRAS',
      registryId: 'AHR*479750',
      color: 'Bay',
      foaledYear: 1991,
    },
  },
  highlights: [
    { name: 'SHAIKH AL BADI', registryId: 'AHR*54456', color: 'Grey', foaledYear: 1969 },
    { name: 'IMPERIAL IMDAL+', registryId: 'AHR*249645', color: 'Grey', foaledYear: 1982 },
    { name: 'EAGLET', registryId: 'AHR*291550', color: 'Bay', foaledYear: 1984 },
  ],
};

export const demoHorseRecord = {
  id: DEMO_HORSE_ID,
  slug: 'aspecial-ali',
  name: 'ASPECIAL ALI',
  registryId: 'AHR*548467',
  breed: 'Arabian',
  color: 'Bay',
  foaledYear: 1998,
  description:
    'Bear Creek Ranch example horse used to demonstrate on-chain digital pedigree minting for premium bloodline verification.',
  pedigreePdfPath:
    'C:/Users/lvlup/Documents/bearcreek-archive-organized/04-PEDIGREES/complete/AspecialaliPedigree_(2).pdf',
  heroImageUrl: null,
  pedigree: {
    sireName: 'RUMINAJA ALI',
    sireRegistryId: 'AHR*134937',
    damName: 'MAHRDEE GRAS',
    damRegistryId: 'AHR*479750',
    sourceDocumentName: 'AspecialaliPedigree_(2).pdf',
    lineage: demoPedigreeLineage,
  },
};
