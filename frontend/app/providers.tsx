'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig, configureChains, mainnet, sepolia } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { useState } from 'react'

// Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'demo' }),
    publicProvider(),
  ]
)

// Configure wallets
const { wallets } = getDefaultWallets({
  appName: 'Aya DeFi Navigator',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo',
  chains,
})

const connectors = connectorsForWallets([
  ...wallets,
])

// Create wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        cacheTime: 10 * 60 * 1000, // 10 minutes
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          theme={{
            blurs: {
              modalOverlay: 'small',
            },
            colors: {
              accentColor: '#f97316', // Primary orange
              accentColorForeground: 'white',
              actionButtonBorder: 'rgba(255, 255, 255, 0.04)',
              actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
              actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.08)',
              closeButton: 'rgba(224, 232, 255, 0.6)',
              closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
              connectButtonBackground: '#f97316',
              connectButtonBackgroundError: '#ef4444',
              connectButtonInnerBackground: 'linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))',
              connectButtonText: 'white',
              connectButtonTextError: 'white',
              connectionIndicator: '#22c55e',
              downloadBottomCardBackground: 'linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #1a1b1f',
              downloadTopCardBackground: 'linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #1a1b1f',
              error: '#ef4444',
              generalBorder: 'rgba(255, 255, 255, 0.08)',
              generalBorderDim: 'rgba(255, 255, 255, 0.04)',
              menuItemBackground: 'rgba(224, 232, 255, 0.1)',
              modalBackdrop: 'rgba(0, 0, 0, 0.3)',
              modalBackground: 'white',
              modalBorder: 'rgba(255, 255, 255, 0.08)',
              modalText: '#171717',
              modalTextDim: '#737373',
              modalTextSecondary: '#525252',
              profileAction: 'rgba(224, 232, 255, 0.1)',
              profileActionHover: 'rgba(224, 232, 255, 0.2)',
              profileForeground: 'white',
              selectedOptionBorder: 'rgba(224, 232, 255, 0.1)',
              standby: '#f59e0b',
            },
            fonts: {
              body: 'Inter, system-ui, sans-serif',
            },
            radii: {
              actionButton: '12px',
              connectButton: '12px',
              menuButton: '12px',
              modal: '16px',
              modalMobile: '16px',
            },
            shadows: {
              connectButton: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              dialog: '0px 8px 32px rgba(0, 0, 0, 0.32)',
              profileDetailsAction: '0px 2px 6px rgba(37, 41, 46, 0.04)',
              selectedOption: '0px 2px 6px rgba(0, 0, 0, 0.24)',
              selectedWallet: '0px 2px 6px rgba(0, 0, 0, 0.12)',
              walletLogo: '0px 2px 16px rgba(0, 0, 0, 0.16)',
            },
          }}
        >
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  )
}
