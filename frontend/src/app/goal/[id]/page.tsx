'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// 模拟目标数据
const mockGoal = {
  id: 1,
  name: '学习 Solidity',
  description: '掌握智能合约开发基础',
  category: 'Learning',
  oreType: 'Wisdom',
  progress: 80,
  streak: 15,
  totalOres: 23,
  longestStreak: 20,
}

// 模拟历史记录
const mockRecords = [
  { id: 1, date: '2026-03-30', quality: 4, content: '今天学习了ERC721合约的实现...' },
  { id: 2, date: '2026-03-29', quality: 3, content: '复习了Solidity基础语法' },
  { id: 3, date: '2026-03-28', quality: 5, content: '完成了第一个智能合约项目，收获很大...' },
]

export default function GoalDetail() {
  const params = useParams()
  const { isConnected } = useAccount()
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [records, setRecords] = useState(mockRecords)

  const oreColors: Record<string, string> = {
    Wisdom: 'bg-blue-100 text-blue-600',
    Will: 'bg-red-100 text-red-600',
    Creation: 'bg-yellow-100 text-yellow-600',
    Connection: 'bg-green-100 text-green-600',
  }

  const handleRecord = (record: { content: string; quality: number }) => {
    const newRecord = {
      id: records.length + 1,
      date: new Date().toISOString().split('T')[0],
      ...record,
    }
    setRecords([newRecord, ...records])
    setShowRecordModal(false)
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-4">请先连接钱包</h2>
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6">
        ← 返回目标列表
      </Link>

      {/* 目标信息卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-magical p-6 rounded-2xl mb-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{mockGoal.name}</h1>
            <p className="text-gray-600">{mockGoal.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${oreColors[mockGoal.oreType]}`}>
            智慧矿石
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">{mockGoal.streak}</div>
            <div className="text-sm text-gray-500">连续天数</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">{mockGoal.totalOres}</div>
            <div className="text-sm text-gray-500">已产出矿石</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600">{mockGoal.longestStreak}</div>
            <div className="text-sm text-gray-500">最长连续</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">目标进度</span>
            <span className="text-purple-600 font-medium">{mockGoal.progress}%</span>
          </div>
          <div className="progress-magical">
            <div
              className="progress-magical-fill"
              style={{ width: `${mockGoal.progress}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* 今日记录区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-magical p-6 rounded-2xl mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">今日记录</h2>
          <span className="text-sm text-gray-500">Day {mockGoal.streak + 1}</span>
        </div>

        <button
          onClick={() => setShowRecordModal(true)}
          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
        >
          <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⛏️</div>
          <div className="text-gray-600 group-hover:text-purple-600">点击铸造今日矿石</div>
        </button>
      </motion.div>

      {/* 历史记录 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-4">历史记录</h2>
        <div className="space-y-3">
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-magical p-4 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">{record.date}</div>
                  <p className="text-gray-700">{record.content}</p>
                </div>
                <div className="ml-4 flex items-center">
                  <span className="star-quality">{'⭐'.repeat(record.quality)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 记录弹窗 */}
      {showRecordModal && (
        <RecordModal
          onClose={() => setShowRecordModal(false)}
          onRecord={handleRecord}
        />
      )}
    </div>
  )
}

function RecordModal({
  onClose,
  onRecord,
}: {
  onClose: () => void
  onRecord: (record: { content: string; quality: number }) => void
}) {
  const [content, setContent] = useState('')
  const [quality, setQuality] = useState(3)

  const qualityLabels = [
    '',
    '一句话记录',
    '简短描述',
    '详细记录',
    '带感悟/反思',
    '深度复盘',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onRecord({ content, quality })
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
        className="bg-white rounded-2xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">记录今日践行</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今天做了什么？
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-magical resize-none"
              rows={5}
              placeholder="记录你的成长点滴..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              记录质量
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQuality(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= quality ? 'star-quality' : 'opacity-30'
                  }`}
                >
                  ⭐
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">{qualityLabels[quality]}</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600">预计产出</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl">🔵</span>
              <span className="font-medium">智慧矿石 × 1</span>
              <span className="text-sm text-gray-500">({quality}星品质)</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button type="submit" className="flex-1 btn-magical">
              铸造矿石 ⛏️
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
