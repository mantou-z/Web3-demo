import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Alcheme',
  description: 'What you do and how you think build who you are. Define yourself, beyond the rules.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
