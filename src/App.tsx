import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { StableDataProvider } from './hooks/useStableData'
import { ThemeModeProvider, useThemeMode } from './hooks/useThemeMode'
import { createAppTheme } from './theme/theme'
import { DashboardPage } from './pages/DashboardPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { HorseProfilePage } from './pages/HorseProfilePage'
import { HorsesPage } from './pages/HorsesPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ThemedApplication() {
  const { resolvedMode } = useThemeMode()
  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StableDataProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/horses" element={<HorsesPage />} />
              <Route path="/horses/:horseId" element={<HorseProfilePage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </StableDataProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ThemeModeProvider>
      <ThemedApplication />
    </ThemeModeProvider>
  )
}
