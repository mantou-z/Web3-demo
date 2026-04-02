'use client'

import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useAccount } from 'wagmi'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 to-blue-600/40 rounded-full blur-3xl animate-glow-pulse" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <span className="text-7xl animate-float">🔮</span>
          </div>
        </div>

        <h1 className="text-5xl font-bold">
          <span className="text-gradient">
            Alcheme
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-lg">
          What you do and how you think build who you are.
          <br />
          <span className="text-gray-500">Define yourself, beyond the rules.</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-12"
      >
        {isConnected ? (
          <Link href="/mining">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold text-lg px-12 py-4"
            >
              ⛏️ 开始采集灵光
            </motion.button>
          </Link>
        ) : (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openConnectModal}
                className="btn-magical text-lg px-12 py-4"
              >
                连接钱包开始旅程
              </motion.button>
            )}
          </ConnectButton.Custom>
        )}
      </motion.div>

      {/* 功能卡片 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
      >
        <FeatureCard
          icon="⛏️"
          title="灵光采集"
          description="输入你的日常，AI提炼核心成就"
          href="/mining"
        />
        <FeatureCard
          icon="⚗️"
          title="成长炼金"
          description="勾选矿石，精炼为里程碑卡片"
          href="/refining"
        />
        <FeatureCard
          icon="✨"
          title="身份铸造"
          description="铸就灵魂勋章，定义你的身份"
          href="/awakening"
        />
      </motion.div>

      {/* 核心流程 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-16 text-center"
      >
        <h2 className="text-lg font-semibold text-gray-300 mb-6">核心流程</h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-400">输入</span>
          <span className="text-gray-600">→</span>
          <span className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400">矿石</span>
          <span className="text-gray-600">→</span>
          <span className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400">卡片</span>
          <span className="text-gray-600">→</span>
          <span className="px-3 py-2 rounded-lg bg-orange-500/10 text-orange-400">勋章</span>
        </div>
      </motion.div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href
}: {
  icon: string
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="card-dark p-6 rounded-2xl cursor-pointer h-full"
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </motion.div>
    </Link>
  )
}
