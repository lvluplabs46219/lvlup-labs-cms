'use client';

import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';

import { supportedChains, wagmiConfig } from '@/lib/web3/config';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={supportedChains[0]}
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#141414',
            accentColorForeground: '#E4E3E0',
            borderRadius: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
