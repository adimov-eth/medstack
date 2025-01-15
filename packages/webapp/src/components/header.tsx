'use client'

import Link from 'next/link'
import { MainNav } from './main-nav'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">MedStack</span>
        </Link>
        <MainNav />
      </div>
    </header>
  )
} 