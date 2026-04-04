'use client'

import type { ReactNode } from 'react'
import { sceneAssets } from '@/components/scene/assets'

export function SceneShell({
  children,
  className = '',
  frameClassName = '',
  backgroundImage,
}: {
  children: ReactNode
  className?: string
  frameClassName?: string
  backgroundImage?: string
}) {
  const bgImage = backgroundImage || sceneAssets.shared.background

  return (
    <div className={`scene-shell ${className}`}>
      <div
        className="scene-shell__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="scene-shell__veil" />
      <div className="scene-shell__sparkles" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="scene-shell__sparkle"
            style={{
              left: `${(index * 17) % 100}%`,
              top: `${(index * 31) % 100}%`,
              animationDelay: `${(index % 8) * 0.35}s`,
            }}
          />
        ))}
      </div>
      <div className={`scene-frame ${frameClassName}`}>
        {children}
      </div>
    </div>
  )
}
