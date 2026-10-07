import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useIndexedDb } from './useIndexedDb'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedThemeMode = Exclude<ThemeMode, 'system'>

interface ThemeModeContextValue {
  mode: ThemeMode
  resolvedMode: ResolvedThemeMode
  setMode: (mode: ThemeMode) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)
const themeModeKey = 'theme-mode'

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const { read, write } = useIndexedDb()
  const [mode, setModeState] = useState<ThemeMode>('system')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  useEffect(() => {
    void read<ThemeMode>(themeModeKey).then((storedMode) => {
      if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
        setModeState(storedMode)
      }
    })
  }, [read])

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode)
    void write(themeModeKey, nextMode)
  }, [write])
  const resolvedMode: ResolvedThemeMode =
    mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode

  const value = useMemo(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode],
  )

  return (
    <ThemeModeContext.Provider value={value}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext)
  if (!context) throw new Error('useThemeMode must be used inside ThemeModeProvider.')
  return context
}