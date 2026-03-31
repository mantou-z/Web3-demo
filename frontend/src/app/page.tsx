'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-6xl mb-6 animate-float">⚒️</div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 bg-clip-text text-transparent">
            Growth Forge
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-xl">
          让每一滴努力都成为可触摸的数字资产
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="space-y-4"
      >
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button onClick={openConnectModal} className="btn-magical text-lg">
              连接钱包开始锻造
            </button>
          )}
        </ConnectButton.Custom>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <FeatureCard
          icon="🎯"
          title="设定目标"
          description="创建你想要达成的成长目标"
        />
        <FeatureCard
          icon="⛏️"
          title="积累矿石"
          description="每日践行，铸造专属成长矿石"
        />
        <FeatureCard
          icon="🏆"
          title="获得勋章"
          description="合成卡片，锻造成就勋章"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <StatCard number="1,234" label="已铸造矿石" />
        <StatCard number="567" label="活跃目标" />
        <StatCard number="89" label="已获得勋章" />
        <StatCard number="456" label="参与用户" />
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="card-magical p-6 rounded-2xl"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  )
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-purple-600">{number}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
