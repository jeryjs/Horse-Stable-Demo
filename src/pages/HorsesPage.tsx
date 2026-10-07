import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HorseFormDialog } from '../components/horses/HorseFormDialog'
import { HorseAvatar } from '../components/common/HorseAvatar'
import { PageHeader } from '../components/common/PageHeader'
import { StatusChip } from '../components/common/StatusChip'
import { useStableData } from '../hooks/useStableData'
import { horseStatuses, type Horse, type HorseStatus } from '../types/stable'
import { calculateAge } from '../utils/format'

export function HorsesPage() {
  const navigate = useNavigate()
  const { horses, addHorse } = useStableData()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<HorseStatus | 'All'>('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const filteredHorses = useMemo(() => {
    const query = search.trim().toLowerCase()
    return horses.filter((horse) => {
      const matchesSearch = !query || horse.name.toLowerCase().includes(query) || horse.id.toLowerCase().includes(query)
      const matchesStatus = status === 'All' || horse.status === status
      return matchesSearch && matchesStatus
    })
  }, [horses, search, status])

  const columns: GridColDef<Horse>[] = [
    {
      field: 'name',
      headerName: 'Horse',
      flex: 1.35,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <HorseAvatar horse={params.row} size={38} />
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Typography variant="body2" sx={{ fontWeight: 800, mr: 1 }}>{params.row.name}</Typography>
            <Typography variant="caption" color="text.secondary">({params.row.id})</Typography>
          </Box>
        </Stack>
      ),
    },
    { field: 'breed', headerName: 'Breed', flex: 0.9, minWidth: 130 },
    { field: 'gender', headerName: 'Gender', flex: 0.75, minWidth: 105 },
    { field: 'stallNumber', headerName: 'Stall', flex: 0.55, minWidth: 80 },
    { field: 'ownerName', headerName: 'Owner', flex: 1, minWidth: 160 },
    { field: 'age', headerName: 'Age', flex: 0.5, minWidth: 76, valueGetter: (_value, row) => `${calculateAge(row.dateOfBirth)} yrs` },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 160, renderCell: (params) => <StatusChip status={params.row.status} /> },
    {
      field: 'open',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 54,
      renderCell: () => <ArrowForwardRoundedIcon color="disabled" fontSize="small" />,
    },
  ]

  return (
    <>
      <PageHeader eyebrow="Roster / Horses" title="Know every horse by name." description="A living roster for the yard team. Search by name or ID, filter by status, and open any record for the full story." actionLabel="Add horse" actionIcon={<AddRoundedIcon />} onAction={() => setIsFormOpen(true)} />
      <Card sx={{ p: { xs: 1.5, md: 2 }, overflow: 'hidden' }}>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by horse name or ID" fullWidth slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="disabled" /></InputAdornment> } }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField value={status} onChange={(event) => setStatus(event.target.value as HorseStatus | 'All')} select fullWidth label="Filter by status">
              <MenuItem value="All">All statuses</MenuItem>
              {horseStatuses.map((horseStatus) => <MenuItem key={horseStatus} value={horseStatus}>{horseStatus}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1, pb: 1 }}>
          Showing {filteredHorses.length} of {horses.length} horses
        </Typography>
        <DataGrid
          rows={filteredHorses}
          columns={columns}
          rowHeight={64}
          autoHeight
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/horses/${params.row.id}`)}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          localeText={{ noRowsLabel: 'No horses match that search.' }}
          sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { borderRadius: 2, backgroundColor: 'action.hover' }, '& .MuiDataGrid-row': { cursor: 'pointer' }, '& .MuiDataGrid-cell:focus': { outline: 'none' } }}
        />
      </Card>
      <HorseFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (input) => { await addHorse(input); setToast('Horse added to the roster.') }}
      />
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)}>
        <Alert severity="success" onClose={() => setToast(null)}>{toast}</Alert>
      </Snackbar>
    </>
  )
}