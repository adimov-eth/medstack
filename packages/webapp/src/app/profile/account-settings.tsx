'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AccountSettingsProps {
  userId: string
  avatarUrl?: string | null
}

export function AccountSettings({ userId, avatarUrl }: AccountSettingsProps) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      // Upload avatar
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('id', userId)

      if (updateError) throw updateError

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) throw error

      setPasswords({ current: '', new: '', confirm: '' })
      setIsDialogOpen(false)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-muted">
            {avatarUrl && (
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}`}
                alt="Avatar"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <input
              type="file"
              id="avatar"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isLoading}
            />
            <Label
              htmlFor="avatar"
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Upload New Picture
            </Label>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG or GIF (max. 5MB)
            </p>
          </div>
        </div>
      </div>

      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Change Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your new password below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.new}
                  onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Password'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 