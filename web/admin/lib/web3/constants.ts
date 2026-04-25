export const DEFAULT_PEDIGREE_CHAIN_ID = 84532;

export const pedigreeChainId = Number(
  process.env.NEXT_PUBLIC_PEDIGREE_CHAIN_ID ?? DEFAULT_PEDIGREE_CHAIN_ID
);

export const pedigreeContractAddress =
  (process.env.NEXT_PUBLIC_PEDIGREE_CONTRACT_ADDRESS ??
    '0x0000000000000000000000000000000000000000') as `0x${string}`;
