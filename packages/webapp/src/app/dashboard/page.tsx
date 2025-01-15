import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default async function Dashboard() {
  const supabase = createServerSupabaseClient()
  
  // Get user profile
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Get recent cases
  const { data: recentCases } = await supabase
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile?.full_name}</h1>
          <p className="text-muted-foreground">{profile?.specialty || 'No specialty set'}</p>
        </div>
        <Link href="/cases/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Case
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Cases</h2>
          {recentCases?.length ? (
            <div className="grid gap-4">
              {recentCases.map((case_) => (
                <Link href={`/cases/${case_.id}`} key={case_.id}>
                  <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <h3 className="font-medium">{case_.title}</h3>
                    <p className="text-sm text-muted-foreground">{case_.specialty}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No cases yet</p>
          )}
        </div>
      </div>
    </div>
  )
} 