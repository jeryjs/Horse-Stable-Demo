import { useMemo } from 'react'
import type { Activity, Horse } from '../types/stable'
import { useStableData } from './useStableData'

export type InsightSeverity = 'positive' | 'attention' | 'urgent'

export interface StableInsight {
  horseId: string
  horseName: string
  severity: InsightSeverity
  title: string
  summary: string
  recommendedAction: string
  lastActivityDate?: string
}

function daysSince(date?: string) {
  if (!date) return Number.POSITIVE_INFINITY
  const difference = Date.now() - Date.parse(`${date}T12:00:00`)
  return Math.max(0, Math.floor(difference / 86_400_000))
}

function createInsight(horse: Horse, horseActivities: Activity[]): StableInsight {
  const latestActivity = horseActivities
    .slice()
    .sort((first, second) => second.date.localeCompare(first.date))[0]
  const staleDays = daysSince(latestActivity?.date)

  if (horse.status === 'Medical Attention') {
    return {
      horseId: horse.id,
      horseName: horse.name,
      severity: 'urgent',
      title: 'Veterinary follow-up is due',
      summary: `${horse.name} is marked for medical attention${latestActivity ? ` and was last logged ${staleDays === 0 ? 'today' : `${staleDays} days ago`}` : ''}.`,
      recommendedAction: 'Review the care plan and confirm the next check with the veterinary team.',
      lastActivityDate: latestActivity?.date,
    }
  }

  if (staleDays >= 3) {
    return {
      horseId: horse.id,
      horseName: horse.name,
      severity: 'attention',
      title: 'Activity rhythm has gone quiet',
      summary: `${horse.name} has not had a logged activity for ${staleDays} days.`,
      recommendedAction: 'Schedule a check-in or record the latest stable activity.',
      lastActivityDate: latestActivity?.date,
    }
  }

  if (horse.status === 'Training') {
    return {
      horseId: horse.id,
      horseName: horse.name,
      severity: 'positive',
      title: 'Training rhythm looks healthy',
      summary: `${horse.name} is in a training block with recent stable coverage.`,
      recommendedAction: 'Keep the current cadence and capture the next training note after exercise.',
      lastActivityDate: latestActivity?.date,
    }
  }

  return {
    horseId: horse.id,
    horseName: horse.name,
    severity: 'positive',
    title: 'Stable coverage is on track',
    summary: `${horse.name} has a recent activity record and no current attention flag.`,
    recommendedAction: 'Continue the daily routine and keep the timeline current.',
    lastActivityDate: latestActivity?.date,
  }
}

export function useStableIntelligence() {
  const { horses, activities } = useStableData()

  const insights = useMemo(
    () =>
      horses.map((horse) =>
        createInsight(
          horse,
          activities.filter((activity) => activity.horseId === horse.id),
        ),
      ),
    [horses, activities],
  )

  const getInsight = (horseId: string) =>
    insights.find((insight) => insight.horseId === horseId)

  return {
    insights,
    attentionInsights: insights.filter(
      (insight) => insight.severity !== 'positive',
    ),
    getInsight,
  }
}