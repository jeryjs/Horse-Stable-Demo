import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, md: 4 } }}>
      <Card sx={{ width: '100%', maxWidth: 980, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', md: 'row' }}>
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 6 },
              color: 'primary.contrastText',
              background: (theme) => `linear-gradient(145deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }}
          >
            <Box sx={{ display: 'grid', placeItems: 'center', width: 48, height: 48, mb: 7, borderRadius: '16px 16px 5px 16px', backgroundColor: 'secondary.main', color: 'secondary.contrastText' }}>
              <LockOpenRoundedIcon />
            </Box>
            <Typography variant="overline" sx={{ color: 'inherit', opacity: 0.72 }}>Equus / workspace access</Typography>
            <Typography variant="h1" sx={{ mt: 1.5, color: 'inherit', maxWidth: 390 }}>A clearer day at the stable.</Typography>
            <Typography sx={{ mt: 2, color: 'inherit', opacity: 0.78, maxWidth: 420, lineHeight: 1.7 }}>
              Keep the roster close, make every handoff legible, and let the day&apos;s care speak for itself.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, p: { xs: 3, md: 6 } }}>
            <Typography variant="overline" color="secondary.main">Sign in</Typography>
            <Typography variant="h2" sx={{ mt: 1, mb: 1 }}>Welcome back.</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Use your stable workspace credentials to continue.</Typography>
            <Divider sx={{ mb: 3 }} />
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {error ? <Alert severity="error">{error}</Alert> : null}
                <TextField label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required fullWidth autoFocus />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  fullWidth
                  slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((current) => !current)} edge="end">{showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}</IconButton></InputAdornment> } }}
                />
                <Button type="submit" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />} disabled={isSubmitting} sx={{ mt: 1 }}>
                  {isSubmitting ? 'Signing in…' : 'Enter workspace'}
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Local workspace access · session persists in this browser
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  )
}