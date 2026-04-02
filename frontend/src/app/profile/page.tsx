'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'

interface Dimension {
  name: string
  score: number
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

// Mock data
const defaultDimensions: Dimension[] = [
  { name: '智慧', score: 30 },
  { name: '意志', score: 30 },
  { name: '创造', score: 30 },
  { name: '感知', score: 30 },
  { name: '技术', score: 30 },
  { name: '韧性', score: 30 },
]

const mockMedals: Medal[] = [
  {
    id: 'medal_1',
    title: 'Web3探险家',
    description: '历经30天Solidity学习，完成5个里程碑',
    image_url: 'https://placehold.co/400x400/1a1a2e/gold?text=Medal1',
    token_id: 1,
    parent_ids: ['card_1', 'card_2'],
    created_at: '2026-03-30'
  },
  {
    id: 'medal_2',
    title: '意志守护者',
    description: '连续健身60天，铸就钢铁之躯',
    image_url: 'https://placehold.co/400x400/1a1a2e/ef4444?text=Medal2',
    token_id: 2,
    parent_ids: ['card_3'],
    created_at: '2026-03-25'
  },
]

export default function ProfilePage() {
  const { isConnected, address } = useAccount()
  const [dimensions, setDimensions] = useState<Dimension[]>(defaultDimensions)
  const [medals, setMedals] = useState<Medal[]>(mockMedals)
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      fetchMedals()
    }
  }, [isConnected, address])

  const fetchMedals = async () => {
    try {
      const res = await fetch(`/api/medals/${address}`)
      const data = await res.json()
      if (data.success && data.medals.length > 0) {
        setMedals(data.medals)
      }
    } catch (error) {
      console.error('Error fetching medals:', error)
    }
  }

  const updateDimension = (index: number, field: 'name' | 'score', value: string | number) => {
    const newDimensions = [...dimensions]
    newDimensions[index] = { ...newDimensions[index], [field]: value }
    setDimensions(newDimensions)
  }

  // 计算雷达图点位置
  const getRadarPoints = () => {
    const centerX = 150
    const centerY = 150
    const maxRadius = 120

    return dimensions.map((dim, i) => {
      const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
      const radius = (dim.score / 100) * maxRadius
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        labelX: centerX + Math.cos(angle) * (maxRadius + 30),
        labelY: centerY + Math.sin(angle) * (maxRadius + 30),
      }
    })
  }

  const radarPoints = getRadarPoints()
  const polygonPoints = radarPoints.map(p => `${p.x},${p.y}`).join(' ')

  // 绘制网格
  const getGridPolygons = () => {
    const levels = [0.2, 0.4, 0.6, 0.8, 1]
    const centerX = 150
    const centerY = 150
    const maxRadius = 120

    return levels.map(level => {
      const points = dimensions.map((_, i) => {
        const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
        const radius = maxRadius * level
        return `${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`
      }).join(' ')
      return points
    })
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
          <p className="text-gray-400">连接钱包后即可查看灵魂画像</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl">
          🔮
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </h1>
        <p className="text-gray-400">What you do and how you think build who you are.</p>
      </motion.div>

      {/* 雷达图区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-dark rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">灵魂雷达</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isEditing ? '完成' : '编辑'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* 雷达图 */}
          <div className="w-full md:w-1/2">
            <svg viewBox="0 0 300 300" className="w-full">
              {/* 背景网格 */}
              {getGridPolygons().map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="rgba(139, 92, 246, 0.1)"
                  strokeWidth="1"
                />
              ))}

              {/* 连接线 */}
              {radarPoints.map((point, i) => (
                <line
                  key={i}
                  x1="150"
                  y1="150"
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth="1"
                />
              ))}

              {/* 数据多边形 */}
              <motion.polygon
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                points={polygonPoints}
                fill="rgba(139, 92, 246, 0.2)"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth="2"
              />

              {/* 数据点 */}
              {radarPoints.map((point, i) => (
                <motion.circle
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#8B5CF6"
                />
              ))}

              {/* 标签 */}
              {dimensions.map((dim, i) => (
                <text
                  key={i}
                  x={radarPoints[i].labelX}
                  y={radarPoints[i].labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#9CA3AF"
                  fontSize="12"
                >
                  {dim.name}
                </text>
              ))}
            </svg>
          </div>

          {/* 维度编辑 */}
          <div className="w-full md:w-1/2 space-y-3">
            {dimensions.map((dim, i) => (
              <div key={i} className="flex items-center space-x-3">
                {isEditing ? (
                  <input
                    type="text"
                    value={dim.name}
                    onChange={(e) => updateDimension(i, 'name', e.target.value)}
                    className="w-20 bg-transparent text-sm text-gray-300 border-b border-purple-500/50 focus:outline-none"
                  />
                ) : (
                  <span className="w-20 text-sm text-gray-400">{dim.name}</span>
                )}
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dim.score}
                    onChange={(e) => updateDimension(i, 'score', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
                <span className="w-8 text-sm text-purple-400">{dim.score}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 勋章墙 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">灵魂勋章</h2>

        {medals.length === 0 ? (
          <div className="card-dark rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-gray-400">还没有勋章</p>
            <p className="text-sm text-gray-500">去觉醒你的第一个勋章吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {medals.map((medal, index) => (
              <motion.div
                key={medal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMedal(medal)}
                className="card-dark rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="aspect-square relative">
                  <img
                    src={medal.image_url}
                    alt={medal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">{medal.title}</h3>
                    <p className="text-xs text-gray-400 truncate">{medal.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* 勋章详情弹窗 */}
      <AnimatePresence>
        {selectedMedal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMedal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 w-full max-w-md"
            >
              {/* 勋章图片 */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full blur-2xl" />
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50">
                  <img
                    src={selectedMedal.image_url}
                    alt={selectedMedal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gradient-gold mb-2">
                  {selectedMedal.title}
                </h2>
                <p className="text-gray-400">{selectedMedal.description}</p>
              </div>

              {/* 详情信息 */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-500">铸造时间</span>
                  <span className="text-gray-300">{selectedMedal.created_at?.split('T')[0]}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-500">Token ID</span>
                  <span className="text-gray-300">
                    {selectedMedal.token_id !== null ? `#${selectedMedal.token_id}` : '未上链'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-500">里程碑数量</span>
                  <span className="text-gray-300">{selectedMedal.parent_ids?.length || 0} 个</span>
                </div>
              </div>

              {/* 热力图占位 */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">成长轨迹</p>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(35)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        Math.random() > 0.6
                          ? 'bg-purple-500'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedMedal(null)}
                className="w-full mt-6 py-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
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
