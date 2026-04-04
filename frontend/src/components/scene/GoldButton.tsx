'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function GoldButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}) {
  return (
    <button
      {...props}
      className={`gold-button ${className}`.trim()}
    >
      {children}
    </button>
  )
}
