'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const specialties = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'internal', label: 'Internal Medicine' },
]

interface ProfileFormProps {
  initialData: {
    full_name: string
    email: string
    specialty?: string
    institution?: string
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          specialty: formData.specialty,
          institution: formData.institution,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
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

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty">Specialty</Label>
        <Select
          value={formData.specialty}
          onValueChange={value => setFormData({ ...formData, specialty: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.value} value={specialty.value}>
                {specialty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={formData.institution || ''}
          onChange={e => setFormData({ ...formData, institution: e.target.value })}
          placeholder="Hospital or Medical Center"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
} 