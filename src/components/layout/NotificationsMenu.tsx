import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { formatDateTime } from '../../utils/format'
import { useStableNotifications } from '../../hooks/useStableNotifications'

export function NotificationsMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const {
    notifications,
    unreadCount,
    isRead,
    markAllRead,
    openNotification,
  } = useStableNotifications()
  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title={unreadCount ? `${unreadCount} unread notifications` : 'Notifications'}>
        <IconButton
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            {unreadCount ? <NotificationsActiveRoundedIcon /> : <NotificationsNoneRoundedIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: { xs: 'calc(100vw - 24px)', sm: 390 }, maxWidth: 390, mt: 1.25, borderRadius: '16px', overflow: 'hidden' } } }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.25, py: 1.75 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Stable updates</Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount ? `${unreadCount} need a look` : 'You are all caught up'}
            </Typography>
          </Box>
          <Button size="small" disabled={!unreadCount} onClick={() => void markAllRead()}>
            Mark all read
          </Button>
        </Stack>
        <Divider />
        {notifications.length ? (
          <List disablePadding sx={{ maxHeight: 440, overflowY: 'auto' }}>
            {notifications.map((notification, index) => {
              const read = isRead(notification.id)
              const Icon = notification.tone === 'urgent'
                ? LocalHospitalRoundedIcon
                : notification.tone === 'attention'
                  ? WarningAmberRoundedIcon
                  : NotificationsNoneRoundedIcon
              const tone = notification.tone === 'urgent'
                ? 'error.main'
                : notification.tone === 'attention'
                  ? 'warning.main'
                  : 'primary.main'

              return (
                <Box key={notification.id}>
                  <ListItemButton
                    onClick={() => void openNotification(notification)}
                    sx={{ alignItems: 'flex-start', gap: 1.5, px: 2.25, py: 1.75, bgcolor: read ? 'transparent' : 'action.hover' }}
                  >
                    <Box sx={{ color: tone, mt: 0.25, display: 'grid', placeItems: 'center' }}>
                      <Icon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: read ? 650 : 800 }}>
                          {notification.title}
                        </Typography>
                        {!read && <Box aria-label="Unread" sx={{ width: 7, height: 7, flexShrink: 0, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, lineHeight: 1.45 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.75 }}>
                        {formatDateTime(notification.createdAt)}
                      </Typography>
                    </Box>
                  </ListItemButton>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </Box>
              )
            })}
          </List>
        ) : (
          <Stack spacing={1} sx={{ alignItems: 'center', px: 3, py: 5, textAlign: 'center' }}>
            <NotificationsNoneRoundedIcon color="disabled" />
            <Typography variant="body2" sx={{ fontWeight: 750 }}>Nothing new at the stable</Typography>
            <Typography variant="caption" color="text.secondary">
              New care alerts and today&apos;s activity notes will appear here.
            </Typography>
          </Stack>
        )}
        <Divider />
        <Button
          fullWidth
          onClick={() => setAnchorEl(null)}
          sx={{ py: 1.25, borderRadius: 0, textTransform: 'none', fontWeight: 750 }}
        >
          Close updates
        </Button>
      </Popover>
    </>
  )
}
