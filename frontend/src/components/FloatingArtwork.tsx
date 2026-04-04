'use client'

import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

type FloatingArtworkProps = PropsWithChildren<{
  className?: string
  offsetX?: number
  offsetY?: number
  floatY?: number
  duration?: number
  delay?: number
}>

export function FloatingArtwork({
  children,
  className = '',
  offsetX = 0,
  offsetY = 0,
  floatY = 12,
  duration = 5,
  delay = 0,
}: FloatingArtworkProps) {
  return (
    <motion.div
      className={className}
      initial={{ x: offsetX, y: offsetY }}
      style={{ x: offsetX }}
      animate={{ y: [offsetY, offsetY - floatY, offsetY] }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
