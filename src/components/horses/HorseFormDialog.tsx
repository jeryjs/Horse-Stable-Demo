import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import type { Horse, HorseInput } from '../../types/stable'
import { horseStatuses } from '../../types/stable'

interface HorseFormDialogProps {
  open: boolean
  horse?: Horse
  onClose: () => void
  onSubmit: (input: HorseInput) => Promise<void>
}

function createInitialValues(horse?: Horse): HorseInput {
  return {
    name: horse?.name ?? '',
    breed: horse?.breed ?? '',
    gender: horse?.gender ?? 'Mare',
    dateOfBirth: horse?.dateOfBirth ?? new Date().toISOString().slice(0, 10),
    ownerName: horse?.ownerName ?? '',
    stallNumber: horse?.stallNumber ?? '',
    status: horse?.status ?? 'Active',
    photoDataUrl: horse?.photoDataUrl,
  }
}

export function HorseFormDialog({ open, horse, onClose, onSubmit }: HorseFormDialogProps) {
  const [values, setValues] = useState<HorseInput>(() => createInitialValues(horse))
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) setValues(createInitialValues(horse))
  }, [horse, open])

  const update = <Key extends keyof HorseInput>(key: Key, value: HorseInput[Key]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => update('photoDataUrl', String(reader.result))
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({ ...values, photoDataUrl: values.photoDataUrl || undefined })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{horse ? `Edit ${horse.name}` : 'Add a horse'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Horse name" value={values.name} onChange={(event) => update('name', event.target.value)} required fullWidth autoFocus />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Breed" value={values.breed} onChange={(event) => update('breed', event.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Gender" value={values.gender} onChange={(event) => update('gender', event.target.value as HorseInput['gender'])} select required fullWidth>
                <MenuItem value="Mare">Mare</MenuItem>
                <MenuItem value="Stallion">Stallion</MenuItem>
                <MenuItem value="Gelding">Gelding</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Date of birth" type="date" value={values.dateOfBirth} onChange={(event) => update('dateOfBirth', event.target.value)} required fullWidth slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField label="Stall number" value={values.stallNumber} onChange={(event) => update('stallNumber', event.target.value)} required fullWidth placeholder="A-01" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Owner name" value={values.ownerName} onChange={(event) => update('ownerName', event.target.value)} required fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Current status" value={values.status} onChange={(event) => update('status', event.target.value as HorseInput['status'])} select required fullWidth>
                {horseStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
                <Button component="label" variant="outlined" startIcon={<CloudUploadRoundedIcon />}>
                  {values.photoDataUrl ? 'Replace photo' : 'Upload photo'}
                  <input hidden accept="image/*" type="file" onChange={handlePhoto} />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Optional. Small images are stored locally for this workspace.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : horse ? 'Save changes' : 'Add horse'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}