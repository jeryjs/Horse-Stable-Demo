import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ActivityTypeChip } from './StatusChip'
import type { Activity } from '../../types/stable'
import { formatDate } from '../../utils/format'

export function HorseTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) {
    return (
      <Stack spacing={1} sx={{ py: 5, textAlign: 'center', alignItems: 'center' }}>
        <AccessTimeRoundedIcon color="disabled" />
        <Typography sx={{ fontWeight: 750 }}>No activity logged yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Add the first note to start this horse&apos;s stable story.
        </Typography>
      </Stack>
    )
  }

  return (
    <List disablePadding>
      {activities.map((activity, index) => (
        <ListItem key={activity.id} disableGutters sx={{ alignItems: 'stretch', py: 0 }}>
          <Box sx={{ width: 28, position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {index < activities.length - 1 ? (
              <Box sx={{ position: 'absolute', top: 20, bottom: -8, width: 1, backgroundColor: 'divider' }} />
            ) : null}
            <Box sx={{ position: 'relative', mt: 1.25, width: 10, height: 10, borderRadius: '50%', backgroundColor: 'secondary.main', boxShadow: '0 0 0 4px', color: 'background.paper' }} />
          </Box>
          <Box sx={{ flex: 1, pb: 3, pl: 1.5 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0.75, sm: 1.5 }} sx={{ alignItems: { sm: 'center' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 750 }}>
                {formatDate(activity.date)}
              </Typography>
              <ActivityTypeChip type={activity.type} />
            </Stack>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 700 }}>
              {activity.notes}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              Logged by {activity.staffTrainer}
            </Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  )
}