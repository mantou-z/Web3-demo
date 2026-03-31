'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

// 模拟矿石数据
const mockOres = [
  { id: 1, type: 'Wisdom', quality: 4, timestamp: '2026-03-30', streak: 15, goalName: '学习 Solidity' },
  { id: 2, type: 'Wisdom', quality: 3, timestamp: '2026-03-29', streak: 14, goalName: '学习 Solidity' },
  { id: 3, type: 'Wisdom', quality: 5, timestamp: '2026-03-28', streak: 13, goalName: '学习 Solidity' },
  { id: 4, type: 'Wisdom', quality: 2, timestamp: '2026-03-27', streak: 12, goalName: '学习 Solidity' },
  { id: 5, type: 'Wisdom', quality: 4, timestamp: '2026-03-26', streak: 11, goalName: '学习 Solidity' },
  { id: 6, type: 'Wisdom', quality: 3, timestamp: '2026-03-25', streak: 10, goalName: '学习 Solidity' },
  { id: 7, type: 'Will', quality: 5, timestamp: '2026-03-30', streak: 8, goalName: '每日健身' },
  { id: 8, type: 'Will', quality: 2, timestamp: '2026-03-29', streak: 7, goalName: '每日健身' },
  { id: 9, type: 'Will', quality: 4, timestamp: '2026-03-28', streak: 6, goalName: '每日健身' },
  { id: 10, type: 'Will', quality: 3, timestamp: '2026-03-27', streak: 5, goalName: '每日健身' },
  { id: 11, type: 'Will', quality: 4, timestamp: '2026-03-26', streak: 4, goalName: '每日健身' },
]

const oreInfo: Record<string, { name: string; icon: string; color: string; gradient: string }> = {
  Wisdom: { name: '智慧矿石', icon: '💎', color: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
  Will: { name: '意志矿石', icon: '🔥', color: 'text-red-600', gradient: 'from-red-400 to-red-600' },
  Creation: { name: '创造矿石', icon: '✨', color: 'text-yellow-600', gradient: 'from-yellow-400 to-yellow-600' },
  Connection: { name: '连接矿石', icon: '🌿', color: 'text-green-600', gradient: 'from-green-400 to-green-600' },
}

type OreType = 'Wisdom' | 'Will' | 'Creation' | 'Connection'

export default function Forge() {
  const { isConnected } = useAccount()
  const [selectedType, setSelectedType] = useState<OreType | null>(null)
  const [selectedOres, setSelectedOres] = useState<number[]>([])
  const [isForging, setIsForging] = useState(false)
  const [forgeComplete, setForgeComplete] = useState(false)

  const oreTypes: OreType[] = ['Wisdom', 'Will', 'Creation', 'Connection']

  const availableOres = selectedType
    ? mockOres.filter((ore) => ore.type === selectedType && !selectedOres.includes(ore.id))
    : []

  const selectedOreDetails = mockOres.filter((ore) => selectedOres.includes(ore.id))

  const canForge = selectedOres.length >= 5

  const handleSelectOre = (oreId: number) => {
    if (selectedOres.includes(oreId)) {
      setSelectedOres(selectedOres.filter((id) => id !== oreId))
    } else if (selectedOres.length < 10) {
      setSelectedOres([...selectedOres, oreId])
    }
  }

  const handleForge = async () => {
    if (!canForge) return

    setIsForging(true)
    // 模拟锻造过程
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsForging(false)
    setForgeComplete(true)

    // 重置
    setTimeout(() => {
      setForgeComplete(false)
      setSelectedOres([])
      setSelectedType(null)
    }, 3000)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚒️</div>
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后即可使用锻造台</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">锻造台</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 左侧：选择矿石 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">选择矿石类型</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {oreTypes.map((type) => {
              const count = mockOres.filter((o) => o.type === type).length
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type)
                    setSelectedOres([])
                  }}
                  disabled={count < 5}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedType === type
                      ? 'border-purple-500 bg-purple-50'
                      : count >= 5
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-2">{oreInfo[type].icon}</div>
                  <div className={`font-medium ${oreInfo[type].color}`}>
                    {oreInfo[type].name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {count} 个可用
                  </div>
                </button>
              )
            })}
          </div>

          {selectedType && (
            <>
              <h2 className="text-lg font-semibold mb-4">
                选择矿石 ({selectedOres.length}/10)
              </h2>
              <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
                {availableOres.map((ore) => (
                  <motion.button
                    key={ore.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectOre(ore.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedOres.includes(ore.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${oreInfo[ore.type].gradient} flex items-center justify-center text-xl`}>
                      {oreInfo[ore.type].icon}
                    </div>
                    <div className="star-quality text-xs">
                      {'⭐'.repeat(ore.quality)}
                    </div>
                  </motion.button>
                ))}

                {availableOres.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    没有可用的{oreInfo[selectedType].name}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 右侧：锻造预览 */}
        <div>
          <h2 className="text-lg font-semibold mb-4">锻造预览</h2>

          <div className="card-magical p-6 rounded-2xl">
            {/* 已选矿石 */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-3">已选矿石</div>
              <div className="flex flex-wrap gap-2 min-h-[60px]">
                {selectedOreDetails.map((ore) => (
                  <motion.div
                    key={ore.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => handleSelectOre(ore.id)}
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${oreInfo[ore.type].gradient} flex items-center justify-center text-xl cursor-pointer hover:opacity-80`}
                  >
                    {oreInfo[ore.type].icon}
                  </motion.div>
                ))}
                {selectedOres.length === 0 && (
                  <div className="text-gray-400 text-sm py-4">
                    从左侧选择矿石
                  </div>
                )}
              </div>
            </div>

            {/* 合成规则 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm font-medium mb-2">合成规则</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 5颗矿石 → 基础卡片</div>
                <div>• 10颗矿石 → 高级卡片</div>
                <div className="text-xs text-gray-400 mt-2">
                  * 需要同类型矿石
                </div>
              </div>
            </div>

            {/* 预计产出 */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-600 mb-2">预计产出</div>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 flex items-center justify-center">
                  <span className="text-3xl">🎴</span>
                </div>
                <div>
                  <div className="font-medium">
                    {selectedOres.length >= 10 ? '高级' : '基础'}卡片
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedType ? oreInfo[selectedType].name.replace('矿石', '') : '???'}系
                  </div>
                </div>
              </div>
            </div>

            {/* 锻造按钮 */}
            <button
              onClick={handleForge}
              disabled={!canForge || isForging}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                canForge
                  ? 'btn-magical'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isForging ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  锻造中...
                </span>
              ) : (
                `⚒️ 锻造卡片 (${selectedOres.length}/5)`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 锻造成功弹窗 */}
      <AnimatePresence>
        {forgeComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.3)',
                    '0 0 40px rgba(139, 92, 246, 0.6)',
                    '0 0 20px rgba(139, 92, 246, 0.3)',
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-32 h-48 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 border-4 border-purple-400 flex items-center justify-center"
              >
                <span className="text-6xl">🎴</span>
              </motion.div>

              <h2 className="text-2xl font-bold text-purple-600 mb-2">
                锻造成功！
              </h2>
              <p className="text-gray-600">
                获得一张{selectedOres.length >= 10 ? '高级' : '基础'}卡片
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
