'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface AcceptAnswerButtonProps {
  caseId: string
  answerId: string
  isAuthor: boolean
  isAccepted: boolean
}

export default function AcceptAnswerButton({ 
  caseId, 
  answerId, 
  isAuthor,
  isAccepted 
}: AcceptAnswerButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAcceptAnswer = async () => {
    if (!isAuthor || isLoading) return
    setIsLoading(true)

    try {
      // Update the answer to be accepted
      const { error: answerError } = await supabase
        .from('answers')
        .update({ is_accepted: true })
        .eq('id', answerId)

      if (answerError) throw answerError

      // Update the case with the accepted answer ID
      const { error: caseError } = await supabase
        .from('cases')
        .update({ 
          accepted_answer_id: answerId,
          status: 'closed'
        })
        .eq('id', caseId)

      if (caseError) throw caseError

      router.refresh()
    } catch (error) {
      console.error('Error accepting answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthor || isAccepted) return null

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleAcceptAnswer}
      disabled={isLoading}
      className="mt-2"
    >
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Accept Answer
    </Button>
  )
} 