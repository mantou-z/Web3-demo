'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useMintMedal } from '@/hooks/useContracts'
import { GoldButton } from '@/components/scene/GoldButton'
import { ParchmentPanel } from '@/components/scene/ParchmentPanel'
import { SceneShell } from '@/components/scene/SceneShell'
import { sceneAssets } from '@/components/scene/assets'

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

  const { mintMedal, isPending: isMinting, isConfirmed: mintConfirmed, receipt } = useMintMedal()

  useEffect(() => {
    if (isConnected && address) {
      fetchData()
    }
  }, [isConnected, address])

  const fetchData = async () => {
    await Promise.all([fetchCards(), fetchMedals()])
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
      setSelectedCards(selectedCards.filter((id) => id !== cardId))
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
      setError('请至少选择一张卡牌参与觉醒。')
      return false
    }
    setError(null)
    return true
  }

  const handleAwaken = async () => {
    if (!validateSelection()) return

    setShowCircle(false)
    setIsAwakening(true)

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:30001'

    try {
      const res = await fetch(`${backendUrl}/api/medals/awaken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          cardIds: selectedCards,
          existingMedalId: selectedMedal,
        }),
      })

      await new Promise((resolve) => setTimeout(resolve, 3000))

      const result = await res.json()
      setIsAwakening(false)

      if (result.success) {
        setNewMedal({
          id: result.medal.id,
          title: result.medal.title,
          description: result.medal.description,
          imageUrl: result.medal.image_url,
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

    if (editableMedalTitle !== newMedal.title) {
      try {
        await fetch(`/api/medals/${newMedal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editableMedalTitle }),
        })
      } catch (error) {
        console.error('Error saving medal title:', error)
      }
    }

    try {
      mintMedal(newMedal.imageUrl, editableMedalTitle, newMedal.description)
    } catch (error) {
      console.error('Mint error:', error)
      alert('上链失败')
    }
  }

  useEffect(() => {
    if (mintConfirmed && receipt && newMedal) {
      const medalMintedEvent = receipt.logs.find((log) => {
        return log.topics[0] === '0xdccdb8897eec6a644b93d2ff2b1d5a7fee4603857d745585ad971dfcd0ccd299'
      })

      if (medalMintedEvent && medalMintedEvent.topics[2]) {
        const realTokenId = BigInt(medalMintedEvent.topics[2])

        fetch(`/api/medals/${newMedal.id}/mint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: realTokenId.toString() }),
        }).then(() => {
          fetchData()
          setSelectedCards([])
          setSelectedMedal(null)
          setNewMedal(null)
        })
      }
    }
  }, [mintConfirmed, receipt, newMedal])

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
      <SceneShell>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <ParchmentPanel className="max-w-xl p-10 text-center">
            <h2 className="brand-script text-4xl font-bold text-[#6f4a1d]">Connect to Awaken</h2>
            <p className="mt-4 text-xl text-[#6d5536]">连接钱包后，才能将卡牌合成为勋章并上链。</p>
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
            <h1 className="scene-hero-title">Awaken Identity</h1>
            <p className="scene-muted mt-4 text-xl">将卡牌汇聚成更稳定的身份象征，必要时也可以在旧勋章基础上继续进化。</p>
          </div>
          <img src={sceneAssets.shared.character} alt="Character" className="mx-auto max-h-[600px] w-auto object-contain" />
        </div>

        <div className="scene-column scene-column--center">
          <AnimatePresence mode="wait">
            {!showCircle && !isAwakening && !newMedal ? (
              <motion.div key="idle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl text-center">
                <div className="relative mx-auto max-w-[460px]">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(221,193,105,0.72),transparent_58%)] blur-3xl" />
                  <img src={sceneAssets.awakening.door} alt="Awakening door" className="animate-float relative z-10 w-full" />
                </div>
                <div className="mt-8 flex justify-center gap-3">
                  <GoldButton onClick={() => setShowCircle(true)}>Open the Ritual</GoldButton>
                </div>
                <div className="mt-5 text-lg text-[#6d5536]">可用卡牌 {cards.length} 张，已有勋章 {medals.length} 枚。</div>
              </motion.div>
            ) : null}

            {isAwakening ? (
              <motion.div key="awakening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl text-center">
                <img src={sceneAssets.awakening.door} alt="Awakening" className="animate-float mx-auto w-full max-w-[420px]" />
                <div className="brand-script mt-6 text-4xl font-bold text-[#7b551f]">Awakening in progress...</div>
                <p className="mt-3 text-xl text-[#6d5536]">卡牌正在汇聚它们共同指向的身份主题。</p>
              </motion.div>
            ) : null}

            {newMedal ? (
              <motion.div key="medal" initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                <ParchmentPanel className="p-6 text-center">
                  <div className="brand-script text-3xl font-bold text-[#70491d]">Medal Revealed</div>
                  <div className="mx-auto mt-4 flex h-72 w-72 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,233,172,0.78),rgba(255,255,255,0.18))]">
                    <img src={newMedal.imageUrl} alt="New Medal" className="h-56 w-56 rounded-full object-cover shadow-[0_20px_35px_rgba(119,84,39,0.2)]" />
                  </div>
                  <input
                    type="text"
                    value={editableMedalTitle}
                    onChange={(e) => setEditableMedalTitle(e.target.value)}
                    className="scene-input mt-5 text-center"
                    placeholder="给勋章命名"
                  />
                  <p className="mt-4 text-lg text-[#6d5536]">{newMedal.description}</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <GoldButton onClick={handleMintToChain} disabled={isMinting}>{isMinting ? 'Minting...' : 'Mint On Chain'}</GoldButton>
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
                <div className="brand-script text-2xl font-bold text-[#78511f]">Honor Archive</div>
                <p className="scene-muted text-base">每一枚勋章都来自你曾经积累的卡牌与经历。</p>
              </div>
              <div className="space-y-3">
                {medals.slice(0, 4).map((medal) => (
                  <div key={medal.id} className="scene-card flex items-center gap-3 p-3">
                    <img src={medal.image_url} alt={medal.title} className="h-14 w-14 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-lg font-semibold text-[#5a4127]">{medal.title}</div>
                      <div className="text-sm text-[#9d7b45]">{medal.created_at?.split('T')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ParchmentPanel>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCircle ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(50,35,18,0.45)] px-4 backdrop-blur-md" onClick={handleReset}>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} className="w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
              <ParchmentPanel className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="brand-script text-3xl font-bold text-[#70491d]">Choose Ritual Materials</h2>
                    <p className="scene-muted text-lg">选择卡牌进行觉醒，也可以额外指定一枚已有勋章作为进化基础。</p>
                  </div>
                  <button onClick={handleReset} className="scene-badge">Close</button>
                </div>

                {error ? <div className="mb-4 rounded-2xl bg-red-100 px-4 py-3 text-center text-red-700">{error}</div> : null}

                <div className="mb-8">
                  <h3 className="mb-4 text-2xl font-bold text-[#5b3b1d]">Cards</h3>
                  {cards.length === 0 ? (
                    <div className="py-8 text-center text-lg text-[#7e6033]">暂无可用卡牌，请先去精炼页面生成卡牌。</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {cards.map((card) => {
                        const isSelected = selectedCards.includes(card.id)
                        return (
                          <button key={card.id} onClick={() => handleSelectCard(card.id)} className={`scene-card overflow-hidden p-3 text-left transition-all ${isSelected ? 'ring-2 ring-[#d2a74f] bg-[#fff6dd]' : ''}`}>
                            <img src={card.image_url} alt={card.title} className="h-48 w-full rounded-[1.1rem] object-cover" />
                            <div className="mt-3 text-base font-semibold text-[#5a4127]">{card.title}</div>
                            <div className="text-sm text-[#9d7b45]">{card.created_at?.split('T')[0]}</div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {medals.length > 0 ? (
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-[#5b3b1d]">Existing Medals</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {medals.map((medal) => {
                        const isSelected = selectedMedal === medal.id
                        return (
                          <button key={medal.id} onClick={() => handleSelectMedal(medal.id)} className={`scene-card p-4 text-center transition-all ${isSelected ? 'ring-2 ring-[#d2a74f] bg-[#fff6dd]' : ''}`}>
                            <img src={medal.image_url} alt={medal.title} className="mx-auto h-28 w-28 rounded-full object-cover" />
                            <div className="mt-3 text-base font-semibold text-[#5a4127]">{medal.title}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex justify-center gap-3">
                  <GoldButton onClick={handleAwaken} disabled={selectedCards.length === 0}>{selectedMedal ? 'Evolve Medal' : 'Awaken Medal'}</GoldButton>
                </div>
              </ParchmentPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SceneShell>
  )
}
