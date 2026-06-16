import { useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';
import { useAvgFrequency } from '../hooks/useAvgFrequency';
import { CompanySelect } from './CompanySelect';

export const AvgFrequencyReport = () => {
    const {
        data, loading,
        startDate, setStartDate,
        endDate, setEndDate,
        companyId, setCompanyId,
        fetchData,
    } = useAvgFrequency();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ranges = data?.histogram.map(h => h.range) ?? [];
    const counts = data?.histogram.map(h => h.clientCount) ?? [];

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
                        <CompanySelect value={companyId} onChange={setCompanyId} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Button variant="contained" onClick={fetchData} disabled={loading} fullWidth>
                            Aplicar
                        </Button>
                    </Grid>
                </Grid>

                {data?.globalAvg !== undefined && (
                    <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3, display: 'inline-block' }}>
                        <Typography variant="caption" color="text.secondary">Frecuencia promedio global</Typography>
                        <Typography variant="h5">{data.globalAvg.toFixed(1)} días</Typography>
                    </Paper>
                )}

                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : data?.histogram.length ? (
                        <>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>Distribución de clientes por frecuencia de compra</Typography>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: ranges,
                                    tickLabelStyle: { angle: -30, textAnchor: 'end', fontSize: 11 },
                                }]}
                                series={[{ data: counts, label: 'Cantidad de clientes' }]}
                                height={340}
                                margin={{ left: 60, right: 20, top: 60, bottom: 80 }}
                            />
                        </>
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
