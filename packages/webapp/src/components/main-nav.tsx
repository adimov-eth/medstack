'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home,
  FileText,
  User,
  LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      active: pathname === '/dashboard',
    },
    {
      href: '/cases',
      label: 'Cases',
      icon: FileText,
      active: pathname.startsWith('/cases'),
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      active: pathname === '/profile',
    },
  ]

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'flex items-center text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          <route.icon className="mr-2 h-4 w-4" />
          {route.label}
        </Link>
      ))}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="text-muted-foreground hover:text-primary"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </nav>
  )
} 