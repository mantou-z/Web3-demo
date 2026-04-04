'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ActionHeroButton } from '@/components/ActionHeroButton'
import { FantasyShell } from '@/components/FantasyShell'
import { FloatingArtwork } from '@/components/FloatingArtwork'
import { ShowcaseCabinet } from '@/components/ShowcaseCabinet'
import { archivePanelTuning, centerArtworkTuning, characterFigureTuning, heroFloatTuning } from '@/utils/sceneTuning'
import { uiAssets } from '@/utils/uiAssets'
import { getOreVisual, type OreDimension } from '@/utils/oreVisuals'

interface SavedOre {
  id: string
  raw_input: string
  refined_data: {
    id: number
    text: string
    dimension: OreDimension
    score: number
    category?: string
    categoryId?: string
  }
  created_at: string
}

interface EditingOre {
  id: number
  text: string
  dimension: OreDimension
  score: number
  category?: string
  categoryId?: string
}

function getOreVisualSeed(ore: {
  text?: string
  raw_input?: string
  dimension: OreDimension
  category?: string
  categoryId?: string
}) {
  return [
    ore.dimension,
    ore.categoryId || '',
    ore.category || '',
    ore.text || ore.raw_input || '',
  ].join('|')
}

export default function MiningPage() {
  const { isConnected, address } = useAccount()
  const [input, setInput] = useState('')
  const [ores, setOres] = useState<EditingOre[]>([])
  const [savedOres, setSavedOres] = useState<SavedOre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCollectionPanel, setShowCollectionPanel] = useState(false)

  const isGeneratingOres = isAnalyzing

  useEffect(() => {
    if (!isConnected || !address) {
      setSavedOres([])
      setIsLoading(false)
      return
    }

    void fetchSavedOres()
  }, [isConnected, address])

  const fetchSavedOres = async () => {
    setIsLoading(true)
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
    if (!input.trim() || !address) return

    setIsAnalyzing(true)
    try {
      const [result] = await Promise.all([
        fetch('/api/ores/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            input,
          }),
        }).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, 1800)),
      ])

      if (result.success) {
        setOres(result.ores)
        setShowCollectionPanel(true)
      }
    } catch (error) {
      console.error('Error analyzing ores:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleConfirm = async () => {
    if (!address || ores.length === 0) return

    setIsSaving(true)
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

      setInput('')
      setOres([])
      await fetchSavedOres()
    } catch (error) {
      console.error('Error saving ores:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteOre = (id: number) => {
    setOres((current) => current.filter((ore) => ore.id !== id))
  }

  const handleAddOre = () => {
    const nextId = Math.max(0, ...ores.map((ore) => ore.id)) + 1
    setOres((current) => [
      ...current,
      { id: nextId, text: '', dimension: 'Wisdom', score: 3 },
    ])
  }

  return (
    <FantasyShell className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-3 flex items-end justify-center lg:justify-start">
        <FloatingArtwork
          offsetX={characterFigureTuning.offsetX}
          offsetY={characterFigureTuning.offsetY}
          floatY={characterFigureTuning.floatY}
          duration={characterFigureTuning.floatDuration}
          delay={characterFigureTuning.floatDelay}
        >
          <img
            src={uiAssets.character}
            alt="Character"
            className="w-auto object-contain drop-shadow-2xl"
            style={{ maxHeight: `${characterFigureTuning.maxHeight}px` }}
          />
        </FloatingArtwork>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center gap-6">
        {!isConnected ? (
          <div className="fantasy-card w-full rounded-[32px] p-8 text-center text-[#5b3a1c]">
            <p className="cinzel text-2xl font-bold uppercase tracking-[0.24em] text-[#8b6914]">Wallet Required</p>
            <p className="mt-4 text-xl">Connect your wallet from the top-right corner to start collecting.</p>
          </div>
        ) : (
          <ActionHeroButton
            imageSrc={uiAssets.crystal}
            imageAlt="Crystal pile"
            label="Click to Collect"
            onClick={() => setShowCollectionPanel(true)}
            glowClassName="bg-blue-300/20"
            imageClassName="drop-shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
            maxWidth={centerArtworkTuning.collect.maxWidth}
            offsetX={centerArtworkTuning.collect.offsetX}
            offsetY={centerArtworkTuning.collect.offsetY}
            floatY={heroFloatTuning.crystalPile.floatY}
            floatDuration={heroFloatTuning.crystalPile.floatDuration}
            floatDelay={heroFloatTuning.crystalPile.floatDelay}
          />
        )}
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div
          className="relative mx-auto w-full"
          style={{
            maxWidth: `${archivePanelTuning.containerMaxWidth}px`,
            paddingTop: `${archivePanelTuning.containerPaddingTop}px`,
            transform: `translate(${archivePanelTuning.containerOffsetX}px, ${archivePanelTuning.containerOffsetY}px)`,
          }}
        >
          <FloatingArtwork
            className="absolute left-1/2 top-0 -translate-x-1/2"
            offsetX={archivePanelTuning.owlOffsetX}
            offsetY={archivePanelTuning.owlOffsetY}
            floatY={archivePanelTuning.owlFloatY}
            duration={archivePanelTuning.owlFloatDuration}
            delay={archivePanelTuning.owlFloatDelay}
          >
            <img
              src={uiAssets.owl}
              alt=""
              className="object-contain"
              style={{ height: `${archivePanelTuning.owlSize}px`, width: `${archivePanelTuning.owlSize}px` }}
            />
          </FloatingArtwork>
          <img
            src={uiAssets.parchment}
            alt=""
            className="w-full object-contain drop-shadow-xl"
            style={{
              transform: `translate(${archivePanelTuning.parchmentOffsetX}px, ${archivePanelTuning.parchmentOffsetY}px) scale(${archivePanelTuning.parchmentScale})`,
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-center px-10 pb-8 pt-20 text-center text-[#5b3a1c]">
            <p className="cinzel text-base font-bold uppercase tracking-[0.25em] text-[#8b6914]">Ore Vault</p>
            <p className="mt-3 text-5xl font-bold">{savedOres.length}</p>
            <p className="mt-3 text-lg">Saved ores connected to your wallet.</p>
          </div>
        </div>

        <ShowcaseCabinet
          title="Ore Showcase"
          helperText={isLoading ? 'Loading vault echoes...' : 'Click to inspect your collected ores'}
          emptyMessage="No ores yet. Your first saved entry will appear here."
          items={savedOres.slice(0, 12)}
          renderSlot={(ore) => {
            const visual = getOreVisual(
              ore.refined_data?.dimension ?? 'Wisdom',
              getOreVisualSeed({
                dimension: ore.refined_data?.dimension ?? 'Wisdom',
                text: ore.refined_data?.text,
                raw_input: ore.raw_input,
                category: ore.refined_data?.category,
                categoryId: ore.refined_data?.categoryId,
              }),
            )

            return (
              <div className="relative flex h-[72%] w-[72%] items-center justify-center">
                <div className={`absolute inset-2 rounded-full blur-md ${visual.glowClass}`} />
                <img
                  src={visual.crystal}
                  alt={visual.label}
                  className="relative z-10 h-full w-full object-contain drop-shadow-md"
                />
              </div>
            )
          }}
          renderModalItem={(ore) => {
            const visual = getOreVisual(
              ore.refined_data?.dimension ?? 'Wisdom',
              getOreVisualSeed({
                dimension: ore.refined_data?.dimension ?? 'Wisdom',
                text: ore.refined_data?.text,
                raw_input: ore.raw_input,
                category: ore.refined_data?.category,
                categoryId: ore.refined_data?.categoryId,
              }),
            )

            return (
              <div className="rounded-[24px] border border-[#8b6914]/15 bg-white/60 p-3 text-center">
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                  <div className={`absolute inset-2 rounded-full blur-md ${visual.glowClass}`} />
                  <img
                    src={visual.crystal}
                    alt={visual.label}
                    className="relative z-10 h-16 w-16 object-contain drop-shadow-md"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5b3a1c]">{ore.refined_data?.text || ore.raw_input}</p>
              </div>
            )
          }}
        />
      </div>

      <AnimatePresence>
        {showCollectionPanel && isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 backdrop-blur-sm"
            onClick={() => setShowCollectionPanel(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="fantasy-card w-full max-w-5xl rounded-[32px] p-6 md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="cinzel text-sm font-bold uppercase tracking-[0.25em] text-[#8b6914]">Mining Journal</p>
                  <p className="text-lg text-[#5b3a1c]">Write today's growth and let the backend extract ores.</p>
                </div>
                <span className="cinzel text-sm text-[#8b6914]">{new Date().toLocaleDateString()}</span>
              </div>

              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Write about what you learned, built, or reflected on today..."
                className="input-magical min-h-[220px] resize-none text-lg leading-8"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={handleAnalyze} disabled={!input.trim() || isAnalyzing} className="gold-button disabled:cursor-not-allowed disabled:opacity-60">
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Ores'}
                </button>
                <button onClick={() => setInput('')} className="glass-chip">Clear</button>
              </div>

              <AnimatePresence>
                {ores.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="mt-6 rounded-[32px] border border-[#8b6914]/15 bg-white/35 p-6"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="cinzel text-sm font-bold uppercase tracking-[0.25em] text-[#8b6914]">Extracted Ores</p>
                        <p className="text-lg text-[#5b3a1c]">Adjust the generated results before saving them.</p>
                      </div>
                      <button onClick={handleAddOre} className="glass-chip">Add Ore</button>
                    </div>

                    <div className="max-h-[34vh] space-y-4 overflow-y-auto pr-2">
                      {ores.map((ore) => (
                        <div key={ore.id} className="rounded-[24px] border border-[#8b6914]/20 bg-white/55 p-4 shadow-sm">
                          {(() => {
                            const visual = getOreVisual(ore.dimension, getOreVisualSeed(ore))

                            return (
                              <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="relative flex h-12 w-12 items-center justify-center">
                                    <div className={`absolute inset-1 rounded-full blur-md ${visual.glowClass}`} />
                                    <img
                                      src={visual.crystal}
                                      alt={visual.label}
                                      className="relative z-10 h-12 w-12 object-contain drop-shadow-md"
                                    />
                                  </div>
                                  <div>
                                    <p className="cinzel text-sm font-bold uppercase tracking-[0.2em] text-[#8b6914]">{visual.label}</p>
                                    <p className="text-sm text-[#6b4a2c]">Quality {ore.score}/5</p>
                                  </div>
                                </div>
                                <button onClick={() => handleDeleteOre(ore.id)} className="text-[#8b6914] transition hover:text-red-500">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            )
                          })()}
                          <input
                            value={ore.text}
                            onChange={(event) => {
                              const nextText = event.target.value
                              setOres((current) =>
                                current.map((item) => (item.id === ore.id ? { ...item, text: nextText } : item)),
                              )
                            }}
                            className="input-magical"
                            placeholder="Describe this ore"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button onClick={handleConfirm} disabled={isSaving} className="gold-button disabled:cursor-not-allowed disabled:opacity-60">
                        {isSaving ? 'Saving...' : 'Store in Vault'}
                      </button>
                      <button onClick={() => setOres([])} className="glass-chip">Discard</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGeneratingOres && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              className="fantasy-card w-full max-w-md rounded-[32px] p-8 text-center"
            >
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[#8b6914]/20 border-t-[#8b6914]" />
              <p className="cinzel mt-6 text-xl font-bold uppercase tracking-[0.24em] text-[#8b6914]">Collecting</p>
              <p className="mt-3 text-lg leading-8 text-[#5b3a1c]">Your journal is being distilled into fresh ores...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FantasyShell>
  )
}
