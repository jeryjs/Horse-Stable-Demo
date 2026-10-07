import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = <AddRoundedIcon />,
}: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mb: 4, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-end' } }}
    >
      <Box>
        <Typography variant="overline" color="secondary.main">
          {eyebrow}
        </Typography>
        <Typography variant="h1" sx={{ mt: 0.5, mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 660 }}>
          {description}
        </Typography>
      </Box>
      {actionLabel && onAction ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={actionIcon}
          onClick={onAction}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  )
}