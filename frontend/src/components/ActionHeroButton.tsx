'use client'

import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

type ActionHeroButtonProps = PropsWithChildren<{
  imageSrc: string
  imageAlt: string
  label: string
  onClick: () => void
  maxWidth?: number
  glowClassName?: string
  imageClassName?: string
  offsetX?: number
  offsetY?: number
  labelMarginTop?: number
  labelFontSize?: number
  labelLetterSpacing?: string
  labelOffsetX?: number
  labelOffsetY?: number
  floatY?: number
  floatDuration?: number
  floatDelay?: number
}>

export function ActionHeroButton({
  imageSrc,
  imageAlt,
  label,
  onClick,
  maxWidth,
  glowClassName = 'bg-blue-300/20',
  imageClassName = '',
  offsetX = 0,
  offsetY = 0,
  labelMarginTop = 12,
  labelFontSize = 18,
  labelLetterSpacing = '0.3em',
  labelOffsetX = 0,
  labelOffsetY = 0,
  floatY = 12,
  floatDuration = 5.2,
  floatDelay = 0,
  children,
}: ActionHeroButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full"
      style={{
        maxWidth: `${maxWidth ?? 430}px`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      <div className={`absolute inset-0 rounded-full blur-3xl ${glowClassName}`} />
      <motion.div
        className="relative z-10"
        initial={{ y: 0 }}
        animate={{ y: [0, -floatY, 0] }}
        transition={{
          duration: floatDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
          delay: floatDelay,
        }}
      >
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${imageClassName}`}
        />
      </motion.div>
      <p
        className="cinzel text-center font-bold uppercase text-[#8b6914]"
        style={{
          marginTop: `${labelMarginTop}px`,
          fontSize: `${labelFontSize}px`,
          letterSpacing: labelLetterSpacing,
          transform: `translate(${labelOffsetX}px, ${labelOffsetY}px)`,
        }}
      >
        {label}
      </p>
      {children}
    </button>
  )
}
