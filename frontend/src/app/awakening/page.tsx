'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useMintMedal } from '@/hooks/useContracts'

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

export default function AwakeningPage() {
  const { isConnected, address } = useAccount()
  const [cards, setCards] = useState<Card[]>([])
  const [medals, setMedals] = useState<Medal[]>([])
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [selectedMedal, setSelectedMedal] = useState<string | null>(null)
  const [showCircle, setShowCircle] = useState(false)
  const [isAwakening, setIsAwakening] = useState(false)
  const [newMedal, setNewMedal] = useState<{ id: string; title: string; description: string; imageUrl: string } | null>(null)
  const [editableMedalTitle, setEditableMedalTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { mintMedal, isPending: isMinting, isConfirmed: mintConfirmed, receipt } = useMintMedal()

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address])

  const fetchData = async () => {
    setIsLoading(true)
    await Promise.all([fetchCards(), fetchMedals()])
    setIsLoading(false)
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
    setSelectedMedal(null)
  }

  const handleSelectMedal = (medalId: string) => {
    setSelectedMedal(selectedMedal === medalId ? null : medalId)
  }

  const validateSelection = (): boolean => {
    if (selectedCards.length === 0) {
      setError('缺少灵光！请放入里程碑卡片')
      return false
    }
    setError(null)
    return true
  }

  const handleAwaken = async () => {
    if (!validateSelection()) return

    setShowCircle(false)
    setIsAwakening(true)

    try {
      const res = await fetch('/api/medals/awaken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          cardIds: selectedCards,
          existingMedalId: selectedMedal
        })
      })

      // 等待至少3秒的动画
      await new Promise(resolve => setTimeout(resolve, 3000))

      const result = await res.json()
      setIsAwakening(false)

      if (result.success) {
        setNewMedal({
          id: result.medal.id,
          title: result.medal.title,
          description: result.medal.description,
          imageUrl: result.medal.image_url
        })
        setEditableMedalTitle(result.medal.title)
      } else {
        setError(result.error || '觉醒失败')
      }
    } catch (error) {
      setIsAwakening(false)
      console.error('Awaken error:', error)
      setError('觉醒请求失败')
    }
  }

  const handleMintToChain = async () => {
    if (!newMedal) return

    // 如果标题被修改，先保存到后端
    if (editableMedalTitle !== newMedal.title) {
      try {
        await fetch(`/api/medals/${newMedal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editableMedalTitle })
        })
      } catch (error) {
        console.error('Error saving medal title:', error)
      }
    }

    try {
      mintMedal(
        newMedal.imageUrl,
        editableMedalTitle,
        newMedal.description
      )
    } catch (error) {
      console.error('Mint error:', error)
      alert('上链失败')
    }
  }

  // 监听铸造成功
  useEffect(() => {
    if (mintConfirmed && receipt && newMedal) {
      // 从日志中解析 MedalMinted 事件获取真实 tokenId
      const medalMintedEvent = receipt.logs.find(log => {
        return log.topics[0] === '0xdccdb8897eec6a644b93d2ff2b1d5a7fee4603857d745585ad971dfcd0ccd299'
      })

      if (medalMintedEvent && medalMintedEvent.topics[2]) {
        const realTokenId = BigInt(medalMintedEvent.topics[2])

        fetch(`/api/medals/${newMedal.id}/mint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: realTokenId.toString() })
        }).then(() => {
          fetchData()
          setSelectedCards([])
          setSelectedMedal(null)
          setNewMedal(null)
        })
      }
    }
  }, [mintConfirmed, receipt])

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-6xl mb-6 animate-float">✨</div>
          <h2 className="text-2xl font-bold text-white">请先连接钱包</h2>
          <p className="text-gray-400">连接钱包后即可开始觉醒</p>
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
        {/* 灵光阵主画面 */}
        {!showCircle && !isAwakening && !newMedal && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 w-full max-w-lg">
            <h1 className="text-3xl font-bold text-white">灵光阵</h1>

            {/* 法阵 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCircle(true)}
              className="cursor-pointer relative w-64 h-64 mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-3xl animate-glow-pulse" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-yellow-500/50 rounded-full flex items-center justify-center rune-glow">
                  <div className="w-36 h-36 border border-yellow-500/30 rounded-full flex items-center justify-center">
                    <span className="text-7xl animate-float">⭐</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="text-gray-400">点击法阵，铸就你的灵魂勋章</p>

            {/* 卡片数量提示 */}
            <div className="glass rounded-xl p-4 inline-block">
              <p className="text-gray-300">
                你有 <span className="text-purple-400 font-bold">{cards.length}</span> 张卡片可用
              </p>
            </div>

            {/* 已有勋章 */}
            {medals.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">我的勋章 ({medals.length})</h3>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {medals.map((medal) => (
                    <div key={medal.id} className="flex-shrink-0 w-32 card-dark rounded-xl overflow-hidden">
                      <img src={medal.image_url} alt={medal.title} className="w-full aspect-square object-cover" />
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
          <motion.div key="selection" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">选择材料</h2>
              <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors">✕</button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
                <p className="text-red-400 text-center">⚠️ {error}</p>
              </motion.div>
            )}

            {/* 里程碑卡片 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">里程碑卡片 ({selectedCards.length} 已选)</h3>
              {cards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>没有可用的卡片</p>
                  <p className="text-sm">请先去精炼矿石</p>
                </div>
              ) : (
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
                        className={`card-dark rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                      >
                        <img src={card.image_url} alt={card.title} className="w-full aspect-[3/4] object-cover" />
                        <div className="p-2">
                          <p className="text-xs text-gray-300 truncate">{card.title}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 已有勋章（用于进化） */}
            {medals.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">已有勋章（可选，用于进化）</h3>
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
                        className={`card-dark rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        <img src={medal.image_url} alt={medal.title} className="w-full aspect-square object-cover" />
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
          <motion.div key="awakening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8">
            <div className="relative w-64 h-64 mx-auto">
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-gradient-to-br from-yellow-500/50 to-orange-500/50 rounded-full blur-2xl" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-yellow-500/70 rounded-full" />
              </motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-yellow-500/50 rounded-full" />
              </motion.div>
              <motion.div animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }} className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">⭐</span>
              </motion.div>
            </div>
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-gray-400 text-lg">
              {selectedMedal ? '进化中...' : '觉醒中...'}
            </motion.p>
          </motion.div>
        )}

        {/* 勋章显现 */}
        {newMedal && (
          <motion.div key="medal" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={{ type: 'spring', duration: 1 }} className="w-full max-w-sm">
            <div className="text-center mb-6">
              <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-bold text-gradient-gold">
                {selectedMedal ? '进化成功！' : '觉醒成功！'}
              </motion.h2>
            </div>

            <motion.div
              animate={{ boxShadow: ['0 0 30px rgba(251, 191, 36, 0.3)', '0 0 60px rgba(251, 191, 36, 0.6)', '0 0 30px rgba(251, 191, 36, 0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative w-64 h-64 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-2xl" />
              <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50">
                <img src={newMedal.imageUrl} alt="New Medal" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <div className="text-center mb-6">
              <input
                type="text"
                value={editableMedalTitle}
                onChange={(e) => setEditableMedalTitle(e.target.value)}
                className="w-full bg-transparent text-center text-2xl font-bold text-white border-b border-yellow-500/50 focus:outline-none focus:border-yellow-500 mb-2"
              />
              <p className="text-gray-400">{newMedal.description}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMintToChain}
              disabled={isMinting}
              className="btn-gold w-full py-4 disabled:opacity-50"
            >
              {isMinting ? '上链中...' : '铸造上链 ⛓️'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
