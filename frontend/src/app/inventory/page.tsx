'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

// 模拟矿石数据
const mockOres = [
  { id: 1, type: 'Wisdom', quality: 4, timestamp: '2026-03-30', streak: 15, goalName: '学习 Solidity' },
  { id: 2, type: 'Wisdom', quality: 3, timestamp: '2026-03-29', streak: 14, goalName: '学习 Solidity' },
  { id: 3, type: 'Will', quality: 5, timestamp: '2026-03-30', streak: 8, goalName: '每日健身' },
  { id: 4, type: 'Will', quality: 2, timestamp: '2026-03-29', streak: 7, goalName: '每日健身' },
  { id: 5, type: 'Creation', quality: 4, timestamp: '2026-03-30', streak: 3, goalName: '写作练习' },
]

// 模拟卡片数据
const mockCards = [
  { id: 1, type: 'Wisdom', rarity: 'Basic', createdAt: '2026-03-25' },
  { id: 2, type: 'Will', rarity: 'Basic', createdAt: '2026-03-20' },
]

const oreInfo: Record<string, { name: string; icon: string; color: string; gradient: string }> = {
  Wisdom: { name: '智慧矿石', icon: '💎', color: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
  Will: { name: '意志矿石', icon: '🔥', color: 'text-red-600', gradient: 'from-red-400 to-red-600' },
  Creation: { name: '创造矿石', icon: '✨', color: 'text-yellow-600', gradient: 'from-yellow-400 to-yellow-600' },
  Connection: { name: '连接矿石', icon: '🌿', color: 'text-green-600', gradient: 'from-green-400 to-green-600' },
}

const rarityInfo: Record<string, { name: string; color: string }> = {
  Basic: { name: '基础卡片', color: 'border-gray-400' },
  Advanced: { name: '高级卡片', color: 'border-purple-400' },
  Rare: { name: '稀有卡片', color: 'border-yellow-400' },
}

export default function Inventory() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'ores' | 'cards' | 'medals'>('ores')
  const [selectedOre, setSelectedOre] = useState<typeof mockOres[0] | null>(null)

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎒</div>
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后即可查看你的背包</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">我的背包</h1>

      {/* 标签切换 */}
      <div className="flex space-x-2 mb-8">
        {[
          { key: 'ores', label: '矿石', icon: '💎', count: mockOres.length },
          { key: 'cards', label: '卡片', icon: '🎴', count: mockCards.length },
          { key: 'medals', label: '勋章', icon: '🏆', count: 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 矿石列表 */}
      <AnimatePresence mode="wait">
        {activeTab === 'ores' && (
          <motion.div
            key="ores"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {mockOres.map((ore, index) => (
              <motion.div
                key={ore.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedOre(ore)}
                className="card-magical p-4 rounded-xl cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${oreInfo[ore.type].gradient} flex items-center justify-center text-3xl shadow-lg`}>
                  {oreInfo[ore.type].icon}
                </div>
                <div className="text-center">
                  <div className={`font-medium ${oreInfo[ore.type].color}`}>
                    {oreInfo[ore.type].name}
                  </div>
                  <div className="star-quality text-sm mt-1">
                    {'⭐'.repeat(ore.quality)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {ore.goalName}
                  </div>
                </div>
              </motion.div>
            ))}

            {mockOres.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">⛏️</div>
                <p>还没有矿石，快去记录你的成长吧</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {mockCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`card-magical p-4 rounded-xl border-2 ${rarityInfo[card.rarity].color}`}
              >
                <div className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${oreInfo[card.type].gradient} flex items-center justify-center mb-3`}>
                  <div className="text-6xl">{oreInfo[card.type].icon}</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${oreInfo[card.type].color}`}>
                    {rarityInfo[card.rarity].name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {card.createdAt}
                  </div>
                </div>
              </motion.div>
            ))}

            {mockCards.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🎴</div>
                <p>还没有卡片，去锻造台合成吧</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'medals' && (
          <motion.div
            key="medals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 text-gray-500"
          >
            <div className="text-4xl mb-2">🏆</div>
            <p>还没有勋章，继续努力吧</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 矿石详情弹窗 */}
      <AnimatePresence>
        {selectedOre && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOre(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${oreInfo[selectedOre.type].gradient} flex items-center justify-center text-5xl shadow-lg animate-float`}>
                {oreInfo[selectedOre.type].icon}
              </div>

              <h3 className={`text-xl font-bold text-center ${oreInfo[selectedOre.type].color}`}>
                {oreInfo[selectedOre.type].name}
              </h3>

              <div className="star-quality text-center text-2xl mt-2">
                {'⭐'.repeat(selectedOre.quality)}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">所属目标</span>
                  <span className="font-medium">{selectedOre.goalName}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">铸造日期</span>
                  <span className="font-medium">{selectedOre.timestamp}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">当时连续</span>
                  <span className="font-medium">{selectedOre.streak} 天</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Token ID</span>
                  <span className="font-mono text-sm">#{selectedOre.id}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOre(null)}
                className="w-full mt-6 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
