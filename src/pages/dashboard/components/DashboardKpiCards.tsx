import { Box, Skeleton, Typography } from '@mui/material';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { DailyKpisResponse } from '../../../interfaces/report.interface';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const formatTrend = (vs: number) => (vs > 0 ? `+${vs}` : `${vs}`);

interface KpiCardProps {
    label: string;
    value: string;
    vs: number;
    invertTrend?: boolean;
    iconPath: string;
    iconBg: string;
    iconColor: string;
}

const KpiCard = ({ label, value, vs, invertTrend = false, iconPath, iconBg, iconColor }: KpiCardProps) => {
    const { theme: themeVariant } = useThemeStore();
    const t = THEME_TOKENS[themeVariant];

    const isPositive = invertTrend ? vs < 0 : vs > 0;
    const isNeutral = vs === 0;
    const trendColor = isNeutral ? t.muted : isPositive ? t.success : t.danger;
    const trendBg = isNeutral ? 'transparent' : isPositive ? `rgba(47,158,111,.12)` : `rgba(217,88,63,.12)`;
    const trendLabel = isNeutral ? 'sin cambio' : `${formatTrend(vs)} vs ayer`;

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${t.border}`,
            borderRadius: '18px',
            padding: '20px',
            boxShadow: t.shadow,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '14px' }}>
                <Box sx={{
                    width: 42, height: 42, borderRadius: '12px',
                    background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: iconColor,
                }}>
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d={iconPath} />
                    </svg>
                </Box>
                <Box sx={{
                    fontSize: '12px', fontWeight: 700, color: trendColor,
                    background: trendBg, padding: '4px 9px', borderRadius: '8px',
                }}>
                    {trendLabel}
                </Box>
            </Box>
            <Typography sx={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontWeight: 700, fontSize: '27px', color: 'text.primary',
                letterSpacing: '-0.5px', lineHeight: 1,
            }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: '6px' }}>
                {label}
            </Typography>
        </Box>
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
                {[0, 1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={130} sx={{ borderRadius: '18px' }} />
                ))}
            </>
        );
    }

    if (!kpis) return null;

    return (
        <>
            <KpiCard
                label="Ventas del día"
                value={formatCLP(kpis.totalAmount)}
                vs={kpis.vs.totalAmount}
                iconPath="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                iconBg="rgba(14,159,140,.13)"
                iconColor="#0e9f8c"
            />
            <KpiCard
                label="Pedidos finalizados"
                value={String(kpis.finalized)}
                vs={kpis.vs.finalized}
                iconPath="M22 11.1V12a10 10 0 1 1-5.9-9.1 M22 4 12 14.1l-3-3"
                iconBg="rgba(47,109,246,.12)"
                iconColor="#2f6df6"
            />
            <KpiCard
                label="Ticket promedio"
                value={formatCLP(kpis.avgTicket)}
                vs={kpis.vs.avgTicket}
                iconPath="M3 5h18v14H3z M3 10h18 M7 15h4"
                iconBg="rgba(224,145,63,.14)"
                iconColor="#e0913f"
            />
            <KpiCard
                label="Nuevos clientes"
                value={String(kpis.newClients)}
                vs={kpis.vs.newClients}
                iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M19 8v6 M22 11h-6"
                iconBg="rgba(47,158,111,.13)"
                iconColor="#2f9e6f"
            />
        </>
    );
};
