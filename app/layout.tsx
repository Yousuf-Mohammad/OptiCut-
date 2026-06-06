import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OptiCut — Precision Cutting Optimizer',
  description: 'Advanced cutting stock optimization for 1D, 2D, and 3D materials. Minimize waste, maximize efficiency.',
  generator: 'OptiCut',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable} ${syne.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
