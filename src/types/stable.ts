export const horseStatuses = [
  'Active',
  'Training',
  'Rest',
  'Medical Attention',
  'Out',
] as const

export type HorseStatus = (typeof horseStatuses)[number]

export const activityTypes = [
  'Training',
  'Exercise',
  'Feeding',
  'Grooming',
  'Veterinary',
  'Medication',
  'Farrier',
  'Rest',
  'Other',
] as const

export type ActivityType = (typeof activityTypes)[number]

export type HorseGender = 'Mare' | 'Stallion' | 'Gelding'

export interface Horse {
  id: string
  name: string
  breed: string
  gender: HorseGender
  dateOfBirth: string
  ownerName: string
  stallNumber: string
  status: HorseStatus
  photoDataUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  horseId: string
  date: string
  type: ActivityType
  notes: string
  staffTrainer: string
  createdAt: string
}

export type HorseInput = Omit<Horse, 'id' | 'createdAt' | 'updatedAt'>
export type ActivityInput = Omit<Activity, 'id' | 'createdAt'>

export interface StableSnapshot {
  horses: Horse[]
  activities: Activity[]
}