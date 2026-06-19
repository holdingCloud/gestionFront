import { Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useDashboard } from './hooks/useDashboard';
import { DashboardKpiCards } from './components/DashboardKpiCards';
import { useThemeStore, THEME_TOKENS } from '../../store/theme/theme.store';
import { useClientStore } from '../../store/client/client.store';
import { useNavigate } from 'react-router-dom';

// ── SVG smooth-curve chart helpers ──────────────────────────────────────────

interface Pt { x: number; y: number; }

function smooth(pts: Pt[]): string {
    if (!pts.length) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p = pts[i], n = pts[i + 1];
        const mx = (p.x + n.x) / 2;
        d += ` C ${mx} ${p.y} ${mx} ${n.y} ${n.x} ${n.y}`;
    }
    return d;
}

function buildChart(values: number[], labels: string[]) {
    const W = 1000, H = 320, PL = 56, PR = 24, PT = 18, PB = 34;
    const iw = W - PL - PR, ih = H - PT - PB;
    const hi = Math.max(...values, 1);
    const pts: Pt[] = values.map((v, i) => ({
        x: PL + (values.length < 2 ? iw / 2 : (i / (values.length - 1)) * iw),
        y: PT + ih - (v / hi) * ih,
    }));
    const line = smooth(pts);
    const last = pts[pts.length - 1];
    const first = pts[0];
    const area = line + ` L ${last.x} ${PT + ih} L ${first.x} ${PT + ih} Z`;
    const grid = [0, 1, 2, 3, 4].map(k => ({
        y: PT + ih * (k / 4),
        ty: PT + ih * (k / 4) + 4,
        label: ((hi - hi * (k / 4)) / 1000).toFixed(0) + 'k',
    }));
    const xticks = pts.map((p, i) => ({ x: p.x, label: labels[i] ?? '' }));
    return { pts, line, area, grid, xticks };
}

// ── Suggested actions ────────────────────────────────────────────────────────

const suggestions = [
    {
        title: 'Clientes por llamar hoy',
        sub: 'Revisa la lista priorizada',
        iconPath: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z',
        bg: 'rgba(224,145,63,.14)', color: '#e0913f', to: '/dashboard/client',
    },
    {
        title: 'Ver evolución de ventas',
        sub: 'Reportes del período actual',
        iconPath: 'M3 3v18h18 M7 16v-5 M12 16V8 M17 16v-9',
        bg: 'rgba(14,159,140,.13)', color: '#0e9f8c', to: '/dashboard/reports',
    },
    {
        title: 'Gestionar inventario',
        sub: 'Revisa stock y existencias',
        iconPath: 'M21 8v8a2 2 0 0 1-1 1.73l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.73l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z M3.3 7 12 12l8.7-5 M12 22V12',
        bg: 'rgba(47,109,246,.12)', color: '#2f6df6', to: '/dashboard/inventory',
    },
];

// ── Component ────────────────────────────────────────────────────────────────

export const DashboardPage = () => {
    const navigate = useNavigate();
    const { kpis, salesEvolution, loadingKpis, loadingEvolution } = useDashboard();
    const porLlamarCount = useClientStore(state => state.porLlamarCount);
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const xLabels = salesEvolution?.series.map(s => dayjs(s.period).format('DD/MM')) ?? [];
    const amountData = salesEvolution?.series.map(s => s.totalAmount) ?? [];
    const monthLabel = dayjs().format('MMMM YYYY');
    const hasChart = amountData.length > 0;
    const chart = hasChart ? buildChart(amountData, xLabels) : null;

    const trendPct = kpis?.vs.totalAmount
        ? `${kpis.vs.totalAmount > 0 ? '+' : ''}${((kpis.vs.totalAmount / Math.max(kpis.totalAmount - kpis.vs.totalAmount, 1)) * 100).toFixed(1)}%`
        : null;

    return (
        <Box>
            {/* KPI cards — 4-column grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                mb: '18px',
            }}>
                <DashboardKpiCards kpis={kpis} loading={loadingKpis} />
            </Box>

            {/* Lower row: chart + side panel */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1.85fr 1fr',
                gap: '18px',
            }}>

                {/* ── Sales chart ── */}
                <Box sx={{
                    bgcolor: 'background.paper',
                    border: `1px solid ${t.border}`,
                    borderRadius: '18px',
                    padding: '22px',
                    boxShadow: t.shadow,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '6px' }}>
                        <Box>
                            <Typography sx={{ fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 700, fontSize: '18px', color: 'text.primary' }}>
                                Evolución de ventas
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
                                {monthLabel} · diario
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', fontWeight: 600, color: 'text.secondary' }}>
                            <Box sx={{ width: 11, height: 11, borderRadius: '3px', bgcolor: 'primary.main' }} />
                            Ventas ($)
                        </Box>
                    </Box>

                    {loadingEvolution ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                            <CircularProgress size={32} />
                        </Box>
                    ) : chart ? (
                        <svg viewBox="0 0 1000 320" preserveAspectRatio="none" style={{ width: '100%', height: 300, marginTop: 8, overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="chArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor={t.primary} stopOpacity="0.28" />
                                    <stop offset="1" stopColor={t.primary} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {chart.grid.map((g, i) => (
                                <line key={i} x1="56" y1={g.y} x2="976" y2={g.y} stroke={t.border} strokeWidth="1" />
                            ))}
                            {chart.grid.map((g, i) => (
                                <text key={i} x="48" y={g.ty} textAnchor="end" fontSize="11" fill={t.muted} fontFamily="'JetBrains Mono', monospace">
                                    {g.label}
                                </text>
                            ))}
                            <path d={chart.area} fill="url(#chArea)" />
                            <path d={chart.line} fill="none" stroke={t.primary} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                            {chart.pts.map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={t.surface} stroke={t.primary} strokeWidth="2.2" />
                            ))}
                            {chart.xticks.map((tick, i) => (
                                <text key={i} x={tick.x} y="314" textAnchor="middle" fontSize="10.5" fill={t.muted} fontFamily="'JetBrains Mono', monospace">
                                    {tick.label}
                                </text>
                            ))}
                        </svg>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                            <Typography color="text.secondary" fontSize={14}>Sin ventas registradas este mes</Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Right column ── */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* AI summary card */}
                    <Box sx={{
                        background: `linear-gradient(150deg,${t.brand},${t.brand2})`,
                        borderRadius: '18px', padding: '20px',
                        color: t.brandink, boxShadow: t.shadow,
                        position: 'relative', overflow: 'hidden', border: 'none',
                    }}>
                        <Box sx={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: `rgba(14,159,140,.18)`, right: -40, top: -40 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', mb: '13px', position: 'relative' }}>
                            <Box sx={{
                                width: 30, height: 30, borderRadius: '9px',
                                background: 'rgba(14,159,140,.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3" />
                                    <circle cx="12" cy="12" r="3.2" />
                                </svg>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '14.5px', color: t.brandink }}>
                                Copiloto · Resumen de hoy
                            </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '13.5px', lineHeight: 1.6, opacity: 0.9, position: 'relative', color: t.brandink }}>
                            {trendPct && (
                                <>Vas <Box component="b" sx={{ color: t.primary }}>{trendPct}</Box> vs ayer.{' '}</>
                            )}
                            {porLlamarCount > 0 && (
                                <>Hay <Box component="b">{porLlamarCount} cliente{porLlamarCount !== 1 ? 's' : ''} por llamar hoy</Box>.{' '}</>
                            )}
                            Revisa las acciones sugeridas para optimizar tu jornada.
                        </Typography>
                    </Box>

                    {/* Suggested actions */}
                    <Box sx={{
                        bgcolor: 'background.paper',
                        border: `1px solid ${t.border}`,
                        borderRadius: '18px', padding: '18px',
                        boxShadow: t.shadow, flex: 1,
                    }}>
                        <Typography sx={{ fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 700, fontSize: '15px', color: 'text.primary', mb: '13px' }}>
                            Acciones sugeridas
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                            {suggestions.map(s => (
                                <Box
                                    key={s.title}
                                    onClick={() => navigate(s.to)}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: '11px',
                                        bgcolor: t.surface2, border: `1px solid ${t.border}`,
                                        borderRadius: '12px', padding: '11px', cursor: 'pointer',
                                        transition: 'border-color .15s',
                                        '&:hover': { borderColor: t.primary },
                                    }}
                                >
                                    <Box sx={{
                                        width: 32, height: 32, borderRadius: '9px',
                                        background: s.bg, color: s.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                            <path d={s.iconPath} />
                                        </svg>
                                    </Box>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'text.primary' }}>{s.title}</Typography>
                                        <Typography sx={{ fontSize: '11.5px', color: 'text.secondary' }}>{s.sub}</Typography>
                                    </Box>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardPage;
