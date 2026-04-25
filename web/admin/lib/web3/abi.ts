export const pedigreeNftAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'registryId', type: 'string' },
      { internalType: 'string', name: 'sireRegistryId', type: 'string' },
      { internalType: 'string', name: 'damRegistryId', type: 'string' },
      { internalType: 'string', name: 'metadataURI', type: 'string' },
      { internalType: 'string', name: 'pedigreeDocCID', type: 'string' },
    ],
    name: 'mintPedigree',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
