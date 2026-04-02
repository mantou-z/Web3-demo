import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alcheme - 炼金术',
  description: 'What you do and how you think build who you are. Define yourself, beyond the rules.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} dark-gradient min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
