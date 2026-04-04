'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount } from 'wagmi'
import { GoldButton } from '@/components/scene/GoldButton'
import { ParchmentPanel } from '@/components/scene/ParchmentPanel'
import { SceneShell } from '@/components/scene/SceneShell'
import { sceneAssets } from '@/components/scene/assets'

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
  Wisdom: { name: '智慧', icon: 'W', gradient: 'ore-gradient-wisdom' },
  Will: { name: '意志', icon: 'I', gradient: 'ore-gradient-will' },
  Creation: { name: '创造', icon: 'C', gradient: 'ore-gradient-creation' },
  Connection: { name: '连接', icon: 'N', gradient: 'ore-gradient-connection' },
} as const

export default function MiningPage() {
  const { isConnected, address } = useAccount()
  const [stage, setStage] = useState<'welcome' | 'mining' | 'refining' | 'complete'>('welcome')
  const [input, setInput] = useState('')
  const [ores, setOres] = useState<EditingOre[]>([])
  const [savedOres, setSavedOres] = useState<SavedOre[]>([])
  const [showInput, setShowInput] = useState(false)

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
    }
  }

  const handleAnalyze = async () => {
    if (!input.trim()) return

    setShowInput(false)
    setStage('mining')

    const analyzePromise = fetch('/api/ores/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: address,
        input,
      }),
    }).then((res) => res.json())

    const timerPromise = new Promise((resolve) => setTimeout(resolve, 2800))
    const [result] = await Promise.all([analyzePromise, timerPromise])

    if (result.success) {
      setOres(result.ores)
      setStage('refining')
      return
    }

    setOres([{ id: 1, text: input.slice(0, 30), dimension: 'Wisdom', score: 4 }])
    setStage('refining')
  }

  const handleEditOre = (id: number, newText: string) => {
    setOres(ores.map((ore) => (ore.id === id ? { ...ore, text: newText } : ore)))
  }

  const handleDeleteOre = (id: number) => {
    setOres(ores.filter((ore) => ore.id !== id))
  }

  const handleAddOre = () => {
    const newId = Math.max(...ores.map((o) => o.id), 0) + 1
    setOres([...ores, { id: newId, text: '', dimension: 'Wisdom', score: 3 }])
  }

  const handleConfirm = async () => {
    try {
      await fetch('/api/ores/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          ores,
          rawInput: input,
        }),
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
    }, 2500)
  }

  const handleReset = () => {
    setStage('welcome')
    setInput('')
    setOres([])
  }

  if (!isConnected) {
    return (
      <SceneShell backgroundImage={sceneAssets.mining.background}>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <ParchmentPanel className="max-w-xl p-10 text-center">
            <h2 className="brand-script text-4xl font-bold text-[#6f4a1d]">Connect to Enter the Mine</h2>
            <p className="mt-4 text-xl text-[#6d5536]">连接钱包后，才能把今天的经历提炼成可保存的灵光矿石。</p>
          </ParchmentPanel>
        </div>
      </SceneShell>
    )
  }

  return (
    <SceneShell backgroundImage={sceneAssets.mining.background}>
      <div className="scene-grid">
        <div className="scene-column">
          <div className="mb-6 max-w-md">
            <h1 className="scene-hero-title">Mine Your Spark</h1>
            <p className="scene-muted mt-4 text-xl">记录日常、学习、情绪和洞察，让 AI 为你提炼出今天最重要的灵光。</p>
          </div>
          <img src={sceneAssets.shared.character} alt="Character" className="mx-auto max-h-[600px] w-auto object-contain" />
        </div>

        <div className="scene-column scene-column--center">
          <AnimatePresence mode="wait">
            {stage === 'welcome' && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <div className="relative mx-auto max-w-[360px]">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,223,157,0.8),transparent_58%)] blur-3xl" />
                  <img src={sceneAssets.home.crystal} alt="Mine crystal" className="animate-float relative z-10 w-full" />
                </div>
                <div className="mt-8 flex justify-center">
                  <GoldButton onClick={() => setShowInput(true)}>Open the Mine</GoldButton>
                </div>
              </motion.div>
            )}

            {stage === 'mining' && (
              <motion.div key="mining" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg text-center">
                <img src={sceneAssets.home.crystal} alt="Analyzing" className="animate-float mx-auto w-full max-w-[260px]" />
                <div className="brand-script mt-6 text-4xl font-bold text-[#7b551f]">Extracting your fragments...</div>
                <p className="mt-3 text-xl text-[#6d5536]">我们正在把这段经历中的关键词、情绪与价值提炼成矿石。</p>
              </motion.div>
            )}

            {stage === 'refining' && (
              <motion.div key="refining" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <ParchmentPanel className="p-6 md:p-8">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="brand-script text-3xl font-bold text-[#70491d]">Review Today&apos;s Ores</h2>
                      <p className="scene-muted text-lg">你可以修改内容、删除无效项，或补充新的灵光片段。</p>
                    </div>
                    <button onClick={handleAddOre} className="scene-badge">+ Add</button>
                  </div>

                  <div className="space-y-4">
                    {ores.map((ore) => {
                      const info = dimensionInfo[ore.dimension]
                      return (
                        <div key={ore.id} className="scene-card flex items-start gap-4 p-4">
                          <div className={`mt-1 flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white ${info.gradient}`}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 text-sm font-semibold text-[#9c7430]">{info.name}</div>
                            <textarea
                              value={ore.text}
                              onChange={(e) => handleEditOre(ore.id, e.target.value)}
                              className="scene-textarea min-h-[112px] leading-relaxed"
                              placeholder="补充或修改这块矿石的描述"
                            />
                          </div>
                          <button onClick={() => handleDeleteOre(ore.id)} className="mt-2 text-sm font-semibold text-[#9b6a44]">
                            Remove
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <GoldButton onClick={handleConfirm} disabled={ores.length === 0}>Store in Vault</GoldButton>
                    <button onClick={handleReset} className="scene-badge">Cancel</button>
                  </div>
                </ParchmentPanel>
              </motion.div>
            )}

            {stage === 'complete' && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center">
                <ParchmentPanel className="p-10">
                  <div className="brand-script text-4xl font-bold text-[#7b551f]">Stored Successfully</div>
                  <p className="mt-3 text-xl text-[#6d5536]">已将 {ores.length} 块灵光矿石存入你的矿石库。</p>
                </ParchmentPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="scene-column items-center">
          <div className="relative w-full max-w-[420px]">
            <img src={sceneAssets.shared.owl} alt="Owl" className="absolute right-0 top-[-4rem] h-40 w-auto animate-float md:h-48" />
            <ParchmentPanel className="px-6 pb-8 pt-16">
              <div className="mb-4 text-center">
                <div className="brand-script text-2xl font-bold text-[#78511f]">Ore Archive</div>
                <p className="scene-muted text-base">已经保存的矿石会显示在这里，方便后续继续精炼。</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {savedOres.slice(0, 6).map((ore) => {
                  const info = dimensionInfo[ore.refined_data?.dimension || 'Wisdom']
                  return (
                    <div key={ore.id} className="scene-card p-3 text-center">
                      <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl text-white ${info.gradient}`}>
                        {info.icon}
                      </div>
                      <div className="line-clamp-2 text-sm font-semibold text-[#5a4127]">{ore.refined_data?.text || '未命名矿石'}</div>
                      <div className="mt-2 text-xs text-[#9d7b45]">{ore.created_at?.split('T')[0]}</div>
                    </div>
                  )
                })}
              </div>
              {savedOres.length > 6 ? <div className="mt-4 text-center text-sm text-[#9d7b45]">+ {savedOres.length - 6} more ores</div> : null}
            </ParchmentPanel>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInput ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(50,35,18,0.45)] px-4 backdrop-blur-md"
            onClick={() => setShowInput(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <ParchmentPanel className="p-8">
                <h3 className="brand-script text-3xl font-bold text-[#70491d]">Record Today&apos;s Spark</h3>
                <p className="mb-4 mt-2 text-lg text-[#6d5536]">写下今天想保存的片段，AI 会把它拆解成几块可精炼的矿石。</p>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="scene-textarea h-48"
                  placeholder="例如：今天终于把合约部署跑通了，也更清楚自己想做怎样的产品。"
                  autoFocus
                />
                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <button onClick={() => setShowInput(false)} className="scene-badge">Cancel</button>
                  <GoldButton onClick={handleAnalyze} disabled={!input.trim()}>Analyze</GoldButton>
                </div>
              </ParchmentPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SceneShell>
  )
}
