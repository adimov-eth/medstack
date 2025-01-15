'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Upload } from 'lucide-react'

export default function NewCase() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specialty: '',
    attachments: [] as File[]
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          title: formData.title,
          description: formData.description,
          specialty: formData.specialty,
          author_id: user.id,
          status: 'open'
        })
        .select()
        .single()

      if (caseError) throw caseError

      // Upload attachments if any
      if (formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${caseData.id}-${Math.random()}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage
            .from('case-attachments')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          // Create attachment record
          const { error: attachmentError } = await supabase
            .from('attachments')
            .insert({
              file_path: fileName,
              file_type: file.type,
              parent_case_id: caseData.id,
              author_id: user.id
            })

          if (attachmentError) throw attachmentError
        }
      }

      router.push(`/cases/${caseData.id}`)
    } catch (error: any) {
      setError(error.message)
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 5 * 1024 * 1024 // 5MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        setError('Please upload only PDF or image files')
        return false
      }
      if (file.size > maxSize) {
        setError('Files must be less than 5MB')
        return false
      }
      return true
    })

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }))
    setError('')
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Create New Case</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Select
            value={formData.specialty}
            onValueChange={value => setFormData({ ...formData, specialty: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="internal">Internal Medicine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Attachments</Label>
          <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              className="hidden"
              id="attachments"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <label 
              htmlFor="attachments" 
              className="flex flex-col items-center cursor-pointer space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                Upload images or documents
              </span>
              <span className="text-xs text-gray-400">
                PDF, JPG or PNG (max. 5MB each)
              </span>
            </label>
          </div>
          {formData.attachments.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Selected files:</p>
              <ul className="text-sm text-gray-500">
                {formData.attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Case'}
        </Button>
      </form>
    </div>
  )
} 