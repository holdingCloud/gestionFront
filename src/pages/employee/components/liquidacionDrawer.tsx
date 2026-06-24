import { Box, Typography } from "@mui/material";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Employees } from '../../../interfaces/employee.interface';

function calcLiquidacion(emp: Employees) {
    const base = emp.salary ?? 0;
    const gratif = Math.round(Math.min(base * 0.25, 81674));
    const bono = 50000;
    const colacion = 80000;
    const movilizacion = 50000;
    const totalHaberes = base + gratif + bono + colacion + movilizacion;
    const afp = Math.round(base * 0.10);
    const salud = Math.round(base * 0.07);
    const afc = Math.round(base * 0.006);
    const impuesto = 0;
    const totalDescuentos = afp + salud + afc + impuesto;
    const liquido = totalHaberes - totalDescuentos;
    return { base, gratif, bono, colacion, movilizacion, totalHaberes, afp, salud, afc, impuesto, totalDescuentos, liquido };
}

const fmt = (n: number) => `$${n.toLocaleString('es-CL')}`;

interface SectionRowProps {
    label: string;
    value: string;
    bold?: boolean;
    t: (typeof THEME_TOKENS)[keyof typeof THEME_TOKENS];
}

const SectionRow = ({ label, value, bold, t }: SectionRowProps) => (
    <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        py: '9px', borderBottom: `1px solid ${t.border}`,
        '&:last-child': { borderBottom: 0 },
    }}>
        <Typography sx={{ fontSize: '13.5px', color: bold ? t.ink : t.muted, fontWeight: bold ? 700 : 400 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: '13.5px', color: t.ink, fontWeight: bold ? 700 : 500 }}>
            {value}
        </Typography>
    </Box>
);

interface Props {
    open: boolean;
    onClose: () => void;
    employee: Employees | null;
}

export function LiquidacionDrawer({ open, onClose, employee }: Props) {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const liq = employee ? calcLiquidacion(employee) : null;

    return (
        <>
            {/* Backdrop */}
            <Box
                onClick={onClose}
                sx={{
                    position: 'fixed', inset: 0, zIndex: 90,
                    background: 'rgba(0,0,0,.42)', backdropFilter: 'blur(2px)',
                    opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 0.28s',
                }}
            />

            {/* Slide-in panel */}
            <Box sx={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: { xs: '100vw', sm: '420px' },
                zIndex: 91, bgcolor: t.surface,
                borderLeft: `1px solid ${t.border}`,
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.32s cubic-bezier(.2,.8,.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 40px rgba(0,0,0,.18)', overflow: 'hidden',
            }}>
                {/* Header */}
                <Box sx={{
                    background: `linear-gradient(135deg,${t.brand},${t.brand2})`,
                    padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: t.brandink }}>
                            Liquidación · {employee?.fullname ?? ''}
                        </Typography>
                        <Typography sx={{ fontSize: '12.5px', color: `${t.brandink}99` }}>
                            Período: Junio 2026
                        </Typography>
                    </Box>
                    <Box
                        onClick={onClose}
                        sx={{
                            width: 32, height: 32, borderRadius: '10px',
                            background: 'rgba(255,255,255,.1)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'background .15s',
                            '&:hover': { background: 'rgba(255,255,255,.18)' },
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.brandink} strokeWidth="2.2" strokeLinecap="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </Box>
                </Box>

                {/* Body */}
                {liq && (
                    <Box sx={{ flex: 1, overflowY: 'auto', p: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Haberes */}
                        <Box>
                            <Typography sx={{
                                fontSize: '11px', fontWeight: 700, color: t.muted,
                                textTransform: 'uppercase', letterSpacing: '1px', mb: '8px',
                            }}>
                                Haberes
                            </Typography>
                            <Box sx={{ bgcolor: t.surface2, borderRadius: '12px', border: `1px solid ${t.border}`, px: '16px', py: '4px' }}>
                                <SectionRow label="Sueldo base" value={fmt(liq.base)} t={t} />
                                <SectionRow label="Gratificación (Art. 50)" value={fmt(liq.gratif)} t={t} />
                                <SectionRow label="Bono de desempeño" value={fmt(liq.bono)} t={t} />
                                <SectionRow label="Colación" value={fmt(liq.colacion)} t={t} />
                                <SectionRow label="Movilización" value={fmt(liq.movilizacion)} t={t} />
                                <SectionRow label="Total haberes" value={fmt(liq.totalHaberes)} bold t={t} />
                            </Box>
                        </Box>

                        {/* Descuentos */}
                        <Box>
                            <Typography sx={{
                                fontSize: '11px', fontWeight: 700, color: t.muted,
                                textTransform: 'uppercase', letterSpacing: '1px', mb: '8px',
                            }}>
                                Descuentos
                            </Typography>
                            <Box sx={{ bgcolor: t.surface2, borderRadius: '12px', border: `1px solid ${t.border}`, px: '16px', py: '4px' }}>
                                <SectionRow label="AFP (10%)" value={fmt(liq.afp)} t={t} />
                                <SectionRow label="Salud (7%)" value={fmt(liq.salud)} t={t} />
                                <SectionRow label="AFC (0.6%)" value={fmt(liq.afc)} t={t} />
                                <SectionRow label="Impuesto 2ª categoría" value={fmt(liq.impuesto)} t={t} />
                                <SectionRow label="Total descuentos" value={fmt(liq.totalDescuentos)} bold t={t} />
                            </Box>
                        </Box>

                        {/* Líquido */}
                        <Box sx={{
                            bgcolor: `${t.primary}18`, borderRadius: '14px',
                            border: `2px solid ${t.primary}40`, p: '20px', textAlign: 'center',
                        }}>
                            <Typography sx={{
                                fontSize: '12px', fontWeight: 600, color: t.muted,
                                textTransform: 'uppercase', letterSpacing: '1px', mb: '6px',
                            }}>
                                Líquido a pagar
                            </Typography>
                            <Typography sx={{ fontSize: '32px', fontWeight: 900, color: t.primary, lineHeight: 1 }}>
                                {fmt(liq.liquido)}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Footer */}
                <Box sx={{ p: '14px 20px', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
                    <Box sx={{
                        width: '100%', padding: '12px', borderRadius: '11px',
                        background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                        color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        userSelect: 'none', transition: 'opacity .15s', '&:hover': { opacity: 0.9 },
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Descargar PDF
                    </Box>
                </Box>
            </Box>
        </>
    );
}
