import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActivityFormDialog } from '../components/activities/ActivityFormDialog'
import { HorseAvatar } from '../components/common/HorseAvatar'
import { HorseTimeline } from '../components/common/HorseTimeline'
import { PageHeader } from '../components/common/PageHeader'
import { StableIntelligenceCard } from '../components/common/StableIntelligenceCard'
import { StatusChip } from '../components/common/StatusChip'
import { HorseFormDialog } from '../components/horses/HorseFormDialog'
import { useStableData } from '../hooks/useStableData'
import { useStableIntelligence } from '../hooks/useStableIntelligence'
import { calculateAge, formatDate } from '../utils/format'
import { NotFoundPage } from './NotFoundPage'

function Fact({ icon: Icon, label, value }: { icon: typeof PlaceRoundedIcon; label: string; value: string }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 2, backgroundColor: 'action.hover', color: 'secondary.main' }}><Icon fontSize="small" /></Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 750 }}>{value}</Typography>
      </Box>
    </Stack>
  )
}

export function HorseProfilePage() {
  const { horseId } = useParams()
  const navigate = useNavigate()
  const { getHorse, getActivitiesForHorse, updateHorse, addActivity } = useStableData()
  const { getInsight } = useStableIntelligence()
  const horse = getHorse(horseId ?? '')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const activities = useMemo(() => getActivitiesForHorse(horse?.id ?? ''), [getActivitiesForHorse, horse?.id])

  if (!horse) return <NotFoundPage />

  const insight = getInsight(horse.id)
  if (!insight) return <NotFoundPage />

  return (
    <>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/horses')} color="inherit" sx={{ mb: 2 }}>Back to horses</Button>
      <PageHeader eyebrow={`Profile / ${horse.id}`} title={horse.name} description={`${horse.breed} · ${horse.gender} · ${calculateAge(horse.dateOfBirth)} years old`} actionLabel="Log activity" actionIcon={<EventAvailableRoundedIcon />} onAction={() => setIsActivityOpen(true)} />

      <Card sx={{ mb: 2.5, overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 }, '&:last-child': { pb: { xs: 2.5, md: 3.5 } } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={2.25} sx={{ alignItems: 'center' }}>
              <HorseAvatar horse={horse} size={94} />
              <Box>
                <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="h2">{horse.name}</Typography>
                  <StatusChip status={horse.status} />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>{horse.id} · {horse.breed}</Typography>
                <Button startIcon={<EditRoundedIcon />} onClick={() => setIsEditOpen(true)} size="small" sx={{ mt: 1.5, px: 0 }}>Edit profile</Button>
              </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={2} sx={{ minWidth: { md: 260 } }}>
              <Fact icon={PlaceRoundedIcon} label="Stall" value={horse.stallNumber} />
              <Fact icon={PersonRoundedIcon} label="Owner" value={horse.ownerName} />
              <Fact icon={EventAvailableRoundedIcon} label="Born" value={formatDate(horse.dateOfBirth)} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 5 }}><StableIntelligenceCard insight={insight} /></Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
              <Typography variant="overline" color="secondary.main">History</Typography>
              <Typography variant="h3" sx={{ mt: 0.5, mb: 0.5 }}>Activity timeline</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Every note connected to {horse.name}, newest first.</Typography>
              <Divider sx={{ mb: 2.5 }} />
              <HorseTimeline activities={activities} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <HorseFormDialog open={isEditOpen} horse={horse} onClose={() => setIsEditOpen(false)} onSubmit={async (input) => { await updateHorse(horse.id, input); setToast('Horse profile updated.') }} />
      <ActivityFormDialog open={isActivityOpen} horses={[horse]} initialHorseId={horse.id} onClose={() => setIsActivityOpen(false)} onSubmit={async (input) => { await addActivity(input); setToast('Activity added to the timeline.') }} />
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)}><Alert severity="success" onClose={() => setToast(null)}>{toast}</Alert></Snackbar>
    </>
  )
}