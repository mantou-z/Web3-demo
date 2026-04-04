'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ParchmentPanel } from '@/components/scene/ParchmentPanel'
import { SceneShell } from '@/components/scene/SceneShell'
import { sceneAssets } from '@/components/scene/assets'

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

const defaultDimensions: Dimension[] = [
  { name: '智慧', score: 30 },
  { name: '意志', score: 30 },
  { name: '创造', score: 30 },
  { name: '感知', score: 30 },
  { name: '技能', score: 30 },
  { name: '韧性', score: 30 },
]

const medalSlots = [
  { left: '17%', top: '14%' },
  { left: '41%', top: '9%' },
  { left: '65%', top: '14%' },
  { left: '15%', top: '39%' },
  { left: '41%', top: '34%' },
  { left: '67%', top: '39%' },
  { left: '19%', top: '64%' },
  { left: '41%', top: '60%' },
  { left: '63%', top: '64%' },
]

export default function ProfilePage() {
  const { isConnected, address } = useAccount()
  const [dimensions, setDimensions] = useState<Dimension[]>(defaultDimensions)
  const [medals, setMedals] = useState<Medal[]>([])
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
      if (data.success) {
        setMedals(data.medals)
      }
    } catch (error) {
      console.error('Error fetching medals:', error)
    }
  }

  const updateDimension = (index: number, field: 'name' | 'score', value: string | number) => {
    const nextDimensions = [...dimensions]
    nextDimensions[index] = { ...nextDimensions[index], [field]: value }
    setDimensions(nextDimensions)
  }

  const getRadarPoints = () => {
    const centerX = 150
    const centerY = 150
    const maxRadius = 108

    return dimensions.map((dim, i) => {
      const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
      const radius = (dim.score / 100) * maxRadius

      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        labelX: centerX + Math.cos(angle) * (maxRadius + 28),
        labelY: centerY + Math.sin(angle) * (maxRadius + 28),
      }
    })
  }

  const radarPoints = getRadarPoints()
  const polygonPoints = radarPoints.map((point) => `${point.x},${point.y}`).join(' ')

  const getGridPolygons = () => {
    const levels = [0.2, 0.4, 0.6, 0.8, 1]
    const centerX = 150
    const centerY = 150
    const maxRadius = 108

    return levels.map((level) =>
      dimensions
        .map((_, i) => {
          const angle = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
          const radius = maxRadius * level
          return `${centerX + Math.cos(angle) * radius},${centerY + Math.sin(angle) * radius}`
        })
        .join(' ')
    )
  }

  if (!isConnected) {
    return (
      <SceneShell>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <ParchmentPanel className="max-w-xl p-10 text-center">
            <h2 className="brand-script text-4xl font-bold text-[#6f4a1d]">Connect to View Archive</h2>
            <p className="mt-4 text-xl text-[#6d5536]">连接钱包后，才能查看你的勋章陈列墙与灵魂雷达。</p>
          </ParchmentPanel>
        </div>
      </SceneShell>
    )
  }

  return (
    <SceneShell>
      <div className="scene-grid">
        <div className="scene-column">
          <div className="mb-6 max-w-md">
            <h1 className="scene-hero-title">Soul Archive</h1>
            <p className="scene-muted mt-4 text-xl">你的勋章、维度雷达与身份演化都汇聚在这里。</p>
          </div>
          <img
            src={sceneAssets.shared.character}
            alt="Character"
            className="mx-auto max-h-[600px] w-auto object-contain"
          />
        </div>

        <div className="scene-column scene-column--center">
          <div className="w-full">
            <div className="mb-5 flex items-center justify-between px-2">
              <div>
                <h2 className="brand-script text-3xl font-bold text-[#70491d]">Medal Wall</h2>
                <p className="scene-muted text-lg">点击任意勋章，查看它由哪些经历与卡牌铸成。</p>
              </div>
              <div className="scene-badge">{medals.length} medals</div>
            </div>

            <div className="relative mx-auto max-w-[600px]">
              <img
                src={sceneAssets.profile.wall}
                alt="Medal Wall"
                className="w-full opacity-100 drop-shadow-[0_20px_34px_rgba(126,86,41,0.16)]"
              />

              <div className="absolute inset-0">
                {medalSlots.map((slot, index) => {
                  const medal = medals[index]

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => medal && setSelectedMedal(medal)}
                      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent p-1"
                      style={{ left: slot.left, top: slot.top }}
                    >
                      {medal ? (
                        <img
                          src={medal.image_url}
                          alt={medal.title}
                          className="h-24 w-24 rounded-full object-cover shadow-[0_10px_18px_rgba(92,63,28,0.18)] ring-1 ring-[#b9893d]/15 md:h-28 md:w-28"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full border border-dashed border-[#d1b57c]/22 md:h-28 md:w-28" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="scene-column items-center">
          <div className="relative w-full max-w-[440px]">
            <img
              src={sceneAssets.shared.owl}
              alt="Owl"
              className="absolute right-0 top-[-4rem] h-40 w-auto animate-float md:h-48"
            />
            <ParchmentPanel className="px-6 pb-8 pt-16">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="brand-script text-2xl font-bold text-[#78511f]">Soul Radar</div>
                  <p className="scene-muted text-base">维度分布会随着你持续记录与觉醒而变化。</p>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="scene-badge">
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>

              <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-[260px]">
                {getGridPolygons().map((points, index) => (
                  <polygon
                    key={index}
                    points={points}
                    fill="none"
                    stroke="rgba(164,123,46,0.18)"
                    strokeWidth="1"
                  />
                ))}

                {radarPoints.map((point, index) => (
                  <line
                    key={index}
                    x1="150"
                    y1="150"
                    x2={point.x}
                    y2={point.y}
                    stroke="rgba(164,123,46,0.25)"
                    strokeWidth="1"
                  />
                ))}

                <motion.polygon
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  points={polygonPoints}
                  fill="rgba(224,184,92,0.26)"
                  stroke="rgba(196,145,47,0.82)"
                  strokeWidth="2"
                />

                {radarPoints.map((point, index) => (
                  <motion.circle
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#b8842f"
                  />
                ))}

                {dimensions.map((dim, index) => (
                  <text
                    key={index}
                    x={radarPoints[index].labelX}
                    y={radarPoints[index].labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#7d6033"
                    fontSize="12"
                  >
                    {dim.name}
                  </text>
                ))}
              </svg>

              <div className="mt-5 space-y-3">
                {dimensions.map((dim, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={dim.name}
                        onChange={(e) => updateDimension(index, 'name', e.target.value)}
                        className="scene-input w-24 px-3 py-2"
                      />
                    ) : (
                      <span className="w-20 text-base font-semibold text-[#6d5536]">{dim.name}</span>
                    )}

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={dim.score}
                      onChange={(e) => updateDimension(index, 'score', parseInt(e.target.value, 10))}
                      disabled={!isEditing}
                      className="flex-1 accent-[#c79839]"
                    />
                    <span className="w-10 text-right text-sm font-semibold text-[#9d7b45]">{dim.score}</span>
                  </div>
                ))}
              </div>
            </ParchmentPanel>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMedal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(50,35,18,0.45)] px-4 backdrop-blur-md"
            onClick={() => setSelectedMedal(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              className="w-full max-w-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <ParchmentPanel className="p-8 text-center">
                <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,233,172,0.78),rgba(255,255,255,0.18))]">
                  <img
                    src={selectedMedal.image_url}
                    alt={selectedMedal.title}
                    className="h-48 w-48 rounded-full object-cover"
                  />
                </div>

                <h2 className="brand-script mt-5 text-4xl font-bold text-[#70491d]">{selectedMedal.title}</h2>
                <p className="mt-3 text-lg text-[#6d5536]">{selectedMedal.description}</p>

                <div className="mt-6 space-y-2 text-base text-[#6d5536]">
                  <div>铸造时间：{selectedMedal.created_at?.split('T')[0]}</div>
                  <div>Token ID：{selectedMedal.token_id !== null ? `#${selectedMedal.token_id}` : '未上链'}</div>
                  <div>来源卡牌数：{selectedMedal.parent_ids?.length || 0}</div>
                </div>

                <button onClick={() => setSelectedMedal(null)} className="scene-badge mt-6">
                  Close
                </button>
              </ParchmentPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SceneShell>
  )
}
