import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Stack spacing={2} sx={{ py: 8, alignItems: 'flex-start' }}>
      <Typography variant="overline" color="secondary.main">404 / Quiet aisle</Typography>
      <Typography variant="h1">That record wandered off.</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
        The page you requested does not belong to the current stable roster. Head back to the overview and pick up from there.
      </Typography>
      <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/dashboard')}>
        Back to overview
      </Button>
    </Stack>
  )
}