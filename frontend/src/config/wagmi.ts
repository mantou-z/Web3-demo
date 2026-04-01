import { http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Anvil 本地链配置
export const anvil = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
} as const

export const config = getDefaultConfig({
  appName: 'Growth Forge',
  projectId: 'YOUR_PROJECT_ID',
  chains: [anvil, mainnet, sepolia],
  transports: {
    [anvil.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
