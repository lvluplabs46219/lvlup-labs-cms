import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, base, arbitrum, optimism } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "LvlUp Labs",
  // Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID",
  chains: [mainnet, base, polygon, arbitrum, optimism],
  ssr: true,
});
