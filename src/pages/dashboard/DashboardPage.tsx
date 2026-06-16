import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';
import { UrlBreadCrumbs } from '../../components';
import { useDashboard } from './hooks/useDashboard';
import { DashboardKpiCards } from './components/DashboardKpiCards';

export const DashboardPage = () => {
    const { kpis, salesEvolution, loadingKpis, loadingEvolution } = useDashboard();

    const xLabels = salesEvolution?.series.map(s => dayjs(s.period).format('DD/MM')) ?? [];
    const amountData = salesEvolution?.series.map(s => s.totalAmount) ?? [];
    const monthLabel = dayjs().format('MMMM YYYY');

    return (
        <Grid sx={{ display: 'flex' }} container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} sx={{ marginBottom: -50 }}>
                <UrlBreadCrumbs />
            </Grid>

            <DashboardKpiCards kpis={kpis} loading={loadingKpis} />

            <Grid item xs={12}>
                <Typography variant="h5">
                    Evolución de ventas — {monthLabel}
                </Typography>
            </Grid>

            <Grid
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    minHeight: '420px',
                    padding: 4,
                    margin: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                item xs={12}
            >
                {loadingEvolution ? (
                    <CircularProgress />
                ) : salesEvolution?.series.length ? (
                    <Box sx={{ width: '100%' }}>
                        <LineChart
                            height={380}
                            series={[{ data: amountData, label: 'Ventas ($)' }]}
                            xAxis={[{
                                scaleType: 'point',
                                data: xLabels,
                                tickLabelStyle: { angle: -45, textAnchor: 'end', fontSize: 11 },
                            }]}
                            margin={{ left: 90, right: 40, top: 60, bottom: 70 }}
                            grid={{ vertical: true, horizontal: true }}
                        />
                    </Box>
                ) : (
                    <Typography color="text.secondary">
                        Sin ventas registradas este mes
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default DashboardPage;
