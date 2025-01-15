import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  )
} 