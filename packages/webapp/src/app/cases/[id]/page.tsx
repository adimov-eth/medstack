import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AddAnswer from './add-answer'
import AcceptAnswerButton from './accept-answer-button'

interface Attachment {
  id: string
  file_path: string
  file_type: string
  signedUrl?: string
}

interface Answer {
  id: string
  content: string
  created_at: string
  is_accepted: boolean
  author: {
    full_name: string
    specialty: string
  }
}

interface CaseData {
  id: string
  title: string
  description: string
  created_at: string
  status: 'open' | 'closed'
  author: {
    full_name: string
    specialty: string
  }
  attachments: Attachment[]
  answers: Answer[]
  isAuthor: boolean
}

async function getCaseWithDetails(id: string) {
  const supabase = createServerSupabaseClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select(`
      *,
      author:profiles!cases_author_id_fkey(full_name, specialty),
      answers(
        *,
        author:profiles!answers_author_id_fkey(full_name, specialty)
      ),
      attachments(*)
    `)
    .eq('id', id)
    .single()

  if (caseError || !caseData) {
    return null
  }

  // Get signed URLs for attachments
  if (caseData.attachments) {
    for (const attachment of caseData.attachments) {
      const { data } = await supabase.storage
        .from('case-attachments')
        .createSignedUrl(attachment.file_path, 3600) // 1 hour expiry

      attachment.signedUrl = data?.signedUrl
    }
  }

  return {
    ...caseData,
    isAuthor: user?.id === caseData.author_id
  } as CaseData
}

export default async function CaseDetail({
  params
}: {
  params: { id: string }
}) {
  const caseData = await getCaseWithDetails(params.id)
  
  if (!caseData) {
    notFound()
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-6">
        {/* Case Header */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{caseData.title}</h1>
            <Badge variant={caseData.status === 'open' ? 'default' : 'secondary'}>
              {caseData.status}
            </Badge>
          </div>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <span>Posted by {caseData.author.full_name}</span>
            <span className="mx-2">•</span>
            <span>{caseData.author.specialty}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(caseData.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {/* Case Description */}
        <div className="prose max-w-none">
          <p>{caseData.description}</p>
        </div>

        {/* Attachments */}
        {caseData.attachments?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            <div className="grid grid-cols-2 gap-4">
              {caseData.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-medium">{attachment.file_path.split('-').pop()}</div>
                  <div className="text-sm text-muted-foreground">
                    {attachment.file_type}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Answers Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Answers ({caseData.answers?.length || 0})
          </h2>

          <div className="space-y-6">
            {caseData.answers?.map((answer) => (
              <div key={answer.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{answer.author.full_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {answer.author.specialty}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(answer.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-gray-700">{answer.content}</p>
                {answer.is_accepted && (
                  <Badge className="mt-2" variant="success">Accepted Answer</Badge>
                )}
                <AcceptAnswerButton
                  caseId={caseData.id}
                  answerId={answer.id}
                  isAuthor={caseData.isAuthor}
                  isAccepted={answer.is_accepted}
                />
              </div>
            ))}

            {!caseData.answers?.length && (
              <p className="text-muted-foreground">No answers yet. Be the first to answer!</p>
            )}
          </div>
        </div>

        {/* Add Answer Form */}
        {caseData.status === 'open' && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
            <AddAnswer caseId={caseData.id} />
          </div>
        )}
      </div>
    </div>
  )
} 