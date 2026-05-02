import './globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'ChessTools',
  description: 'ChessTools for organizers, players, and arbiters worldwide.',
  icons: {
    icon: [{ url: '/chesstools.svg', type: 'image/svg+xml', sizes: 'any' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <GoogleAnalytics />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/60 bg-background/95">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center">
            <Link href="/" className="transition-opacity hover:opacity-80" aria-label="ChessTools home">
              <Image src="/chesstools.svg" alt="ChessTools" width={140} height={48} className="h-9 w-auto" />
            </Link>
            <p className="max-w-3xl text-sm text-muted-foreground">
              ChessTools builds practical, accessible chess tools that help organizers, players, coaches, and arbiters run events, study faster, and enjoy the game more.
            </p>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground" aria-label="Footer links">
              <Link href="/about" className="transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="mailto:info@chesstools.org" className="transition-colors hover:text-foreground">
                Contact
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-foreground">
                Privacy
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}

