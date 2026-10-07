import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import PetsRoundedIcon from '@mui/icons-material/PetsRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { MetricCard } from '../components/common/MetricCard'
import { HorseAvatar } from '../components/common/HorseAvatar'
import { ActivityTypeChip } from '../components/common/StatusChip'
import { PageHeader } from '../components/common/PageHeader'
import { StableIntelligenceCard } from '../components/common/StableIntelligenceCard'
import { useStableData } from '../hooks/useStableData'
import { useStableIntelligence } from '../hooks/useStableIntelligence'
import { useAuth } from '../hooks/useAuth'
import { horseStatuses } from '../types/stable'
import { isToday } from '../utils/format'

export function DashboardPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { horses, activities } = useStableData()
  const { user } = useAuth()
  const { attentionInsights, insights } = useStableIntelligence()
  const todayActivities = activities
    .filter((activity) => isToday(activity.date))
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
  const veterinaryCutoff = new Date()
  veterinaryCutoff.setHours(0, 0, 0, 0)
  veterinaryCutoff.setDate(veterinaryCutoff.getDate() - 14)
  const horsesWithRecentVetActivity = new Set(
    activities
      .filter(
        (activity) =>
          activity.type === 'Veterinary' &&
          new Date(`${activity.date}T12:00:00`) >= veterinaryCutoff,
      )
      .map((activity) => activity.horseId),
  )
  const horsesRequiringAttention = horses.filter(
    (horse) =>
      horse.status === 'Medical Attention' ||
      !horsesWithRecentVetActivity.has(horse.id),
  ).length
  const statusData = horseStatuses.map((status) => ({
    label: status === 'Medical Attention' ? 'Medical' : status,
    count: horses.filter((horse) => horse.status === status).length,
  }))
  const horseById = new Map(horses.map((horse) => [horse.id, horse]))
  const featuredInsight = attentionInsights[0] ?? insights[0]
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <>
      <PageHeader
        eyebrow={todayLabel}
        title={`Good morning, ${user?.displayName ?? 'stable team'}.`}
        description="A clear view of every horse, every handoff, and the small signals that keep the yard moving well."
        actionLabel="Log activity"
        actionIcon={<CalendarMonthRoundedIcon />}
        onAction={() => navigate('/activities')}
      />

      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          background: `linear-gradient(115deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 68%, ${theme.palette.secondary.main} 160%)`,
          color: 'primary.contrastText',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 }, '&:last-child': { pb: { xs: 2.5, md: 4 } } }}>
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="overline" sx={{ color: 'inherit', opacity: 0.72 }}>
                Stable pulse
              </Typography>
              <Typography variant="h2" sx={{ mt: 0.75, color: 'inherit', maxWidth: 600 }}>
                Calm records create confident care.
              </Typography>
              <Typography sx={{ mt: 1.5, maxWidth: 560, color: 'inherit', opacity: 0.78 }}>
                {todayActivities.length
                  ? `${todayActivities.length} activities are already logged today. Keep the rhythm going.`
                  : 'No activities are logged today yet. Start the day with a quick stable note.'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={1.5} sx={{ justifySelf: 'flex-end', alignItems: { md: 'flex-end' } }}>
                <Button component={RouterLink} to="/horses" variant="contained" color="secondary" endIcon={<ChevronRightRoundedIcon />}>
                  Browse horses
                </Button>
                <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.7, alignSelf: 'center' }}>
                  {horses.length} horses on the roster
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Total horses" value={horses.length} detail="Across every stable row" icon={PetsRoundedIcon} tone="blue" /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Active horses" value={horses.filter((horse) => horse.status === 'Active').length} detail="Ready for the daily rhythm" icon={CheckCircleOutlineRoundedIcon} tone="green" /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="In training" value={horses.filter((horse) => horse.status === 'Training').length} detail="Currently in a work block" icon={GroupsRoundedIcon} tone="orange" /></Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}><MetricCard label="Need attention" value={horsesRequiringAttention} detail="Medical status or no vet activity in 14 days" icon={WarningAmberRoundedIcon} tone="red" /></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Today in the yard"
              subheader="The latest handoffs from the stable floor"
              action={<Button component={RouterLink} to="/activities" size="small" endIcon={<ChevronRightRoundedIcon />}>View log</Button>}
              titleTypographyProps={{ variant: 'h3' }}
            />
            <Divider />
            <List disablePadding>
              {todayActivities.length ? todayActivities.slice(0, 5).map((activity) => {
                const horse = horseById.get(activity.horseId)
                if (!horse) return null
                return (
                  <ListItem key={activity.id} sx={{ px: 3, py: 1.75 }}>
                    <ListItemAvatar><HorseAvatar horse={horse} size={42} /></ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 750 }}>{horse.name}</Typography>}
                      secondary={<Typography variant="body2" color="text.secondary" noWrap>{activity.notes}</Typography>}
                    />
                    <Stack spacing={0.75} sx={{ ml: 2, alignItems: 'flex-end' }}>
                      <ActivityTypeChip type={activity.type} />
                      <Typography variant="caption" color="text.secondary">{activity.staffTrainer}</Typography>
                    </Stack>
                  </ListItem>
                )
              }) : (
                <Stack spacing={1} sx={{ py: 6, px: 3, textAlign: 'center', alignItems: 'center' }}>
                  <AccessTimeRoundedIcon color="disabled" />
                  <Typography sx={{ fontWeight: 750 }}>The log is waiting for its first note.</Typography>
                  <Typography variant="body2" color="text.secondary">Capture a feed, groom, ride, or care update to begin.</Typography>
                </Stack>
              )}
            </List>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Stable mix" subheader="How the roster is feeling today" titleTypographyProps={{ variant: 'h3' }} />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
              <BarChart
                series={[{ data: statusData.map((item) => item.count), label: 'Horses', color: theme.palette.secondary.main }]} 
                xAxis={[{ scaleType: 'band', data: statusData.map((item) => item.label) }]}
                yAxis={[{ min: 0, tickMinStep: 1 }]}
                height={250}
                borderRadius={7}
                margin={{ top: 14, right: 12, bottom: 36, left: 32 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          {featuredInsight ? <StableIntelligenceCard insight={featuredInsight} /> : null}
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardHeader title="Attention queue" subheader="A quick read of what deserves another look" titleTypographyProps={{ variant: 'h3' }} />
            <Divider />
            <List disablePadding>
              {attentionInsights.length ? attentionInsights.slice(0, 4).map((insight) => {
                const horse = horseById.get(insight.horseId)
                if (!horse) return null
                return (
                  <ListItem key={insight.horseId} sx={{ px: 3, py: 1.5, cursor: 'pointer' }} onClick={() => navigate(`/horses/${horse.id}`)}>
                    <ListItemAvatar><HorseAvatar horse={horse} size={40} /></ListItemAvatar>
                    <ListItemText primary={<Typography sx={{ fontWeight: 750 }}>{horse.name} · {insight.title}</Typography>} secondary={<Typography variant="body2" color="text.secondary">{insight.recommendedAction}</Typography>} />
                    <ChevronRightRoundedIcon color="disabled" />
                  </ListItem>
                )
              }) : (
                <Stack direction="row" spacing={1} sx={{ px: 3, py: 4, alignItems: 'center' }}>
                  <CheckCircleOutlineRoundedIcon color="success" />
                  <Typography variant="body2" color="text.secondary">No active attention signals. Nice work.</Typography>
                </Stack>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}