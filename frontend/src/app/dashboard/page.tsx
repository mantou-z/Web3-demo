'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAccount } from 'wagmi'

// 模拟数据
const mockGoals = [
  {
    id: 1,
    name: '学习 Solidity',
    description: '掌握智能合约开发',
    category: 'Learning',
    oreType: 'Wisdom',
    progress: 80,
    streak: 15,
    totalOres: 23,
  },
  {
    id: 2,
    name: '每日健身',
    description: '保持健康体魄',
    category: 'Fitness',
    oreType: 'Will',
    progress: 60,
    streak: 8,
    totalOres: 15,
  },
  {
    id: 3,
    name: '写作练习',
    description: '提升表达能力',
    category: 'Creation',
    oreType: 'Creation',
    progress: 40,
    streak: 3,
    totalOres: 7,
  },
]

const oreColors: Record<string, { bg: string; text: string; icon: string }> = {
  Wisdom: { bg: 'bg-blue-100', text: 'text-blue-600', icon: '🔵' },
  Will: { bg: 'bg-red-100', text: 'text-red-600', icon: '🔴' },
  Creation: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '🟡' },
  Connection: { bg: 'bg-green-100', text: 'text-green-600', icon: '🟢' },
}

export default function Dashboard() {
  const { isConnected } = useAccount()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [goals, setGoals] = useState(mockGoals)

  const handleCreateGoal = (newGoal: { name: string; description: string; category: string }) => {
    const oreTypes: Record<string, string> = {
      Learning: 'Wisdom',
      Fitness: 'Will',
      Creation: 'Creation',
      Social: 'Connection',
    }
    
    setGoals([
      ...goals,
      {
        id: goals.length + 1,
        ...newGoal,
        oreType: oreTypes[newGoal.category] || 'Wisdom',
        progress: 0,
        streak: 0,
        totalOres: 0,
      },
    ])
    setShowCreateModal(false)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
        <p className="text-gray-600">连接钱包后即可管理你的目标</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">我的目标</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-magical"
        >
          + 新建目标
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/goal/${goal.id}`}>
                <div className="card-magical p-6 rounded-2xl hover:cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${oreColors[goal.oreType].bg} flex items-center justify-center text-2xl`}>
                        {oreColors[goal.oreType].icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{goal.name}</h3>
                        <p className="text-gray-500 text-sm">{goal.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">连续</div>
                      <div className={`text-xl font-bold ${oreColors[goal.oreType].text}`}>
                        {goal.streak}天
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">进度</span>
                      <span className={oreColors[goal.oreType].text}>{goal.progress}%</span>
                    </div>
                    <div className="progress-magical">
                      <div
                        className="progress-magical-fill"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500">已产出矿石: {goal.totalOres}</span>
                    <span className={`${oreColors[goal.oreType].text} font-medium`}>
                      查看详情 →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 创建目标弹窗 */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateGoalModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateGoal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CreateGoalModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (goal: { name: string; description: string; category: string }) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Learning')

  const categories = [
    { value: 'Learning', label: '学习', icon: '📚' },
    { value: 'Fitness', label: '健身', icon: '💪' },
    { value: 'Creation', label: '创作', icon: '🎨' },
    { value: 'Social', label: '社交', icon: '🤝' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreate({ name, description, category })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">创建新目标</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-magical"
              placeholder="例如：学会吉他"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-magical resize-none"
              rows={3}
              placeholder="描述你的目标..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标分类
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    category === cat.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button type="submit" className="flex-1 btn-magical">
              创建目标
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
