import Chip from '@mui/material/Chip'
import type { ActivityType, HorseStatus } from '../../types/stable'

export function StatusChip({ status }: { status: HorseStatus }) {
  const color =
    status === 'Medical Attention'
      ? 'error'
      : status === 'Training'
        ? 'primary'
        : status === 'Active'
          ? 'success'
          : status === 'Rest'
            ? 'warning'
            : 'default'

  return <Chip label={status} color={color} size="small" variant="outlined" />
}

export function ActivityTypeChip({ type }: { type: ActivityType }) {
  return (
    <Chip
      label={type}
      size="small"
      variant="filled"
      sx={{ backgroundColor: 'action.hover', color: 'text.secondary' }}
    />
  )
}