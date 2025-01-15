import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { CaseFilters } from './case-filters'

interface CaseListItem {
  id: string
  title: string
  description: string
  specialty: string
  status: 'open' | 'closed'
  created_at: string
  author: {
    full_name: string
    specialty: string
  }
  _count: {
    answers: number
  }
}

async function getCases(searchParams: { [key: string]: string | undefined }) {
  const supabase = createServerSupabaseClient()
  
  let query = supabase
    .from('cases')
    .select(`
      *,
      author:profiles!cases_author_id_fkey(full_name, specialty),
      answers(count)
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (searchParams.specialty) {
    query = query.eq('specialty', searchParams.specialty)
  }
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching cases:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    _count: {
      answers: item.answers.count
    }
  })) as CaseListItem[]
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const cases = await getCases(searchParams)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Browse and discuss medical cases with colleagues
          </p>
        </div>
        <Link href="/cases/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Case
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <CaseFilters />
      </div>

      <div className="grid gap-4">
        {cases.map((case_) => (
          <Link key={case_.id} href={`/cases/${case_.id}`}>
            <div className="p-6 border rounded-lg hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{case_.title}</h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {case_.description}
                  </p>
                </div>
                <Badge variant={case_.status === 'open' ? 'default' : 'secondary'}>
                  {case_.status}
                </Badge>
              </div>
              
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>{case_.author.full_name}</span>
                <span className="mx-2">•</span>
                <span>{case_.specialty}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(case_.created_at), 'MMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <span>{case_._count.answers} answers</span>
              </div>
            </div>
          </Link>
        ))}

        {cases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No cases found</p>
          </div>
        )}
      </div>
    </div>
  )
} 