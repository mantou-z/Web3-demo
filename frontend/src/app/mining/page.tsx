'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

interface SavedOre {
  id: string
  user_id: string
  raw_input: string
  refined_data: {
    id: number
    text: string
    dimension: 'Wisdom' | 'Will' | 'Creation' | 'Connection'
    score: number
  }
  status: string
  created_at: string
}

interface EditingOre {
  id: number
  text: string
  dimension: 'Wisdom' | 'Will' | 'Creation' | 'Connection'
  score: number
}

const dimensionInfo = {
  Wisdom: { name: '智慧', icon: '💎', color: 'text-blue-400', gradient: 'ore-gradient-wisdom' },
  Will: { name: '意志', icon: '🔥', color: 'text-red-400', gradient: 'ore-gradient-will' },
  Creation: { name: '创造', icon: '✨', color: 'text-yellow-400', gradient: 'ore-gradient-creation' },
  Connection: { name: '连接', icon: '🌿', color: 'text-green-400', gradient: 'ore-gradient-connection' },
}

export default function MiningPage() {
  const { isConnected, address } = useAccount()
  const [stage, setStage] = useState<'welcome' | 'mining' | 'refining' | 'complete'>('welcome')
  const [input, setInput] = useState('')
  const [ores, setOres] = useState<EditingOre[]>([])
  const [savedOres, setSavedOres] = useState<SavedOre[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      fetchSavedOres()
    }
  }, [isConnected, address])

  const fetchSavedOres = async () => {
    try {
      const res = await fetch(`/api/ores/${address}`)
      const data = await res.json()
      if (data.success) {
        setSavedOres(data.ores)
      }
    } catch (error) {
      console.error('Error fetching saved ores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setIsAnalyzing(true)
    setShowInput(false)
    setStage('mining')

    const analyzePromise = fetch('/api/ores/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: address,
        input: input
      })
    }).then(res => res.json())

    const timerPromise = new Promise(resolve => setTimeout(resolve, 3000))

    const [result] = await Promise.all([analyzePromise, timerPromise])

    setIsAnalyzing(false)

    if (result.success) {
      setOres(result.ores)
      setStage('refining')
    } else {
      setOres([
        { id: 1, text: input.slice(0, 30), dimension: 'Wisdom', score: 4 },
      ])
      setStage('refining')
    }
  }

  const handleEditOre = (id: number, newText: string) => {
    setOres(ores.map(ore => ore.id === id ? { ...ore, text: newText } : ore))
  }

  const handleDeleteOre = (id: number) => {
    setOres(ores.filter(ore => ore.id !== id))
  }

  const handleAddOre = () => {
    const newId = Math.max(...ores.map(o => o.id), 0) + 1
    setOres([...ores, {
      id: newId,
      text: '',
      dimension: 'Wisdom',
      score: 3
    }])
  }

  const handleConfirm = async () => {
    try {
      await fetch('/api/ores/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          ores: ores,
          rawInput: input
        })
      })
    } catch (error) {
      console.error('Error saving ores:', error)
    }

    setStage('complete')
    setTimeout(() => {
      setStage('welcome')
      setInput('')
      setOres([])
      fetchSavedOres()
    }, 3000)
  }

  const handleReset = () => {
    setStage('welcome')
    setInput('')
    setOres([])
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-6xl mb-6 animate-float">🔮</div>
          <h2 className="text-2xl font-bold text-white">请先连接钱包</h2>
          <p className="text-gray-400">连接钱包后即可开始采集灵光</p>
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
        {stage === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 w-full max-w-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative"
            >
              <div className="w-48 h-48 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-glow-pulse" />
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <span className="text-8xl animate-float">⛰️</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-white mb-4">
                意念矿山
              </h1>
              <p className="text-gray-400 text-lg">
                你准备好开采今天的魔法矿石了吗？
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInput(true)}
              className="btn-gold text-lg px-12 py-4"
            >
              ⛏️ 开始开采
            </motion.button>

            {savedOres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4">我的矿石 ({savedOres.length})</h3>
                <div className="grid grid-cols-3 gap-3">
                  {savedOres.slice(0, 9).map((ore, index) => {
                    const info = dimensionInfo[ore.refined_data?.dimension || 'Wisdom']
                    return (
                      <motion.div
                        key={ore.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="card-dark p-3 rounded-xl"
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-lg ${info.gradient} flex items-center justify-center text-xl`}>
                          {info.icon}
                        </div>
                        <p className="text-xs text-gray-300 text-center truncate">
                          {ore.refined_data?.text || '未提炼'}
                        </p>
                        <div className="flex items-center justify-center mt-1">
                          {[...Array(ore.refined_data?.score || 0)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {ore.created_at?.split('T')[0] || ''}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
                {savedOres.length > 9 && (
                  <p className="text-gray-500 text-sm text-center mt-3">
                    +{savedOres.length - 9} 更多矿石...
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === 'mining' && (
          <motion.div
            key="mining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8"
          >
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-2xl" />
              
              <motion.div
                animate={{
                  rotate: [0, -30, 0, -30, 0],
                  y: [0, -20, 0, -20, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-7xl">⛏️</span>
              </motion.div>

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 96,
                    y: 96,
                    opacity: 1
                  }}
                  animate={{
                    x: 96 + (Math.random() - 0.5) * 150,
                    y: 96 + (Math.random() - 0.5) * 150,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-400 text-lg"
            >
              正在提炼灵光...
            </motion.p>
          </motion.div>
        )}

        {stage === 'refining' && (
          <motion.div
            key="refining"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg space-y-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto"
              >
                <div className="w-full h-full ore-gradient-wisdom rounded-2xl flex items-center justify-center text-4xl">
                  💎
                </div>
              </motion.div>
              <h2 className="text-xl font-bold text-white mt-4">灵光显现</h2>
            </div>

            <div className="card-dark rounded-2xl p-6 space-y-4">
              <p className="text-gray-400 text-sm">以下是AI提炼的灵光矿石：</p>
              
              {ores.map((ore, index) => (
                <motion.div
                  key={ore.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dimensionInfo[ore.dimension].gradient}`}>
                    <span className="text-lg">{dimensionInfo[ore.dimension].icon}</span>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ore.text}
                      onChange={(e) => handleEditOre(ore.id, e.target.value)}
                      className="input-magical text-sm"
                      placeholder="输入灵光描述..."
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteOre(ore.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    🗑️
                  </button>
                </motion.div>
              ))}

              <button
                onClick={handleAddOre}
                className="w-full py-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                + 补充灵光
              </button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-500 text-sm">
                这些是你今日精炼的原始矿石，确认收入矿石池吗？
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfirm}
                disabled={ores.length === 0}
                className="btn-gold w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认收纳 ✨
              </motion.button>
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -50, opacity: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="text-6xl"
            >
              {ores.map((ore, i) => (
                <motion.span
                  key={ore.id}
                  initial={{ x: 0, y: 0 }}
                  animate={{
                    x: (i - ores.length / 2) * 30,
                    y: -100,
                    opacity: 0
                  }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                  className="inline-block mx-1"
                >
                  {dimensionInfo[ore.dimension].icon}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gradient mb-2">
                入库成功！
              </h2>
              <p className="text-gray-400">
                {ores.length} 块灵光矿石已存入矿池
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-lg space-y-4"
            >
              <h3 className="text-xl font-bold text-white text-center">
                灵光录入
              </h3>
              <p className="text-gray-400 text-sm text-center">
                记录你今天的学习、思考或成长...
              </p>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-magical resize-none h-40"
                placeholder="例如：今天学习了Solidity，终于理解了合约的存储布局..."
                autoFocus
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInput(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  取消
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalyze}
                  disabled={!input.trim()}
                  className="flex-1 btn-magical disabled:opacity-50"
                >
                  投递 ⚡
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
