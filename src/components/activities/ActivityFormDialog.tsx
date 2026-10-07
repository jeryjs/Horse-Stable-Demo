import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import type { Activity, ActivityInput, Horse } from '../../types/stable'
import { activityTypes } from '../../types/stable'

interface ActivityFormDialogProps {
  open: boolean
  horses: Horse[]
  activity?: Activity
  initialHorseId?: string
  onClose: () => void
  onSubmit: (input: ActivityInput) => Promise<void>
}

function createInitialValues(horses: Horse[], initialHorseId?: string, activity?: Activity): ActivityInput {
  return {
    horseId: activity?.horseId ?? initialHorseId ?? horses[0]?.id ?? '',
    date: activity?.date ?? new Date().toISOString().slice(0, 10),
    type: activity?.type ?? 'Training',
    notes: activity?.notes ?? '',
    staffTrainer: activity?.staffTrainer ?? '',
  }
}

export function ActivityFormDialog({ open, horses, activity, initialHorseId, onClose, onSubmit }: ActivityFormDialogProps) {
  const [values, setValues] = useState<ActivityInput>(() => createInitialValues(horses, initialHorseId, activity))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) setValues(createInitialValues(horses, initialHorseId, activity))
  }, [activity, horses, initialHorseId, open])

  const update = <Key extends keyof ActivityInput>(key: Key, value: ActivityInput[Key]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{activity ? 'Edit stable activity' : 'Log a stable activity'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Horse" value={values.horseId} onChange={(event) => update('horseId', event.target.value)} select required fullWidth>
                {horses.map((horse) => <MenuItem key={horse.id} value={horse.id}>{horse.name} · {horse.stallNumber}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Activity date"
                value={dayjs(values.date)}
                onChange={(value) => value && update('date', value.format('YYYY-MM-DD'))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Activity type" value={values.type} onChange={(event) => update('type', event.target.value as ActivityInput['type'])} select required fullWidth>
                {activityTypes.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Staff / trainer" value={values.staffTrainer} onChange={(event) => update('staffTrainer', event.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Notes" value={values.notes} onChange={(event) => update('notes', event.target.value)} required fullWidth multiline minRows={4} placeholder="What should the next person on shift know?" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || !horses.length}>
            {isSubmitting ? 'Saving…' : activity ? 'Save changes' : 'Log activity'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}