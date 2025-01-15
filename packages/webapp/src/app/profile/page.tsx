import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import ProfileForm from './profile-form'
import { AccountSettings } from './account-settings'

async function getProfileData() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's cases
  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      answers(count)
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  // Get user's answers
  const { data: answers } = await supabase
    .from('answers')
    .select(`
      *,
      case:cases(title)
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return {
    profile,
    stats: {
      totalCases: cases?.length || 0,
      totalAnswers: answers?.length || 0,
      acceptedAnswers: answers?.filter(a => a.is_accepted).length || 0
    },
    cases: cases?.map(c => ({
      ...c,
      _count: {
        answers: c.answers.count
      }
    })) || [],
    answers: answers || []
  }
}

export default async function ProfilePage() {
  const data = await getProfileData()
  
  if (!data) {
    notFound()
  }

  const { data: { user } } = await createServerSupabaseClient().auth.getUser()

  return (
    <div className="container py-8">
      <div className="grid gap-8">
        {/* Profile Overview */}
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm initialData={data.profile} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountSettings 
                userId={user?.id || ''} 
                avatarUrl={data.profile.avatar_url} 
              />
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalCases}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.totalAnswers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats.acceptedAnswers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cases">
              <TabsList>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cases" className="space-y-4">
                {data.cases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{case_.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(case_.created_at), 'MMM d, yyyy')} • {case_._count.answers} answers
                      </div>
                    </div>
                    <Badge variant={case_.status === 'open' ? 'default' : 'secondary'}>
                      {case_.status}
                    </Badge>
                  </div>
                ))}
                {data.cases.length === 0 && (
                  <p className="text-muted-foreground">No cases created yet</p>
                )}
              </TabsContent>

              <TabsContent value="answers" className="space-y-4">
                {data.answers.map((answer) => (
                  <div key={answer.id} className="p-4 border rounded-lg">
                    <div className="font-medium">{answer.case.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(answer.created_at), 'MMM d, yyyy')}
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{answer.content}</p>
                    {answer.is_accepted && (
                      <Badge variant="success" className="mt-2">Accepted Answer</Badge>
                    )}
                  </div>
                ))}
                {data.answers.length === 0 && (
                  <p className="text-muted-foreground">No answers provided yet</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 