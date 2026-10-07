import AddRoundedIcon from '@mui/icons-material/AddRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivityFormDialog } from '../components/activities/ActivityFormDialog'
import { ActivityTypeChip } from '../components/common/StatusChip'
import { PageHeader } from '../components/common/PageHeader'
import { useStableData } from '../hooks/useStableData'
import { activityTypes, type Activity, type ActivityType } from '../types/stable'
import { formatDate } from '../utils/format'

interface ActivityRow extends Activity {
  horseName: string
  stallNumber: string
}

export function ActivitiesPage() {
  const navigate = useNavigate()
  const { activities, horses, addActivity } = useStableData()
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ActivityType | 'All'>('All')
  const [horseId, setHorseId] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const horseMap = useMemo(() => new Map(horses.map((horse) => [horse.id, horse])), [horses])
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return activities
      .map((activity): ActivityRow | null => {
        const horse = horseMap.get(activity.horseId)
        return horse ? { ...activity, horseName: horse.name, stallNumber: horse.stallNumber } : null
      })
      .filter((row): row is ActivityRow => Boolean(row))
      .filter((row) => {
        const matchesSearch = !query || row.horseName.toLowerCase().includes(query) || row.notes.toLowerCase().includes(query) || row.staffTrainer.toLowerCase().includes(query)
        const matchesType = type === 'All' || row.type === type
        const matchesHorse = horseId === 'All' || row.horseId === horseId
        return matchesSearch && matchesType && matchesHorse
      })
      .sort((first, second) => second.date.localeCompare(first.date))
  }, [activities, horseMap, horseId, search, type])

  const columns: GridColDef<ActivityRow>[] = [
    { field: 'date', headerName: 'Date', flex: 0.8, minWidth: 130, renderCell: (params) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatDate(params.row.date)}</Typography> },
    { field: 'horseName', headerName: 'Horse', flex: 1, minWidth: 150, renderCell: (params) => <Box><Typography variant="body2" sx={{ fontWeight: 800 }}>{params.row.horseName}</Typography><Typography variant="caption" color="text.secondary">{params.row.horseId}</Typography></Box> },
    { field: 'type', headerName: 'Type', flex: 0.9, minWidth: 130, renderCell: (params) => <ActivityTypeChip type={params.row.type} /> },
    { field: 'notes', headerName: 'Notes', flex: 1.8, minWidth: 250 },
    { field: 'staffTrainer', headerName: 'Staff / trainer', flex: 1, minWidth: 160 },
    { field: 'open', headerName: '', width: 54, sortable: false, filterable: false, renderCell: () => <ArrowForwardRoundedIcon color="disabled" fontSize="small" /> },
  ]

  return (
    <>
      <PageHeader eyebrow="Operations / Activity log" title="The yard, in sequence." description="Log the work that happened, keep handoffs clear, and jump back to a horse whenever a note needs more context." actionLabel="Log activity" actionIcon={<AddRoundedIcon />} onAction={() => setIsFormOpen(true)} />
      <Card sx={{ p: { xs: 1.5, md: 2 }, overflow: 'hidden' }}>
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 5 }}><TextField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notes, staff, or horse" fullWidth slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="disabled" /></InputAdornment> } }} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3.5 }}><TextField value={horseId} onChange={(event) => setHorseId(event.target.value)} select fullWidth label="Horse"><MenuItem value="All">All horses</MenuItem>{horses.map((horse) => <MenuItem key={horse.id} value={horse.id}>{horse.name}</MenuItem>)}</TextField></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3.5 }}><TextField value={type} onChange={(event) => setType(event.target.value as ActivityType | 'All')} select fullWidth label="Activity type"><MenuItem value="All">All types</MenuItem>{activityTypes.map((activityType) => <MenuItem key={activityType} value={activityType}>{activityType}</MenuItem>)}</TextField></Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1, pb: 1 }}>{rows.length} activity records</Typography>
        <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick onRowClick={(params) => navigate(`/horses/${params.row.horseId}`)} pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} localeText={{ noRowsLabel: 'No activities match those filters.' }} sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { borderRadius: 2, backgroundColor: 'action.hover' }, '& .MuiDataGrid-row': { cursor: 'pointer' }, '& .MuiDataGrid-cell:focus': { outline: 'none' } }} />
      </Card>
      <ActivityFormDialog open={isFormOpen} horses={horses} onClose={() => setIsFormOpen(false)} onSubmit={async (input) => { await addActivity(input) }} />
    </>
  )
}