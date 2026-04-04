'use client'

import type { ReactNode } from 'react'

export function ParchmentPanel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`parchment-panel ${className}`}>{children}</div>
}
