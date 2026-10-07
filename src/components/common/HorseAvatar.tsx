import Avatar from '@mui/material/Avatar'
import type { Horse } from '../../types/stable'
import { initials } from '../../utils/format'

export function HorseAvatar({ horse, size = 52 }: { horse: Horse; size?: number }) {
  return (
    <Avatar
      src={horse.photoDataUrl}
      alt={`${horse.name} portrait`}
      sx={{
        width: size,
        height: size,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        fontWeight: 850,
        fontSize: size * 0.31,
        borderRadius: size > 70 ? '22px 22px 6px 22px' : '15px 15px 4px 15px',
      }}
    >
      {initials(horse.name)}
    </Avatar>
  )
}