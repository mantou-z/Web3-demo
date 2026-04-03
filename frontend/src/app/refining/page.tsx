'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

interface Ore {
  id: string
  refined_data: {
    text: string
    dimension: 'Wisdom' | 'Will' | 'Creation' | 'Connection'
    score: number
  }
  created_at: string
}

interface Card {
  id: string
  title: string
  image_url: string
  created_at: string
}

const dimensionInfo = {
  Wisdom: { name: '智慧', icon: '💎', gradient: 'ore-gradient-wisdom' },
  Will: { name: '意志', icon: '🔥', gradient: 'ore-gradient-will' },
  Creation: { name: '创造', icon: '✨', gradient: 'ore-gradient-creation' },
  Connection: { name: '连接', icon: '🌿', gradient: 'ore-gradient-connection' },
}

export default function RefiningPage() {
  const { isConnected, address } = useAccount()
  const [ores, setOres] = useState<Ore[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedOres, setSelectedOres] = useState<string[]>([])
  const [showCabinet, setShowCabinet] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [newCard, setNewCard] = useState<{ title: string; imageUrl: string } | null>(null)
  const [editableTitle, setEditableTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address])

  const fetchData = async () => {
    setIsLoading(true)
    await Promise.all([fetchOres(), fetchCards()])
    setIsLoading(false)
  }

  const fetchOres = async () => {
    try {
      const res = await fetch(`/api/ores/${address}`)
      const data = await res.json()
      if (data.success) {
        setOres(data.ores)
      }
    } catch (error) {
      console.error('Error fetching ores:', error)
    }
  }

  const fetchCards = async () => {
    try {
      const res = await fetch(`/api/cards/${address}`)
      const data = await res.json()
      if (data.success) {
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }

  const handleSelectOre = (oreId: string) => {
    if (selectedOres.includes(oreId)) {
      setSelectedOres(selectedOres.filter(id => id !== oreId))
    } else {
      setSelectedOres([...selectedOres, oreId])
    }
  }

  const handleRefine = async () => {
    if (selectedOres.length === 0) return

    setShowCabinet(false)
    setIsRefining(true)

    // 精炼动画至少3秒
    const refinePromise = fetch('/api/cards/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: address,
        oreIds: selectedOres
      })
    }).then(res => res.json())

    const timerPromise = new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const [result] = await Promise.all([refinePromise, timerPromise])

      setIsRefining(false)

      if (result.success) {
        setNewCard({
          title: result.card.title,
          imageUrl: result.card.image_url
        })
        setEditableTitle(result.card.title)
      } else {
        alert('精炼失败：' + (result.error || '未知错误'))
        setNewCard(null)
      }
    } catch (error) {
      setIsRefining(false)
      console.error('Refine error:', error)
      alert('精炼请求失败')
    }
  }

  const handleSaveCard = () => {
    if (!newCard) return

    // 刷新数据
    fetchData()
    setSelectedOres([])
    setNewCard(null)
  }

  const handleReset = () => {
    setSelectedOres([])
    setShowCabinet(false)
    setIsRefining(false)
    setNewCard(null)
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-6 animate-float">⚗️</div>
          <h2 className="text-2xl font-bold text-white">请先连接钱包</h2>
          <p className="text-gray-400">连接钱包后即可开始精炼矿石</p>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-spin">⚙️</div>
        <p className="text-gray-400 mt-4">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {/* 大锅主画面 */}
        {!showCabinet && !isRefining && !newCard && (
          <motion.div
            key="cauldron"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 w-full max-w-lg"
          >
            <h1 className="text-3xl font-bold text-white">炼金实验室</h1>

            {/* 大锅 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCabinet(true)}
              className="cursor-pointer relative w-64 h-64 mx-auto"
            >
              {/* 光晕 */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-glow-pulse" />
              
              {/* 大锅 */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <span className="text-9xl animate-float">🧪</span>
              </div>

              {/* 气泡 */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-purple-500/50 rounded-full"
                  initial={{ x: 128, y: 180, opacity: 0.8 }}
                  animate={{ x: 128 + (Math.random() - 0.5) * 80, y: 60, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </motion.div>

            <p className="text-gray-400">
              点击大锅，开始精炼矿石
            </p>

            {/* 矿石数量提示 */}
            <div className="glass rounded-xl p-4 inline-block">
              <p className="text-gray-300">
                你有 <span className="text-purple-400 font-bold">{ores.length}</span> 块矿石可用
              </p>
            </div>

            {/* 已有卡片 */}
            {cards.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">我的卡片 ({cards.length})</h3>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {cards.map((card) => (
                    <div key={card.id} className="flex-shrink-0 w-32 card-dark rounded-xl overflow-hidden">
                      <img src={card.image_url} alt={card.title} className="w-full aspect-[3/4] object-cover" />
                      <div className="p-2">
                        <p className="text-xs text-gray-300 truncate">{card.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 炼金橱柜 */}
        {showCabinet && (
          <motion.div
            key="cabinet"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">炼金橱柜</h2>
              <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              选择要精炼的矿石（{selectedOres.length} 已选）
            </p>

            {/* 矿石网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
              {ores.map((ore, index) => {
                const isSelected = selectedOres.includes(ore.id)
                const info = dimensionInfo[ore.refined_data?.dimension || 'Wisdom']
                return (
                  <motion.div
                    key={ore.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectOre(ore.id)}
                    className={`card-dark p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-xl ${info.gradient} flex items-center justify-center text-2xl`}>
                      {info.icon}
                    </div>
                    <p className="text-xs text-gray-300 text-center truncate">
                      {ore.refined_data?.text || '未提炼'}
                    </p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {ore.created_at?.split('T')[0]}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {ores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>没有可用的矿石</p>
                <p className="text-sm">请先去采集灵光</p>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefine}
                disabled={selectedOres.length === 0}
                className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                精炼 ✨ ({selectedOres.length} 块矿石)
              </motion.button>
            )}
          </motion.div>
        )}

        {/* 精炼动画 */}
        {isRefining && (
          <motion.div
            key="refining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8"
          >
            <div className="relative w-64 h-64 mx-auto">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-9xl">🧪</span>
              </motion.div>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                  initial={{ x: 128, y: 200, opacity: 1 }}
                  animate={{ x: 128 + (Math.random() - 0.5) * 200, y: 40 + Math.random() * 100, opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.05 }}
                />
              ))}
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400 text-lg"
            >
              正在精炼中...
            </motion.p>
          </motion.div>
        )}

        {/* 卡片显现 */}
        {newCard && (
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gradient">精炼成功！</h2>
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                  '0 0 40px rgba(139, 92, 246, 0.6)',
                  '0 0 20px rgba(139, 92, 246, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="card-dark rounded-2xl overflow-hidden mb-6"
            >
              <img src={newCard.imageUrl} alt="New Card" className="w-full aspect-[3/4] object-cover" />
              <div className="p-4">
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full bg-transparent text-center text-lg font-semibold text-white border-b border-purple-500/50 focus:outline-none focus:border-purple-500"
                />
              </div>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveCard}
              className="btn-gold w-full py-4"
            >
              收纳进库 ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
