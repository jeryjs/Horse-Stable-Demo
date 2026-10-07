import { useCallback } from 'react'

const databaseName = 'equus-stable'
const storeName = 'application'
const databaseVersion = 1

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function useIndexedDb() {
  const read = useCallback(async <Value,>(key: string) => {
    const database = await openDatabase()

    return new Promise<Value | undefined>((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly')
      const request = transaction.objectStore(storeName).get(key)

      request.onsuccess = () => {
        database.close()
        resolve(request.result as Value | undefined)
      }
      request.onerror = () => {
        database.close()
        reject(request.error)
      }
    })
  }, [])

  const write = useCallback(async <Value,>(key: string, value: Value) => {
    const database = await openDatabase()

    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite')
      const request = transaction.objectStore(storeName).put(value, key)

      request.onsuccess = () => {
        database.close()
        resolve()
      }
      request.onerror = () => {
        database.close()
        reject(request.error)
      }
    })
  }, [])

  return { read, write }
}