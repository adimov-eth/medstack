import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { SupabaseAuthProvider } from '@/lib/providers/supabase-auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedStack - Medical Case Sharing Platform',
  description: 'A platform for medical professionals to share and discuss clinical cases',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </SupabaseAuthProvider>
      </body>
    </html>
  )
} 