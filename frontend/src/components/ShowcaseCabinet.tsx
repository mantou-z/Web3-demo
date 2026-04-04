'use client'

import { ReactNode, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { showcaseCabinetTuning } from '@/utils/sceneTuning'
import { uiAssets } from '@/utils/uiAssets'

type ShowcaseCabinetProps<T extends { id: string }> = {
  title: string
  helperText: string
  emptyMessage: string
  items: T[]
  renderSlot: (item: T) => ReactNode
  renderModalItem: (item: T) => ReactNode
}

export function ShowcaseCabinet<T extends { id: string }>({
  title,
  helperText,
  emptyMessage,
  items,
  renderSlot,
  renderModalItem,
}: ShowcaseCabinetProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mx-auto w-full text-center"
        style={{
          maxWidth: `${showcaseCabinetTuning.maxWidth}px`,
          transform: `translate(${showcaseCabinetTuning.offsetX}px, ${showcaseCabinetTuning.offsetY}px)`,
        }}
      >
        <img
          src={uiAssets.crystalCabinet}
          alt={title}
          className="w-full object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <p
          className="cinzel font-bold uppercase tracking-[0.28em] text-[#b59a4b]"
          style={{
            marginTop: `${showcaseCabinetTuning.titleMarginTop}px`,
            fontSize: `${showcaseCabinetTuning.titleFontSize}px`,
          }}
        >
          {title}
        </p>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              className="fantasy-card w-full max-w-5xl rounded-[32px] p-6 md:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="cinzel text-sm font-bold uppercase tracking-[0.25em] text-[#8b6914]">{title}</p>
                  <p className="text-lg text-[#5b3a1c]">{helperText}</p>
                </div>
                <button onClick={() => setOpen(false)} className="glass-chip">Close</button>
              </div>

              {items.length > 0 ? (
                <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-2 md:grid-cols-3">
                  {items.map((item) => (
                    <div key={item.id}>{renderModalItem(item)}</div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-[#8b6914]/20 bg-white/35 px-4 py-10 text-center text-[#7b5a39]">
                  {emptyMessage}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
