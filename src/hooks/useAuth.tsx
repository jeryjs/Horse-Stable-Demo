import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useIndexedDb } from './useIndexedDb'

const sessionKey = 'auth-session'

export interface AuthUser {
  id: string
  email: string
  displayName: string
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function displayNameFromEmail(email: string) {
  const localPart = email.split('@')[0]
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { read, write } = useIndexedDb()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void read<AuthUser>(sessionKey).then((storedUser) => {
      setUser(storedUser ?? null)
      setIsLoading(false)
    })
  }, [read])

  const login = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase()
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        throw new Error('Enter a valid work email address.')
      }
      if (password.trim().length < 6) {
        throw new Error('Your password must be at least 6 characters.')
      }

      const nextUser: AuthUser = {
        id: `local-user:${normalizedEmail}`,
        email: normalizedEmail,
        displayName: displayNameFromEmail(normalizedEmail),
      }
      await write(sessionKey, nextUser)
      setUser(nextUser)
    },
    [write],
  )

  const logout = useCallback(async () => {
    await write(sessionKey, undefined)
    setUser(null)
  }, [write])

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [isLoading, login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}