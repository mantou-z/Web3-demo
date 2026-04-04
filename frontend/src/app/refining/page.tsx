'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { GoldButton } from '@/components/scene/GoldButton'
import { ParchmentPanel } from '@/components/scene/ParchmentPanel'
import { SceneShell } from '@/components/scene/SceneShell'
import { sceneAssets } from '@/components/scene/assets'

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
  Wisdom: { name: '智慧', icon: 'W', gradient: 'ore-gradient-wisdom' },
  Will: { name: '意志', icon: 'I', gradient: 'ore-gradient-will' },
  Creation: { name: '创造', icon: 'C', gradient: 'ore-gradient-creation' },
  Connection: { name: '连接', icon: 'N', gradient: 'ore-gradient-connection' },
} as const

export default function RefiningPage() {
  const { isConnected, address } = useAccount()
  const [ores, setOres] = useState<Ore[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedOres, setSelectedOres] = useState<string[]>([])
  const [showCabinet, setShowCabinet] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  const [newCard, setNewCard] = useState<{ id: string; title: string; imageUrl: string } | null>(null)
  const [editableTitle, setEditableTitle] = useState('')

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address])

  const fetchData = async () => {
    await Promise.all([fetchOres(), fetchCards()])
  }

  const fetchOres = async () => {
    try {
      const res = await fetch(`/api/ores/${address}`)
      const data = await res.json()
      if (data.success) setOres(data.ores)
    } catch (error) {
      console.error('Error fetching ores:', error)
    }
  }

  const fetchCards = async () => {
    try {
      const res = await fetch(`/api/cards/${address}`)
      const data = await res.json()
      if (data.success) setCards(data.cards)
    } catch (error) {
      console.error('Error fetching cards:', error)
    }
  }

  const handleSelectOre = (oreId: string) => {
    setSelectedOres((current) => (current.includes(oreId) ? current.filter((id) => id !== oreId) : [...current, oreId]))
  }

  const handleRefine = async () => {
    if (selectedOres.length === 0) return

    setShowCabinet(false)
    setIsRefining(true)

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:30001'
    const refinePromise = fetch(`${backendUrl}/api/cards/refine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: address, oreIds: selectedOres }),
    }).then((res) => res.json())

    const timerPromise = new Promise((resolve) => setTimeout(resolve, 3000))

    try {
      const [result] = await Promise.all([refinePromise, timerPromise])
      setIsRefining(false)
      if (result.success) {
        setNewCard({ id: result.card.id, title: result.card.title, imageUrl: result.card.image_url })
        setEditableTitle(result.card.title)
      } else {
        alert(`精炼失败：${result.error || '未知错误'}`)
      }
    } catch (error) {
      setIsRefining(false)
      console.error('Refine error:', error)
      alert('精炼请求失败')
    }
  }

  const handleSaveCard = async () => {
    if (!newCard) return

    if (editableTitle !== newCard.title) {
      try {
        await fetch(`/api/cards/${newCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editableTitle }),
        })
      } catch (error) {
        console.error('Error saving card title:', error)
      }
    }

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

  const getOreAsset = (seed: string) => {
    const oreAssets = sceneAssets.cards.ores
    const normalized = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return oreAssets[normalized % oreAssets.length]
  }

  if (!isConnected) {
    return (
      <SceneShell>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <ParchmentPanel className="max-w-xl p-10 text-center">
            <h2 className="brand-script text-4xl font-bold text-[#6f4a1d]">Connect to Enter the Lab</h2>
            <p className="mt-4 text-xl text-[#6d5536]">连接钱包后，才能把矿石投入炼金锅并生成卡牌。</p>
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
            <h1 className="scene-hero-title">Refine the Ore</h1>
            <p className="scene-muted mt-4 text-xl">挑选今天最重要的矿石，把它们浓缩成一张可收藏、可继续觉醒的里程碑卡牌。</p>
          </div>
          <img src={sceneAssets.shared.character} alt="Character" className="mx-auto max-h-[600px] w-auto object-contain" />
        </div>

        <div className="scene-column scene-column--center">
          <AnimatePresence mode="wait">
            {!showCabinet && !isRefining && !newCard ? (
              <motion.div key="idle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
                <div className="relative mx-auto max-w-[420px]">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(233,185,94,0.72),transparent_60%)] blur-3xl" />
                  <img src={sceneAssets.refining.cauldron} alt="Cauldron" className="animate-float relative z-10 w-full" />
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  <GoldButton onClick={() => setShowCabinet(true)}>Open Ore Cabinet</GoldButton>
                </div>
                <div className="mt-5 text-lg text-[#6d5536]">已有卡牌 {cards.length} 张，可用矿石 {ores.length} 块。</div>
              </motion.div>
            ) : null}

            {isRefining ? (
              <motion.div key="refining" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg text-center">
                <img src={sceneAssets.refining.cauldron} alt="Refining" className="animate-float mx-auto w-full max-w-[420px]" />
                <div className="brand-script mt-6 text-4xl font-bold text-[#7b551f]">Refining in progress...</div>
                <p className="mt-3 text-xl text-[#6d5536]">矿石正在融合、交织，并凝成新的卡牌纹样。</p>
              </motion.div>
            ) : null}

            {newCard ? (
              <motion.div key="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                <ParchmentPanel className="p-6 text-center">
                  <div className="brand-script text-3xl font-bold text-[#70491d]">Card Forged</div>
                  <div className="mx-auto mt-5 overflow-hidden rounded-[1.5rem] bg-white/60 p-3 shadow-[0_20px_35px_rgba(119,84,39,0.16)]">
                    <img src={newCard.imageUrl} alt="New Card" className="w-full rounded-[1.2rem] object-cover" />
                  </div>
                  <input
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="scene-input mt-5 text-center"
                    placeholder="给这张卡牌命名"
                  />
                  <div className="mt-6 flex justify-center gap-3">
                    <GoldButton onClick={handleSaveCard}>Store Card</GoldButton>
                    <button onClick={handleReset} className="scene-badge">Reset</button>
                  </div>
                </ParchmentPanel>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="scene-column items-center">
          <div className="relative w-full max-w-[440px]">
            <img src={sceneAssets.shared.owl} alt="Owl" className="absolute right-0 top-[-4rem] h-40 w-auto animate-float md:h-48" />
            <ParchmentPanel className="px-6 pb-8 pt-16">
              <div className="mb-4 text-center">
                <div className="brand-script text-2xl font-bold text-[#78511f]">Card Vault</div>
                <p className="scene-muted text-base">最新生成的卡牌会先存放在这里，等待下一次觉醒。</p>
              </div>
              <div className="space-y-3">
                {cards.slice(0, 4).map((card) => (
                  <div key={card.id} className="scene-card flex items-center gap-3 p-3">
                    <img src={card.image_url} alt={card.title} className="h-16 w-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-lg font-semibold text-[#5a4127]">{card.title}</div>
                      <div className="text-sm text-[#9d7b45]">{card.created_at?.split('T')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ParchmentPanel>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCabinet ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(50,35,18,0.45)] px-4 backdrop-blur-md" onClick={handleReset}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
              <ParchmentPanel className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="brand-script text-3xl font-bold text-[#70491d]">Choose Ores</h2>
                    <p className="scene-muted text-lg">已选择 {selectedOres.length} 块矿石，越聚焦的组合通常越容易得到清晰卡牌。</p>
                  </div>
                  <button onClick={handleReset} className="scene-badge">Close</button>
                </div>

                {ores.length === 0 ? (
                  <div className="py-12 text-center text-xl text-[#7e6033]">还没有可用矿石，请先去采集页面保存灵光。</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {ores.map((ore) => {
                      const isSelected = selectedOres.includes(ore.id)
                      const info = dimensionInfo[ore.refined_data?.dimension || 'Wisdom']
                      return (
                        <button key={ore.id} onClick={() => handleSelectOre(ore.id)} className={`scene-card p-4 text-left transition-all ${isSelected ? 'ring-2 ring-[#d2a74f] bg-[#fff6dd]' : ''}`}>
                          <div className="ore-token mb-3 h-14 w-14">
                            <img src={getOreAsset(ore.id)} alt={info.name} />
                          </div>
                          <div className="line-clamp-3 text-sm font-semibold text-[#5a4127]">{ore.refined_data?.text || '未命名矿石'}</div>
                          <div className="mt-2 text-xs text-[#9d7b45]">{info.name} · {ore.created_at?.split('T')[0]}</div>
                        </button>
                      )
                    })}
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-3">
                  <GoldButton onClick={handleRefine} disabled={selectedOres.length === 0}>Refine Selected Ores</GoldButton>
                </div>
              </ParchmentPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SceneShell>
  )
}
