'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../supabase'

type SupabaseAuthState = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

type SupabaseAuthContextType = SupabaseAuthState & {
  signOut: () => Promise<{ error: AuthError | null }>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(
  undefined
)

export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [authState, setAuthState] = useState<SupabaseAuthState>({
    user: null,
    session: null,
    isLoading: true,
  })

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState((current) => ({
        ...current,
        session,
        user: session?.user ?? null,
        isLoading: false,
      }))
    })

    // Listen for changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState((current) => ({
          ...current,
          session,
          user: session?.user ?? null,
        }))
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    ...authState,
    signOut: () => supabase.auth.signOut(),
  }

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
} 