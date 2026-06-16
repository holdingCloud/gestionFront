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
    Paper,
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
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import { DataTable } from '../../../components';
import { useSalesByProduct } from '../hooks/useSalesByProduct';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const cellSx = { px: 1, py: 0.75 };

export const SalesByProductReport = () => {
    const {
        data, loading,
        startDate, setStartDate,
        endDate, setEndDate,
        period, setPeriod,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    } = useSalesByProduct();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const products = data?.byProduct ?? [];
    const chartNames = products.slice(0, 10).map(p => p.productName);
    const chartTotals = products.slice(0, 10).map(p => p.total);
    const chartFinalized = products.slice(0, 10).map(p => p.finalized);
    const paginated = products.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                            <InputLabel>Período</InputLabel>
                            <Select
                                value={period}
                                onChange={(e: SelectChangeEvent) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
                                label="Período"
                            >
                                <MenuItem value="day">Día</MenuItem>
                                <MenuItem value="week">Semana</MenuItem>
                                <MenuItem value="month">Mes</MenuItem>
                            </Select>
                        </FormControl>
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
                ) : products.length > 0 ? (
                    <>
                        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Top 10 productos</Typography>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: chartNames,
                                    tickLabelStyle: { angle: -45, textAnchor: 'end', fontSize: 11 },
                                }]}
                                series={[
                                    { data: chartTotals, label: 'Total pedidos' },
                                    { data: chartFinalized, label: 'Finalizados' },
                                ]}
                                height={340}
                                margin={{ left: 50, right: 20, top: 70, bottom: 110 }}
                            />
                        </Paper>

                        <Grid
                            sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, margin: 0, padding: 2 }}
                            item xs={12}
                        >
                            <DataTable
                                count={products.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={cellSx}>Producto</TableCell>
                                        <TableCell sx={cellSx}>Código</TableCell>
                                        <TableCell sx={cellSx} align="right">Total</TableCell>
                                        <TableCell sx={cellSx} align="right">Finalizados</TableCell>
                                        <TableCell sx={cellSx} align="right">Cancelados</TableCell>
                                        <TableCell sx={cellSx} align="right">Pendientes</TableCell>
                                        <TableCell sx={cellSx} align="right">% Cancelación</TableCell>
                                        <TableCell sx={cellSx} align="right">Monto total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginated.map(row => (
                                        <TableRow key={row.productId}>
                                            <TableCell sx={cellSx}>
                                                <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>{row.productName}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx}>
                                                <Typography variant="body2">{row.productCode}</Typography>
                                            </TableCell>
                                            <TableCell sx={cellSx} align="right">{row.total}</TableCell>
                                            <TableCell sx={cellSx} align="right">{row.finalized}</TableCell>
                                            <TableCell sx={cellSx} align="right">{row.canceled}</TableCell>
                                            <TableCell sx={cellSx} align="right">{row.pending}</TableCell>
                                            <TableCell sx={cellSx} align="right">
                                                <Chip
                                                    label={`${row.cancelRate.toFixed(1)}%`}
                                                    color={row.cancelRate > 20 ? 'error' : row.cancelRate > 10 ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell sx={cellSx} align="right">{formatCLP(row.totalAmount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </DataTable>
                        </Grid>
                    </>
                ) : (
                    <Typography textAlign="center" color="text.secondary" py={6}>
                        Sin datos para el período seleccionado
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
};
