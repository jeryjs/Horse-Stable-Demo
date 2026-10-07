import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { StableInsight } from '../../hooks/useStableIntelligence'

export function StableIntelligenceCard({ insight }: { insight: StableInsight }) {
  const isUrgent = insight.severity === 'urgent'
  const isAttention = insight.severity === 'attention'
  const icon = isUrgent ? <ErrorRoundedIcon /> : isAttention ? <LightbulbRoundedIcon /> : <CheckCircleRoundedIcon />
  const color = isUrgent ? 'error' : isAttention ? 'warning' : 'success'

  return (
    <Card
      sx={{
        height: '100%',
        background: isUrgent
          ? 'linear-gradient(140deg, rgba(189, 85, 76, 0.14), transparent 70%)'
          : isAttention
            ? 'linear-gradient(140deg, rgba(195, 111, 69, 0.14), transparent 70%)'
            : 'linear-gradient(140deg, rgba(76, 135, 101, 0.14), transparent 70%)',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ color: `${color}.main`, display: 'flex', mt: 0.25 }}>{icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="overline" color="text.secondary">
                Stable intelligence
              </Typography>
              <Chip label="Local insight" size="small" variant="outlined" sx={{ fontSize: 10 }} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 0.5 }}>
              {insight.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
              {insight.summary}
            </Typography>
            <Alert
              icon={<AutoAwesomeRoundedIcon fontSize="small" />}
              severity={color}
              sx={{ mt: 2, alignItems: 'center', '& .MuiAlert-message': { py: 0.25 } }}
            >
              <Typography variant="body2" sx={{ fontWeight: 750 }}>
                {insight.recommendedAction}
              </Typography>
            </Alert>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}