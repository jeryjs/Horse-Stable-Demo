import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PetsRoundedIcon from '@mui/icons-material/PetsRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import { useThemeMode, type ThemeMode } from '../../hooks/useThemeMode'
import { useAuth } from '../../hooks/useAuth'

const drawerWidth = 264

const navigation = [
  { label: 'Overview', path: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Horses', path: '/horses', icon: PetsRoundedIcon },
  { label: 'Activity log', path: '/activities', icon: CalendarMonthRoundedIcon },
] as const

function Brand() {
  return (
    <Stack direction="row" spacing={1.25} sx={{ px: 2.5, py: 2.25, alignItems: 'center' }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '13px 13px 4px 13px',
          backgroundColor: 'secondary.main',
          color: 'secondary.contrastText',
        }}
      >
        <PetsRoundedIcon />
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 850, letterSpacing: '-0.04em', lineHeight: 1 }}>
          Equus
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          stable operations
        </Typography>
      </Box>
    </Stack>
  )
}

function ThemeModeMenu() {
  const { mode, setMode } = useThemeMode()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const modeItems: { value: ThemeMode; label: string; icon: typeof LightModeRoundedIcon }[] = [
    { value: 'light', label: 'Light', icon: LightModeRoundedIcon },
    { value: 'dark', label: 'Dark', icon: DarkModeRoundedIcon },
    { value: 'system', label: 'System', icon: SettingsBrightnessRoundedIcon },
  ]

  return (
    <>
      <Tooltip title="Change appearance">
        <IconButton
          aria-label="Change appearance"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          color="inherit"
        >
          {mode === 'dark' ? (
            <DarkModeRoundedIcon />
          ) : mode === 'light' ? (
            <LightModeRoundedIcon />
          ) : (
            <SettingsBrightnessRoundedIcon />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {modeItems.map(({ value, label, icon: Icon }) => (
          <MenuItem
            key={value}
            selected={mode === value}
            onClick={() => {
              setMode(value)
              setAnchorEl(null)
            }}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

function NavigationContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Brand />
      <Divider />
      <Typography variant="overline" color="text.secondary" sx={{ px: 2.5, pt: 3, pb: 1 }}>
        Command center
      </Typography>
      <List sx={{ px: 1.25 }}>
        {navigation.map(({ label, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            end={path === '/dashboard'}
            onClick={onNavigate}
            sx={{
              mb: 0.5,
              borderRadius: 3,
              color: 'text.secondary',
              '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 38 },
              '&.active': {
                color: 'primary.main',
                backgroundColor: 'action.selected',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontWeight: 750 }}>{label}</Typography>} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 4,
            backgroundColor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 800 }}>
            TODAY'S FOCUS
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 750 }}>
            Keep every hoofprint in the log.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Small notes make tomorrow's decisions easier.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export function AppShell() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const pageTitle = location.pathname.startsWith('/horses/')
    ? 'Horse profile'
    : navigation.find((item) => location.pathname.startsWith(item.path))?.label ?? 'Overview'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(18px)',
          backgroundColor: 'background.default',
          zIndex: (currentTheme) => currentTheme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 68, md: 76 } }}>
          {isMobile ? (
            <IconButton edge="start" aria-label="Open navigation" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuRoundedIcon />
            </IconButton>
          ) : null}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 750 }}>
              Equus / {pageTitle}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Tooltip title="No new notifications">
              <IconButton aria-label="Notifications">
                <NotificationsNoneRoundedIcon />
              </IconButton>
            </Tooltip>
            <ThemeModeMenu />
            <IconButton aria-label="Account menu" onClick={(event) => setAccountAnchor(event.currentTarget)}>
              <AccountCircleRoundedIcon />
            </IconButton>
            <Menu anchorEl={accountAnchor} open={Boolean(accountAnchor)} onClose={() => setAccountAnchor(null)}>
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem onClick={() => { void logout(); setAccountAnchor(null) }}>
                <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        aria-label="Main navigation"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            },
          }}
        >
          <NavigationContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar sx={{ minHeight: { xs: 68, md: 76 } }} />
        <Box sx={{ width: '100%', maxWidth: 1480, mx: 'auto', px: { xs: 2, sm: 3, lg: 5 }, py: { xs: 3, md: 5 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}