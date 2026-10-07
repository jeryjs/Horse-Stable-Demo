import type { Activity, Horse, StableSnapshot } from '../types/stable'

function dateDaysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}

const createdAt = new Date().toISOString()

const horses: Horse[] = [
  {
    id: 'EQ-001',
    name: 'Thunder',
    breed: 'Arabian',
    gender: 'Stallion',
    dateOfBirth: '2020-06-18',
    ownerName: 'Ahmed Al Mansoori',
    stallNumber: 'A-01',
    status: 'Training',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'EQ-002',
    name: 'Luna',
    breed: 'Arabian',
    gender: 'Mare',
    dateOfBirth: '2021-03-04',
    ownerName: 'Mohammed Khalifa',
    stallNumber: 'A-02',
    status: 'Active',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'EQ-003',
    name: 'Sultan',
    breed: 'Arabian',
    gender: 'Stallion',
    dateOfBirth: '2018-11-22',
    ownerName: 'Khalid Rashid',
    stallNumber: 'B-04',
    status: 'Medical Attention',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'EQ-004',
    name: 'Clover',
    breed: 'Thoroughbred',
    gender: 'Mare',
    dateOfBirth: '2019-08-13',
    ownerName: 'Noor Equestrian Club',
    stallNumber: 'B-01',
    status: 'Rest',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'EQ-005',
    name: 'Atlas',
    breed: 'Friesian',
    gender: 'Gelding',
    dateOfBirth: '2017-01-27',
    ownerName: 'Rami Haddad',
    stallNumber: 'C-03',
    status: 'Out',
    createdAt,
    updatedAt: createdAt,
  },
]

const activities: Activity[] = [
  {
    id: 'ACT-001',
    horseId: 'EQ-001',
    date: dateDaysAgo(0),
    type: 'Training',
    notes: '45-minute arena work. Excellent response to collection cues.',
    staffTrainer: 'Maya Chen',
    createdAt,
  },
  {
    id: 'ACT-002',
    horseId: 'EQ-002',
    date: dateDaysAgo(0),
    type: 'Grooming',
    notes: 'Full groom and hoof pick before morning turnout.',
    staffTrainer: 'Omar Saeed',
    createdAt,
  },
  {
    id: 'ACT-003',
    horseId: 'EQ-003',
    date: dateDaysAgo(0),
    type: 'Veterinary',
    notes: 'Follow-up check for front-left tenderness. Recheck in 48 hours.',
    staffTrainer: 'Dr. Lina Farouk',
    createdAt,
  },
  {
    id: 'ACT-004',
    horseId: 'EQ-003',
    date: dateDaysAgo(1),
    type: 'Medication',
    notes: 'Anti-inflammatory administered with evening feed.',
    staffTrainer: 'Omar Saeed',
    createdAt,
  },
  {
    id: 'ACT-005',
    horseId: 'EQ-001',
    date: dateDaysAgo(1),
    type: 'Feeding',
    notes: 'Adjusted evening ration after training block.',
    staffTrainer: 'Maya Chen',
    createdAt,
  },
  {
    id: 'ACT-006',
    horseId: 'EQ-004',
    date: dateDaysAgo(2),
    type: 'Farrier',
    notes: 'Balanced trim completed; continue light work this week.',
    staffTrainer: 'Hassan Nouri',
    createdAt,
  },
  {
    id: 'ACT-007',
    horseId: 'EQ-002',
    date: dateDaysAgo(2),
    type: 'Exercise',
    notes: 'Light trail ride with steady pacing throughout.',
    staffTrainer: 'Maya Chen',
    createdAt,
  },
  {
    id: 'ACT-008',
    horseId: 'EQ-005',
    date: dateDaysAgo(4),
    type: 'Rest',
    notes: 'Rest day while competing off-site.',
    staffTrainer: 'Omar Saeed',
    createdAt,
  },
]

export function createSeedSnapshot(): StableSnapshot {
  return {
    horses: structuredClone(horses),
    activities: structuredClone(activities),
  }
}