import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import type {
  Activity,
  ActivityInput,
  Horse,
  HorseInput,
  StableSnapshot,
} from '../types/stable'
import { createSeedSnapshot } from './seedData'
import { useIndexedDb } from './useIndexedDb'

const snapshotKey = 'stable-snapshot'

interface StableDataContextValue {
  horses: Horse[]
  activities: Activity[]
  isHydrated: boolean
  getHorse: (horseId: string) => Horse | undefined
  getActivitiesForHorse: (horseId: string) => Activity[]
  addHorse: (input: HorseInput) => Promise<Horse>
  updateHorse: (horseId: string, input: HorseInput) => Promise<Horse>
  addActivity: (input: ActivityInput) => Promise<Activity>
  updateActivity: (activityId: string, input: ActivityInput) => Promise<Activity>
  deleteActivity: (activityId: string) => Promise<void>
}

const StableDataContext = createContext<StableDataContextValue | null>(null)

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
}

export function StableDataProvider({ children }: PropsWithChildren) {
  const { read, write } = useIndexedDb()
  const [snapshot, setSnapshot] = useState<StableSnapshot>(createSeedSnapshot)
  const [isHydrated, setIsHydrated] = useState(false)
  const snapshotRef = useRef(snapshot)

  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  useEffect(() => {
    let mounted = true

    void read<StableSnapshot>(snapshotKey).then((storedSnapshot) => {
      if (!mounted) return

      if (storedSnapshot) {
        setSnapshot(storedSnapshot)
      } else {
        void write(snapshotKey, snapshotRef.current)
      }
      setIsHydrated(true)
    })

    return () => {
      mounted = false
    }
  }, [read, write])

  const commit = useCallback(
    (nextSnapshot: StableSnapshot) => {
      snapshotRef.current = nextSnapshot
      setSnapshot(nextSnapshot)
      return write(snapshotKey, nextSnapshot)
    },
    [write],
  )

  const addHorse = useCallback(
    async (input: HorseInput) => {
      const now = new Date().toISOString()
      const horse: Horse = {
        ...input,
        id: createId('EQ'),
        createdAt: now,
        updatedAt: now,
      }
      const nextSnapshot = {
        ...snapshotRef.current,
        horses: [...snapshotRef.current.horses, horse],
      }

      await commit(nextSnapshot)
      return horse
    },
    [commit],
  )

  const updateHorse = useCallback(
    async (horseId: string, input: HorseInput) => {
      const existingHorse = snapshotRef.current.horses.find(
        (horse) => horse.id === horseId,
      )
      if (!existingHorse) throw new Error(`Horse ${horseId} was not found.`)

      const horse: Horse = {
        ...existingHorse,
        ...input,
        updatedAt: new Date().toISOString(),
      }
      const nextSnapshot = {
        ...snapshotRef.current,
        horses: snapshotRef.current.horses.map((currentHorse) =>
          currentHorse.id === horseId ? horse : currentHorse,
        ),
      }

      await commit(nextSnapshot)
      return horse
    },
    [commit],
  )

  const addActivity = useCallback(
    async (input: ActivityInput) => {
      const activity: Activity = {
        ...input,
        id: createId('ACT'),
        createdAt: new Date().toISOString(),
      }
      const nextSnapshot = {
        ...snapshotRef.current,
        activities: [activity, ...snapshotRef.current.activities],
      }

      await commit(nextSnapshot)
      return activity
    },
    [commit],
  )

  const updateActivity = useCallback(
    async (activityId: string, input: ActivityInput) => {
      const existingActivity = snapshotRef.current.activities.find(
        (activity) => activity.id === activityId,
      )
      if (!existingActivity) {
        throw new Error(`Activity ${activityId} was not found.`)
      }

      const activity: Activity = { ...existingActivity, ...input }
      const nextSnapshot = {
        ...snapshotRef.current,
        activities: snapshotRef.current.activities.map((currentActivity) =>
          currentActivity.id === activityId ? activity : currentActivity,
        ),
      }

      await commit(nextSnapshot)
      return activity
    },
    [commit],
  )

  const deleteActivity = useCallback(
    async (activityId: string) => {
      const nextSnapshot = {
        ...snapshotRef.current,
        activities: snapshotRef.current.activities.filter(
          (activity) => activity.id !== activityId,
        ),
      }
      await commit(nextSnapshot)
    },
    [commit],
  )

  const value = useMemo<StableDataContextValue>(
    () => ({
      horses: snapshot.horses,
      activities: snapshot.activities,
      isHydrated,
      getHorse: (horseId) =>
        snapshot.horses.find((horse) => horse.id === horseId),
      getActivitiesForHorse: (horseId) =>
        snapshot.activities
          .filter((activity) => activity.horseId === horseId)
          .sort((first, second) => second.date.localeCompare(first.date)),
      addHorse,
      updateHorse,
      addActivity,
      updateActivity,
      deleteActivity,
    }),
    [
      snapshot,
      isHydrated,
      addHorse,
      updateHorse,
      addActivity,
      updateActivity,
      deleteActivity,
    ],
  )

  return (
    <StableDataContext.Provider value={value}>
      {children}
    </StableDataContext.Provider>
  )
}

export function useStableData() {
  const context = useContext(StableDataContext)
  if (!context) throw new Error('useStableData must be used inside StableDataProvider.')
  return context
}