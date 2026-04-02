'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

interface Card {
  id: string
  title: string
  image_url: string
  created_at: string
}

interface Medal {
  id: string
  title: string
  description: string
  image_url: string
  token_id: number | null
  parent_ids: string[]
  created_at: string
}

// Mock data for development
const mockCards: Card[] = [
  { id: 'card_1', title: '合约炼金术士', image_url: 'https://placehold.co/400x600/1a1a2e/8b5cf6?text=Card1', created_at: '2026-03-30' },
  { id: 'card_2', title: '代码行者', image_url: 'https://placehold.co/400x600/1a1a2e/3b82f6?text=Card2', created_at: '2026-03-29' },
  { id: 'card_3', title: '意志守护者', image_url: 'https://placehold.co/400x600/1a1a2e/ef4444?text=Card3', created_at: '2026-03-28' },
]

export default function AwakeningPage() {
  const { isConnected, address } = useAccount()
  const [cards, setCards] = useState<Card[]>(mockCards)
  const [medals, setMedals] = useState<Medal[]>([])
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [selectedMedal, setSelectedMedal] = useState<string | null>(null)
  const [showCircle, setShowCircle] = useState(false)
  const [isAwakening, setIsAwakening] = useState(false)
  const [newMedal, setNewMedal] = useState<{ title: string; description: string; imageUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      fetchCards()
      fetchMedals()
    }
  }, [isConnected, address])

  const fetchCards = async () => {
    try {
      const res = await fetch(`/api/cards/${address}`)
      const data = await res.json()
      if (data.success && data.cards.length > 0) {
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }

  const fetchMedals = async () => {
    try {
      const res = await fetch(`/api/medals/${address}`)
      const data = await res.json()
      if (data.success) {
        setMedals(data.medals)
      }
    } catch (error) {
      console.error('Error fetching medals:', error)
    }
  }

  const handleSelectCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId))
    } else {
      setSelectedCards([...selectedCards, cardId])
    }
    // 清除勋章选择
    setSelectedMedal(null)
  }

  const handleSelectMedal = (medalId: string) => {
    if (selectedMedal === medalId) {
      setSelectedMedal(null)
    } else {
      setSelectedMedal(medalId)
    }
  }

  const validateSelection = (): boolean => {
    // 必须包含卡片
    if (selectedCards.length === 0) {
      setError('缺少灵光！请放入里程碑卡片')
      return false
    }

    // 如果包含勋章，则勋章只能选1个
    if (selectedMedal) {
      // 只能选1个勋章，这个条件已经满足
    }

    setError(null)
    return true
  }

  const handleAwaken = async () => {
    if (!validateSelection()) {
      // 抖动动画
      return
    }

    setShowCircle(false)
    setIsAwakening(true)

    // 觉醒动画至少3秒
    const awakenPromise = fetch('/api/medals/awaken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: address,
        cardIds: selectedCards,
        existingMedalId: selectedMedal
      })
    }).then(res => res.json())

    const timerPromise = new Promise(resolve => setTimeout(resolve, 3000))

    const [result] = await Promise.all([awakenPromise, timerPromise])

    setIsAwakening(false)

    if (result.success) {
      setNewMedal({
        title: result.medal.title,
        description: result.medal.description,
        imageUrl: result.medal.image_url
      })
      // 刷新数据
      fetchCards()
      fetchMedals()
    } else {
      // Mock response
      setNewMedal({
        title: selectedMedal ? '进化之证' : '觉醒之证',
        description: `凝聚了${selectedCards.length}个里程碑的力量`,
        imageUrl: 'https://placehold.co/400x400/1a1a2e/gold?text=Medal'
      })
    }
  }

  const handleSaveMedal = () => {
    if (!newMedal) return

    // 将新勋章添加到列表
    const newMedalData: Medal = {
      id: `medal_${Date.now()}`,
      title: newMedal.title,
      description: newMedal.description,
      image_url: newMedal.imageUrl,
      token_id: null,
      parent_ids: selectedCards,
      created_at: new Date().toISOString()
    }

    if (selectedMedal) {
      // 进化：更新已有勋章
      setMedals(medals.map(m => m.id === selectedMedal ? newMedalData : m))
    } else {
      // 首次铸造
      setMedals([...medals, newMedalData])
    }

    // 移除已消耗的卡片
    setCards(cards.filter(card => !selectedCards.includes(card.id)))
    setSelectedCards([])
    setSelectedMedal(null)
    setNewMedal(null)
  }

  const handleReset = () => {
    setSelectedCards([])
    setSelectedMedal(null)
    setShowCircle(false)
    setIsAwakening(false)
    setNewMedal(null)
    setError(null)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-6 animate-float">✨</div>
          <h2 className="text-2xl font-bold text-white">请先连接钱包</h2>
          <p className="text-gray-400">连接钱包后即可开始觉醒</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {/* 灵光阵主画面 */}
        {!showCircle && !isAwakening && !newMedal && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 w-full max-w-lg"
          >
            <h1 className="text-3xl font-bold text-white">灵光阵</h1>

            {/* 法阵 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCircle(true)}
              className="cursor-pointer relative w-64 h-64 mx-auto"
            >
              {/* 光晕 */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-glow-pulse" />
              
              {/* 法阵图案 */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-yellow-500/50 rounded-full flex items-center justify-center rune-glow">
                  <div className="w-36 h-36 border border-yellow-500/30 rounded-full flex items-center justify-center">
                    <span className="text-7xl animate-float">⭐</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-gray-400">
              点击法阵，铸就你的灵魂勋章
            </p>

            {/* 已有勋章 */}
            {medals.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">我的勋章</h3>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {medals.map((medal) => (
                    <div
                      key={medal.id}
                      className="flex-shrink-0 w-32 card-dark rounded-xl overflow-hidden"
                    >
                      <img
                        src={medal.image_url}
                        alt={medal.title}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-300 truncate">{medal.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 选择界面 */}
        {showCircle && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">选择材料</h2>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4"
              >
                <p className="text-red-400 text-center">⚠️ {error}</p>
              </motion.div>
            )}

            {/* 里程碑卡片 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                里程碑卡片 ({selectedCards.length} 已选)
              </h3>
              <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                {cards.map((card, index) => {
                  const isSelected = selectedCards.includes(card.id)
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectCard(card.id)}
                      className={`card-dark rounded-xl overflow-hidden cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full aspect-[3/4] object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-300 truncate">{card.title}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* 已有勋章（用于进化） */}
            {medals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  已有勋章（可选，用于进化）
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {medals.map((medal, index) => {
                    const isSelected = selectedMedal === medal.id
                    return (
                      <motion.div
                        key={medal.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectMedal(medal.id)}
                        className={`card-dark rounded-xl overflow-hidden cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-yellow-500' : ''
                        }`}
                      >
                        <img
                          src={medal.image_url}
                          alt={medal.title}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-2">
                          <p className="text-xs text-gray-300 truncate">{medal.title}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAwaken}
              disabled={selectedCards.length === 0}
              className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedMedal ? '进化' : '觉醒'} ✨
            </motion.button>
          </motion.div>
        )}

        {/* 觉醒动画 */}
        {isAwakening && (
          <motion.div
            key="awakening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8"
          >
            <div className="relative w-64 h-64 mx-auto">
              {/* 法阵光芒 */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/50 to-orange-500/50 rounded-full blur-2xl"
              />

              {/* 法阵 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-48 h-48 border-2 border-yellow-500/70 rounded-full" />
              </motion.div>

              {/* 内圈 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-32 h-32 border border-yellow-500/50 rounded-full" />
              </motion.div>

              {/* 中心光芒 */}
              <motion.div
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-6xl">⭐</span>
              </motion.div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400 text-lg"
            >
              {selectedMedal ? '进化中...' : '觉醒中...'}
            </motion.p>
          </motion.div>
        )}

        {/* 勋章显现 */}
        {newMedal && (
          <motion.div
            key="medal"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', duration: 1 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gradient-gold"
              >
                {selectedMedal ? '进化成功！' : '觉醒成功！'}
              </motion.h2>
            </div>

            {/* 勋章 */}
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(251, 191, 36, 0.3)',
                  '0 0 60px rgba(251, 191, 36, 0.6)',
                  '0 0 30px rgba(251, 191, 36, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-64 h-64 mx-auto mb-6"
            >
              {/* 光环 */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-2xl" />
              
              {/* 勋章图片 */}
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50">
                <img
                  src={newMedal.imageUrl}
                  alt="New Medal"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{newMedal.title}</h3>
              <p className="text-gray-400">{newMedal.description}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveMedal}
              className="btn-gold w-full py-4"
            >
              铸造上链 ⛓️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
