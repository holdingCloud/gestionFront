import { Box, Grid, Paper, Skeleton, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { DailyKpisResponse } from '../../../interfaces/report.interface';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

interface KpiCardProps {
    title: string;
    value: string;
    vs: number;
    icon: React.ReactNode;
    invertVariation?: boolean;
}

const KpiCard = ({ title, value, vs, icon, invertVariation = false }: KpiCardProps) => {
    const isPositive = invertVariation ? vs < 0 : vs > 0;
    const isNeutral = vs === 0;
    const color = isNeutral ? 'text.secondary' : isPositive ? 'success.main' : 'error.main';

    return (
        <Paper sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 5, p: 2, borderRadius: 3, boxShadow: 10 }}>
            <Box sx={{ flexGrow: 1, display: 'grid', gap: 1, p: 1 }}>
                <Box sx={{ color: 'primary.main' }}>{icon}</Box>
                <Typography variant="h5" sx={{ textAlign: 'center' }}>{value}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'grid', gap: 1, mr: 1, p: 1 }}>
                <Typography variant="h6" sx={{ fontSize: 18, textAlign: 'center' }}>{title}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {!isNeutral && (
                        isPositive
                            ? <TrendingUpIcon fontSize="small" sx={{ color }} />
                            : <TrendingDownIcon fontSize="small" sx={{ color }} />
                    )}
                    <Typography variant="caption" sx={{ color }}>
                        {vs > 0 ? `+${vs}` : vs} vs ayer
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

interface Props {
    kpis: DailyKpisResponse | null;
    loading: boolean;
}

export const DashboardKpiCards = ({ kpis, loading }: Props) => {
    if (loading) {
        return (
            <>
                {[0, 1, 2, 3].map((i) => (
                    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
                        <Skeleton variant="rounded" height={120} sx={{ mt: 5, borderRadius: 3 }} />
                    </Grid>
                ))}
            </>
        );
    }

    if (!kpis) return null;

    return (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <KpiCard
                    title="Ventas del día"
                    value={formatCLP(kpis.totalAmount)}
                    vs={kpis.vs.totalAmount}
                    icon={<AttachMoneyIcon sx={{ width: 80, height: 40 }} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <KpiCard
                    title="Pedidos finalizados"
                    value={String(kpis.finalized)}
                    vs={kpis.vs.finalized}
                    icon={<CheckCircleOutlineIcon sx={{ width: 80, height: 40 }} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <KpiCard
                    title="Ticket promedio"
                    value={formatCLP(kpis.avgTicket)}
                    vs={kpis.vs.avgTicket}
                    icon={<ReceiptOutlinedIcon sx={{ width: 80, height: 40 }} />}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <KpiCard
                    title="Nuevos clientes"
                    value={String(kpis.newClients)}
                    vs={kpis.vs.newClients}
                    icon={<PersonAddOutlinedIcon sx={{ width: 80, height: 40 }} />}
                />
            </Grid>
        </>
    );
};
