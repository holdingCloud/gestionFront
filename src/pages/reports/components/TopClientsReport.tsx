import { useEffect } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DataTable } from '../../../components';
import { useTopClients } from '../hooks/useTopClients';
import { CompanySelect } from './CompanySelect';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const rankColor: Record<number, 'warning' | 'default'> = { 1: 'warning', 2: 'default', 3: 'default' };
const rankLabel: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const cellSx = { px: 1, py: 0.75 };

export const TopClientsReport = () => {
    const {
        data, loading,
        startDate, setStartDate,
        endDate, setEndDate,
        limit, setLimit,
        companyId, setCompanyId,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    } = useTopClients();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const paginated = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                        <DatePicker
                            label="Desde"
                            value={startDate ? dayjs(startDate) : null}
                            onChange={val => { if (val?.isValid()) setStartDate(val.format('YYYY-MM-DD')); }}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <DatePicker
                            label="Hasta"
                            value={endDate ? dayjs(endDate) : null}
                            onChange={val => { if (val?.isValid()) setEndDate(val.format('YYYY-MM-DD')); }}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Top N</InputLabel>
                            <Select
                                value={String(limit)}
                                onChange={(e: SelectChangeEvent) => setLimit(Number(e.target.value))}
                                label="Top N"
                            >
                                <MenuItem value="5">Top 5</MenuItem>
                                <MenuItem value="10">Top 10</MenuItem>
                                <MenuItem value="20">Top 20</MenuItem>
                                <MenuItem value="50">Top 50</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <CompanySelect value={companyId} onChange={setCompanyId} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Button variant="contained" onClick={fetchData} disabled={loading} fullWidth>
                            Aplicar
                        </Button>
                    </Grid>
                </Grid>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid
                        sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, margin: 0, padding: 2 }}
                        item xs={12}
                    >
                        <DataTable
                            count={data.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={cellSx} align="center">#</TableCell>
                                    <TableCell sx={cellSx}>Cliente</TableCell>
                                    <TableCell sx={cellSx}>Comuna</TableCell>
                                    <TableCell sx={cellSx} align="right">Compras</TableCell>
                                    <TableCell sx={cellSx} align="right">Frec. prom. (días)</TableCell>
                                    <TableCell sx={cellSx} align="right">Monto total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.length > 0 ? paginated.map(row => (
                                    <TableRow key={row.clientId}>
                                        <TableCell sx={cellSx} align="center">
                                            {row.rank <= 3 ? (
                                                <Typography variant="body2">{rankLabel[row.rank]}</Typography>
                                            ) : (
                                                <Chip label={row.rank} size="small" color={rankColor[row.rank] ?? 'default'} />
                                            )}
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{row.clientName}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2">{row.communeName}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx} align="right">{row.purchaseCount}</TableCell>
                                        <TableCell sx={cellSx} align="right">{row.avgDaysBetweenPurchases}</TableCell>
                                        <TableCell sx={cellSx} align="right">{formatCLP(row.totalAmount)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                                            Sin datos para el período seleccionado
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </DataTable>
                    </Grid>
                )}
            </Box>
        </LocalizationProvider>
    );
};
