'use client'

import { useRouter, useSearchParams } from 'next/navigation'
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

const statuses = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

export function CaseFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentSpecialty = searchParams.get('specialty') || ''
  const currentStatus = searchParams.get('status') || ''

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  return (
    <div className="flex gap-4">
      <Select
        value={currentSpecialty}
        onValueChange={(value) => {
          router.push(`/cases?${createQueryString('specialty', value)}`)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Specialties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Specialties</SelectItem>
          {specialties.map((specialty) => (
            <SelectItem key={specialty.value} value={specialty.value}>
              {specialty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentStatus}
        onValueChange={(value) => {
          router.push(`/cases?${createQueryString('status', value)}`)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 