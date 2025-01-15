'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

export default function AddAnswer({ caseId }: { caseId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: answerError } = await supabase
        .from('answers')
        .insert({
          content,
          case_id: caseId,
          author_id: user.id,
          is_accepted: false
        })

      if (answerError) throw answerError

      setContent('')
      router.refresh() // Refresh the page to show the new answer
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer here..."
        className="min-h-[200px]"
        required
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
      </Button>
    </form>
  )
} 