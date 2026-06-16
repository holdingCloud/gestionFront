import { useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { useSalesEvolution } from '../hooks/useSalesEvolution';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const formatVariation = (v: number | null | undefined) => {
    if (v == null) return 'Sin datos';
    return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
};

const periodLabel: Record<string, string> = { day: 'DD/MM', week: 'DD/MM', month: 'MMM YY' };

export const SalesEvolutionReport = () => {
    const {
        data, loading,
        startDate, setStartDate,
        endDate, setEndDate,
        period, setPeriod,
        fetchData,
    } = useSalesEvolution();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const xLabels = data?.series.map(s => dayjs(s.period).format(periodLabel[period])) ?? [];
    const amountData = data?.series.map(s => s.totalAmount) ?? [];
    const txData = data?.series.map(s => s.transactionCount) ?? [];

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

                {data?.summary && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="caption" color="text.secondary">Ventas totales</Typography>
                                <Typography variant="h6">{formatCLP(data.summary.currentTotal)}</Typography>
                                <Typography
                                    variant="caption"
                                    color={data.summary.variationAmount == null ? 'text.secondary' : data.summary.variationAmount >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {formatVariation(data.summary.variationAmount)} vs período anterior
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
                                <Typography variant="caption" color="text.secondary">Transacciones</Typography>
                                <Typography variant="h6">{data.summary.currentTxCount}</Typography>
                                <Typography
                                    variant="caption"
                                    color={data.summary.variationTx == null ? 'text.secondary' : data.summary.variationTx >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {formatVariation(data.summary.variationTx)} vs período anterior
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : data?.series.length ? (
                        <LineChart
                            height={400}
                            series={[
                                { data: amountData, label: 'Monto ($)', yAxisKey: 'leftAxisId' },
                                { data: txData, label: 'Transacciones', yAxisKey: 'rightAxisId' },
                            ]}
                            xAxis={[{
                                scaleType: 'point',
                                data: xLabels,
                                tickLabelStyle: { angle: -45, textAnchor: 'end', fontSize: 11 },
                            }]}
                            yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
                            rightAxis="rightAxisId"
                            margin={{ left: 90, right: 60, top: 70, bottom: 70 }}
                            grid={{ vertical: true, horizontal: true }}
                        />
                    ) : (
                        <Typography textAlign="center" color="text.secondary" py={6}>
                            Sin datos para el período seleccionado
                        </Typography>
                    )}
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};
