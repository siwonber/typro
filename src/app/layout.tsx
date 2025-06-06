import './globals.css'
import { Roboto_Mono } from 'next/font/google'
import type { Metadata } from 'next'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Typro',
  description: 'The ultimate typing battle experience.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${robotoMono.variable} dark overflow-hidden`}>
      <body className="h-screen overflow-hidden font-sans antialiased bg-background text-text">
        {children}
      </body>
    </html>
  )
}
