import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'

interface MetricCardProps {
  label: string
  value: number
  detail: string
  icon: SvgIconComponent
  tone: 'green' | 'orange' | 'red' | 'blue'
}

const toneMap = {
  green: { background: 'rgba(76, 135, 101, 0.13)', color: 'success.main' },
  orange: { background: 'rgba(195, 111, 69, 0.14)', color: 'secondary.main' },
  red: { background: 'rgba(189, 85, 76, 0.14)', color: 'error.main' },
  blue: { background: 'rgba(75, 119, 151, 0.14)', color: '#4b7797' },
} as const

export function MetricCard({ label, value, detail, icon: Icon, tone }: MetricCardProps) {
  const colors = toneMap[tone]

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              {label}
            </Typography>
            <Typography variant="h2" sx={{ mt: 1.5, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {detail}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 42,
              height: 42,
              borderRadius: '13px 13px 4px 13px',
              backgroundColor: colors.background,
              color: colors.color,
            }}
          >
            <Icon fontSize="small" />
          </Box>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ mt: 2, alignItems: 'center' }}>
          <ArrowOutwardRoundedIcon sx={{ fontSize: 14, color: colors.color }} />
          <Typography variant="caption" color={colors.color} sx={{ fontWeight: 700 }}>
            Live from stable records
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}