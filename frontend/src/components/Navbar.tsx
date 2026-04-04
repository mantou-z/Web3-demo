'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sceneAssets } from '@/components/scene/assets'

const navItems = [
  { href: '/mining', label: 'Collect', icon: sceneAssets.nav.collect },
  { href: '/refining', label: 'Refine', icon: sceneAssets.nav.refine },
  { href: '/awakening', label: 'Awaken', icon: sceneAssets.nav.awaken },
  { href: '/profile', label: 'Profile', icon: sceneAssets.nav.profile },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 rounded-[2rem] border border-white/50 bg-white/45 px-4 py-3 shadow-[0_20px_40px_rgba(130,93,43,0.12)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <img src={sceneAssets.nav.logo} alt="Alcheme" className="h-12 w-auto md:h-16" />
          <div className="hidden md:block">
            <div className="brand-script text-3xl font-bold text-[#52331a]">Alcheme</div>
            <div className="text-sm tracking-[0.25em] text-[#a37b35]">Soul Forge</div>
          </div>
        </Link>

        <div className="flex items-center gap-2 overflow-x-auto px-1 py-1 md:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[84px] flex-col items-center gap-1 rounded-[1.35rem] px-3 py-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-[#fff5d8] shadow-[0_10px_20px_rgba(213,168,75,0.25)]'
                    : 'hover:bg-white/40'
                }`}
              >
                <div className={`rounded-[1rem] p-1.5 ${isActive ? 'bg-white/60' : ''}`}>
                  <img src={item.icon} alt={item.label} className="h-11 w-11 object-contain md:h-14 md:w-14" />
                </div>
                <span className="brand-script text-sm font-semibold text-[#5b3b1d]">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
            const ready = mounted
            const connected = ready && account && chain

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button onClick={openConnectModal} className="gold-button px-4 py-3 text-sm">
                        Connect
                      </button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} className="rounded-full border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                        Wrong network
                      </button>
                    )
                  }

                  return (
                    <div className="hidden items-center gap-2 md:flex">
                      <button
                        onClick={openChainModal}
                        className="glass-soft flex items-center gap-2 rounded-full px-3 py-2"
                      >
                        {chain.hasIcon && chain.iconUrl ? (
                          <img
                            alt={chain.name ?? 'Chain'}
                            src={chain.iconUrl}
                            className="h-5 w-5 rounded-full"
                          />
                        ) : null}
                        <span className="text-sm font-semibold text-[#6c532f]">{chain.name}</span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        className="parchment-panel flex items-center gap-2 rounded-full px-4 py-2"
                      >
                        <span className="text-sm font-semibold text-[#5b3b1d]">{account.displayName}</span>
                        <span className="text-xs text-[#a37b35]">{account.displayBalance}</span>
                      </button>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  )
}
