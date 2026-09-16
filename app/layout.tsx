import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from './cart-provider'

export const metadata: Metadata = {
  title: 'APEX — Forensic Sound Design',
  description:
    'Music projects, sound banks, samples, MIDI and one-to-one production sessions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}