import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - MedStack',
  description: 'Sign in or register for MedStack',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 