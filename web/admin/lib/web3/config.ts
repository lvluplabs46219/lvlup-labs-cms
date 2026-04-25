import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia } from 'wagmi/chains';

import { pedigreeChainId, pedigreeContractAddress } from '@/lib/web3/constants';

export const supportedChains = [baseSepolia] as const;

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo-walletconnect-project-id';

export const wagmiConfig = getDefaultConfig({
  appName: 'LvlUp Labs CMS',
  projectId: walletConnectProjectId,
  chains: supportedChains,
  ssr: true,
});

export { pedigreeChainId, pedigreeContractAddress };
