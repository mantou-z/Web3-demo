'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ActionHeroButton } from '@/components/ActionHeroButton'
import { useMintMedal } from '@/hooks/useContracts'
import { FantasyShell } from '@/components/FantasyShell'
import { FloatingArtwork } from '@/components/FloatingArtwork'
import { ShowcaseCabinet } from '@/components/ShowcaseCabinet'
import { archivePanelTuning, centerArtworkTuning, characterFigureTuning, heroFloatTuning } from '@/utils/sceneTuning'
import { uiAssets } from '@/utils/uiAssets'

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
  const [showSelection, setShowSelection] = useState(false)
  const [isAwakening, setIsAwakening] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newMedal, setNewMedal] = useState<Medal | null>(null)
  const [editableTitle, setEditableTitle] = useState('')
  const [isPersistingMint, setIsPersistingMint] = useState(false)
  const [hasMintedCurrent, setHasMintedCurrent] = useState(false)
  const [lastHandledMintHash, setLastHandledMintHash] = useState<`0x${string}` | undefined>(undefined)
  const isGeneratingMedal = isAwakening

  // Tuning knobs for this page:
  // - centerArtworkTuning.awaken controls the idle door size and placement
  // - resultMedalSize controls the preview medal diameter
  const resultMedalSize = 260

  const { mintMedal, isPending: isMinting, isConfirmed: mintConfirmed, receipt, hash } = useMintMedal()

  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false)
      return
    }

    void fetchData()
  }, [isConnected, address])

  useEffect(() => {
    if (
      isPersistingMint &&
      mintConfirmed &&
      receipt &&
      hash &&
      hash !== lastHandledMintHash &&
      receipt.transactionHash === hash &&
      newMedal
    ) {
      const medalMintedEvent = receipt.logs.find((log) => {
        return log.topics[0] === '0xdccdb8897eec6a644b93d2ff2b1d5a7fee4603857d745585ad971dfcd0ccd299'
      })

      if (medalMintedEvent && medalMintedEvent.topics[2]) {
        const tokenId = BigInt(medalMintedEvent.topics[2])

        fetch(`/api/medals/${newMedal.id}/mint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: tokenId.toString() }),
        })
          .then(() => {
            setSelectedCards([])
            setSelectedMedal(null)
            setHasMintedCurrent(true)
            setLastHandledMintHash(hash)
            void fetchData()
          })
          .catch((error) => {
            console.error('Error syncing minted medal:', error)
          })
          .finally(() => {
            setIsPersistingMint(false)
          })
      }
    }
  }, [hash, isPersistingMint, lastHandledMintHash, mintConfirmed, receipt, newMedal])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [cardsRes, medalsRes] = await Promise.all([
        fetch(`/api/cards/${address}`).then((res) => res.json()),
        fetch(`/api/medals/${address}`).then((res) => res.json()),
      ])

      if (cardsRes.success) setCards(cardsRes.cards)
      if (medalsRes.success) setMedals(medalsRes.medals)
    } catch (error) {
      console.error('Error fetching awakening data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAwaken = async () => {
    if (!address || selectedCards.length === 0) return

    setIsAwakening(true)
    setShowSelection(false)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:30001'
      const [result] = await Promise.all([
        fetch(`${backendUrl}/api/medals/awaken`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: address,
            cardIds: selectedCards,
            existingMedalId: selectedMedal,
          }),
        }).then((res) => res.json()),
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ])

      if (result.success) {
        setNewMedal(result.medal)
        setEditableTitle(result.medal.title)
        setHasMintedCurrent(false)
        setIsPersistingMint(false)
      }
    } catch (error) {
      console.error('Error awakening medal:', error)
    } finally {
      setIsAwakening(false)
    }
  }

  const handleMint = async () => {
    if (!newMedal || isPersistingMint || hasMintedCurrent) return

    if (editableTitle !== newMedal.title) {
      await fetch(`/api/medals/${newMedal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editableTitle }),
      })
    }

    try {
      setIsPersistingMint(true)
      mintMedal(newMedal.image_url, editableTitle, newMedal.description)
    } catch (error) {
      setIsPersistingMint(false)
      console.error('Error minting medal:', error)
    }
  }

  const handleContinueAwakening = async () => {
    setSelectedCards([])
    setSelectedMedal(null)
    setNewMedal(null)
    setEditableTitle('')
    setHasMintedCurrent(false)
    setIsPersistingMint(false)
    await fetchData()
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
            <p className="mt-4 text-xl">Connect your wallet to awaken or evolve medals.</p>
          </div>
        ) : newMedal ? (
          <div className="fantasy-card w-full max-w-[400px] rounded-[32px] p-6 text-center">
            <p className="cinzel text-sm font-bold uppercase tracking-[0.25em] text-[#8b6914]">Medal Forged</p>
            <div
              className="relative mx-auto mt-4"
              style={{ height: `${resultMedalSize}px`, width: `${resultMedalSize}px` }}
            >
              <div className="absolute inset-0 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="relative z-10 h-full w-full rounded-full bg-white/35 p-2 shadow-2xl">
                <img
                  src={newMedal.image_url}
                  alt={newMedal.title}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
            </div>
            <input value={editableTitle} onChange={(event) => setEditableTitle(event.target.value)} className="input-magical mt-4 text-center text-lg" />
            <p className="mt-3 text-base leading-7 text-[#5b3a1c]">{newMedal.description}</p>
            {hasMintedCurrent ? (
              <button onClick={() => void handleContinueAwakening()} className="gold-button mt-4 w-full">
                Continue Awakening
              </button>
            ) : (
              <button onClick={handleMint} disabled={isMinting || isPersistingMint} className="gold-button mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {isMinting || isPersistingMint ? 'Minting...' : 'Mint On-Chain'}
              </button>
            )}
          </div>
        ) : (
          <>
            <ActionHeroButton
              imageSrc={uiAssets.awakenDoor}
              imageAlt="Awaken door"
              label="Open Ritual"
              onClick={() => setShowSelection((current) => !current)}
              glowClassName="bg-yellow-200/20"
              imageClassName="drop-shadow-[0_15px_40px_rgba(139,92,246,0.35)]"
              maxWidth={centerArtworkTuning.awaken.maxWidth}
              offsetX={centerArtworkTuning.awaken.offsetX}
              offsetY={centerArtworkTuning.awaken.offsetY}
              floatY={heroFloatTuning.awakenDoor.floatY}
              floatDuration={heroFloatTuning.awakenDoor.floatDuration}
              floatDelay={heroFloatTuning.awakenDoor.floatDelay}
            />

          </>
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
            <p className="cinzel text-base font-bold uppercase tracking-[0.25em] text-[#8b6914]">Honor Archive</p>
            <p className="mt-3 text-5xl font-bold">{cards.length}</p>
            <p className="mt-2 text-lg">available cards</p>
            <p className="mt-4 text-3xl font-bold">{medals.length}</p>
            <p className="text-lg">stored medals</p>
          </div>
        </div>

        <ShowcaseCabinet
          title="Medal Showcase"
          helperText={isLoading ? 'Loading sacred echoes...' : 'Click to inspect your awakened medals'}
          emptyMessage="Your first medal will appear here."
          items={medals.slice(0, 12)}
          renderSlot={(medal) => (
            <div className="h-[74%] w-[74%] overflow-hidden rounded-full border border-white/40 bg-white/20 shadow-md">
              <img src={medal.image_url} alt={medal.title} className="h-full w-full object-cover" />
            </div>
          )}
          renderModalItem={(medal) => (
            <div className="overflow-hidden rounded-[24px] border border-[#8b6914]/15 bg-white/60 p-2 text-center">
              <img src={medal.image_url} alt={medal.title} className="aspect-square w-full rounded-[18px] object-cover" />
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5b3a1c]">{medal.title}</p>
            </div>
          )}
        />
      </div>

      <AnimatePresence>
        {showSelection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 backdrop-blur-sm"
            onClick={() => setShowSelection(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="fantasy-card w-full max-w-6xl rounded-[32px] p-6 md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="cinzel text-sm font-bold uppercase tracking-[0.25em] text-[#8b6914]">Awakening Ritual</p>
                  <p className="text-lg text-[#5b3a1c]">Pick milestone cards, and optionally evolve an existing medal.</p>
                </div>
                <span className="text-sm text-[#8b6914]">{selectedCards.length} cards</span>
              </div>

              <div className="max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <p className="cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#8b6914]">Cards</p>
                  <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {cards.map((card) => {
                      const selected = selectedCards.includes(card.id)
                      return (
                        <button
                          key={card.id}
                          onClick={() => {
                            setSelectedCards((current) =>
                              current.includes(card.id)
                                ? current.filter((id) => id !== card.id)
                                : [...current, card.id],
                            )
                          }}
                          className={`overflow-hidden rounded-[24px] border p-2 transition ${
                            selected ? 'border-[#8b6914] bg-white/80 shadow-lg' : 'border-[#8b6914]/15 bg-white/50'
                          }`}
                        >
                          <img src={card.image_url} alt={card.title} className="aspect-[3/4] w-full rounded-[18px] object-cover" />
                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5b3a1c]">{card.title}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {medals.length > 0 && (
                  <div className="mt-6">
                    <p className="cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#8b6914]">Optional Evolution Target</p>
                    <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                      {medals.map((medal) => {
                        const selected = selectedMedal === medal.id
                        return (
                          <button
                            key={medal.id}
                            onClick={() => setSelectedMedal((current) => (current === medal.id ? null : medal.id))}
                            className={`overflow-hidden rounded-[24px] border p-2 transition ${
                              selected ? 'border-[#8b6914] bg-white/80 shadow-lg' : 'border-[#8b6914]/15 bg-white/50'
                            }`}
                          >
                            <img src={medal.image_url} alt={medal.title} className="aspect-square w-full rounded-[18px] object-cover" />
                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5b3a1c]">{medal.title}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={handleAwaken} disabled={selectedCards.length === 0 || isAwakening} className="gold-button disabled:cursor-not-allowed disabled:opacity-60">
                  {isAwakening ? 'Awakening...' : selectedMedal ? 'Evolve Medal' : 'Awaken Medal'}
                </button>
                <button onClick={() => setShowSelection(false)} className="glass-chip">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGeneratingMedal && (
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
              <p className="cinzel mt-6 text-xl font-bold uppercase tracking-[0.24em] text-[#8b6914]">Awakening</p>
              <p className="mt-3 text-lg leading-8 text-[#5b3a1c]">Your selected cards are being awakened into a new medal...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </FantasyShell>
  )
}
