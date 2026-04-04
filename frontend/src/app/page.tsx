'use client'

import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { GoldButton } from '@/components/scene/GoldButton'
import { ParchmentPanel } from '@/components/scene/ParchmentPanel'
import { SceneShell } from '@/components/scene/SceneShell'
import { sceneAssets } from '@/components/scene/assets'

const dailyPrompts = [
  { icon: sceneAssets.cards.ores[0], text: '记录今天最想珍藏的成长碎片' },
  { icon: sceneAssets.cards.ores[1], text: '将灵光片段投入炼金炉，生成里程碑卡牌' },
  { icon: sceneAssets.cards.ores[2], text: '以卡牌为媒，觉醒你的独特勋章身份' },
]

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <SceneShell>
      <div className="scene-grid">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="scene-column"
        >
          <div className="mb-8 max-w-md">
            <h1 className="scene-hero-title mb-6">Alcheme</h1>
            <p className="scene-hero-subtitle italic">
              Refine fragments,
              <br />
              Awaken true self.
            </p>
          </div>

          <img
            src={sceneAssets.shared.character}
            alt="Alcheme character"
            className="mx-auto max-h-[620px] w-auto object-contain drop-shadow-[0_30px_50px_rgba(140,102,59,0.24)]"
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="scene-column scene-column--center"
        >
          <div className="relative mx-auto flex w-full max-w-[420px] flex-col items-center">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,220,160,0.75),transparent_58%)] blur-3xl" />
            <img
              src={sceneAssets.home.crystal}
              alt="Hero crystal"
              className="animate-float relative z-10 w-full max-w-[380px] object-contain drop-shadow-[0_25px_45px_rgba(159,109,218,0.28)]"
            />
            <img
              src={sceneAssets.home.orbs}
              alt=""
              className="pointer-events-none mt-4 w-64 opacity-75 mix-blend-multiply"
            />
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/mining" className="scene-badge">Mine</Link>
            <Link href="/refining" className="scene-badge">Refine</Link>
            <Link href="/awakening" className="scene-badge">Awaken</Link>
          </div>

          <div className="mt-10">
            {isConnected ? (
              <Link href="/mining">
                <GoldButton>Begin Collecting</GoldButton>
              </Link>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <GoldButton onClick={openConnectModal}>Connect Wallet</GoldButton>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="scene-column items-center"
        >
          <div className="relative w-full max-w-[440px]">
            <img
              src={sceneAssets.shared.owl}
              alt="Alchemy owl"
              className="absolute right-0 top-[-5.5rem] z-10 h-44 w-auto animate-float object-contain md:h-56"
            />

            <ParchmentPanel className="px-6 pb-8 pt-20 md:px-10">
              <div className="mb-4 text-center">
                <div className="brand-script text-2xl font-bold text-[#78511f]">Today&apos;s Ritual</div>
                <p className="scene-muted text-base">将你的日常、洞见与成就封存为可进化的灵光。</p>
              </div>

              <div className="space-y-4">
                {dailyPrompts.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-2xl bg-white/55 px-4 py-3">
                    <img src={item.icon} alt="" className="h-10 w-10 object-contain" />
                    <p className="text-lg font-semibold text-[#4f3d2b]">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Link href={isConnected ? '/mining' : '/'}>
                  <GoldButton>{isConnected ? 'Confirm to Vault' : 'Explore Ritual'}</GoldButton>
                </Link>
              </div>
            </ParchmentPanel>
          </div>
        </motion.section>
      </div>
    </SceneShell>
  )
}
