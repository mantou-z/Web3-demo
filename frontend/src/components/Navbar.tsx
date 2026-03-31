'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚒️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Growth Forge
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
              我的目标
            </Link>
            <Link href="/inventory" className="text-gray-600 hover:text-purple-600 transition-colors">
              背包
            </Link>
            <Link href="/forge" className="text-gray-600 hover:text-purple-600 transition-colors">
              锻造台
            </Link>
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
