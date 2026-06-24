import { useState } from 'react';
import { Box, Typography, Chip, Tabs, Tab } from "@mui/material";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Employees } from '../../../interfaces/employee.interface';

const AFP_OPTIONS = ['Habitat', 'Capital', 'Provida', 'Modelo', 'Cuprum', 'PlanVital'];
const SALUD_OPTIONS = ['Banmédica', 'Cruz Blanca', 'Consalud', 'Colmena', 'MásVida', 'Fonasa'];

function getAfp(id: number) { return AFP_OPTIONS[id % AFP_OPTIONS.length]; }
function getSalud(id: number) { return SALUD_OPTIONS[id % SALUD_OPTIONS.length]; }

function calcAntigüedad(hiredate: string) {
    if (!hiredate) return '—';
    const hire = new Date(hiredate);
    const now = new Date();
    const totalMonths = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
    if (totalMonths >= 24) return `${Math.floor(totalMonths / 12)} años`;
    if (totalMonths >= 12) return '1 año';
    return `${Math.max(0, totalMonths)} meses`;
}

function getInitials(name: string) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.[0]?.toUpperCase() ?? '?';
}

function calcLiq(salary: number) {
    const base = salary ?? 0;
    const gratif = Math.round(Math.min(base * 0.25, 81674));
    const bono = 50000;
    const colacion = 80000;
    const movilizacion = 50000;
    const totalHaberes = base + gratif + bono + colacion + movilizacion;
    const afp = Math.round(base * 0.10);
    const salud = Math.round(base * 0.07);
    const afc = Math.round(base * 0.006);
    const totalDescuentos = afp + salud + afc;
    const liquido = totalHaberes - totalDescuentos;
    return { base, gratif, bono, colacion, movilizacion, totalHaberes, afp, salud, afc, totalDescuentos, liquido };
}

const fmt = (n: number) => `$${n.toLocaleString('es-CL')}`;

interface InfoCardProps {
    title: string;
    rows: { label: string; value: string }[];
    t: (typeof THEME_TOKENS)[keyof typeof THEME_TOKENS];
}

const InfoCard = ({ title, rows, t }: InfoCardProps) => (
    <Box sx={{
        bgcolor: t.surface2, borderRadius: '14px', border: `1px solid ${t.border}`,
        p: '16px', flex: 1, minWidth: 0,
    }}>
        <Typography sx={{
            fontSize: '11px', fontWeight: 700, color: t.muted,
            textTransform: 'uppercase', letterSpacing: '0.8px', mb: '12px',
        }}>
            {title}
        </Typography>
        {rows.map((r, i) => (
            <Box key={i} sx={{ mb: i < rows.length - 1 ? '10px' : 0 }}>
                <Typography sx={{ fontSize: '11.5px', color: t.muted, mb: '1px' }}>{r.label}</Typography>
                <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: t.ink }}>{r.value || '—'}</Typography>
            </Box>
        ))}
    </Box>
);

interface SectionRowProps {
    label: string;
    value: string;
    bold?: boolean;
    t: (typeof THEME_TOKENS)[keyof typeof THEME_TOKENS];
}

const SectionRow = ({ label, value, bold, t }: SectionRowProps) => (
    <Box sx={{
        display: 'flex', justifyContent: 'space-between', py: '9px',
        borderBottom: `1px solid ${t.border}`, '&:last-child': { borderBottom: 0 },
    }}>
        <Typography sx={{ fontSize: '13px', color: bold ? t.ink : t.muted, fontWeight: bold ? 700 : 400 }}>
            {label}
        </Typography>
        <Typography sx={{ fontSize: '13px', color: t.ink, fontWeight: bold ? 700 : 500 }}>
            {value}
        </Typography>
    </Box>
);

interface Props {
    open: boolean;
    onClose: () => void;
    employee: Employees | null;
    onEdit: () => void;
}

export function EmpleadoFichaDrawer({ open, onClose, employee, onEdit }: Props) {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];
    const [activeTab, setActiveTab] = useState(0);

    if (!employee) return null;

    const liq = calcLiq(employee.salary);
    const afpName = getAfp(employee.id);
    const saludName = getSalud(employee.id);
    const initials = getInitials(employee.fullname);
    const antigüedad = calcAntigüedad(employee.hiredate ?? '');

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
                width: { xs: '100vw', sm: 520, md: 580 },
                zIndex: 91, bgcolor: t.surface,
                borderLeft: `1px solid ${t.border}`,
                transform: open ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.32s cubic-bezier(.2,.8,.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: '-4px 0 40px rgba(0,0,0,.18)', overflow: 'hidden',
            }}>
                {/* Header band */}
                <Box sx={{
                    background: `linear-gradient(135deg,${t.brand},${t.brand2})`,
                    padding: '20px 20px 18px', flexShrink: 0,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        {/* Avatar */}
                        <Box sx={{
                            width: 52, height: 52, borderRadius: '16px', flexShrink: 0,
                            background: `linear-gradient(135deg,${t.primary},${t.primaryDark})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '20px', color: '#fff',
                            border: '2px solid rgba(255,255,255,.2)',
                        }}>
                            {initials}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '16px', color: t.brandink }}>
                                    {employee.fullname}
                                </Typography>
                                <Chip
                                    label={employee.available ? 'Activo' : 'Inactivo'}
                                    size="small"
                                    sx={{
                                        height: 20, fontSize: '11px', fontWeight: 700,
                                        bgcolor: employee.available ? 'rgba(16,185,129,.25)' : 'rgba(239,68,68,.25)',
                                        color: employee.available ? '#10b981' : '#ef4444',
                                        border: 'none',
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: '13px', color: `${t.brandink}cc`, mt: '2px' }}>
                                {employee.type} · RUT {employee.rut}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: `${t.brandink}88`, mt: '4px' }}>
                                Antigüedad: {antigüedad}
                            </Typography>
                        </Box>
                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            <Box
                                onClick={onEdit}
                                sx={{
                                    px: '12px', py: '7px', borderRadius: '10px',
                                    border: '1.5px solid rgba(255,255,255,.25)',
                                    color: t.brandink, fontSize: '12px', fontWeight: 600,
                                    cursor: 'pointer', transition: 'background .15s',
                                    '&:hover': { background: 'rgba(255,255,255,.1)' },
                                }}
                            >
                                Editar
                            </Box>
                            <Box
                                onClick={onClose}
                                sx={{
                                    width: 32, height: 32, borderRadius: '10px',
                                    background: 'rgba(255,255,255,.1)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    '&:hover': { background: 'rgba(255,255,255,.18)' },
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.brandink} strokeWidth="2.2" strokeLinecap="round">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Body */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 3 info cards */}
                    <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <InfoCard title="Datos personales" rows={[
                            { label: 'Email', value: employee.email },
                            { label: 'Ciudad', value: employee.city },
                            { label: 'Dirección', value: employee.address },
                        ]} t={t} />
                        <InfoCard title="Previsión obligatoria" rows={[
                            { label: 'AFP', value: afpName },
                            { label: 'Salud', value: saludName },
                            { label: 'AFC', value: '0.6%' },
                        ]} t={t} />
                        <InfoCard title="Contrato vigente" rows={[
                            { label: 'Tipo', value: employee.type },
                            { label: 'Inicio', value: employee.hiredate ?? '—' },
                            { label: 'Jornada', value: '45 hrs/semana' },
                        ]} t={t} />
                    </Box>

                    {/* Tabs */}
                    <Box>
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            sx={{
                                mb: '12px', minHeight: 36,
                                '& .MuiTab-root': { fontSize: '12.5px', fontWeight: 700, textTransform: 'none', minHeight: 36, py: 0 },
                                '& .MuiTabs-indicator': { bgcolor: t.primary },
                                '& .Mui-selected': { color: `${t.primary} !important` },
                            }}
                        >
                            <Tab label="Liquidación" />
                            <Tab label="Ausencias" />
                            <Tab label="Anticipos" />
                            <Tab label="Finiquito" />
                        </Tabs>

                        {/* Tab 0: Liquidación */}
                        {activeTab === 0 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <Box sx={{ bgcolor: t.surface2, borderRadius: '12px', border: `1px solid ${t.border}`, px: '16px', py: '4px' }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.8px', py: '8px' }}>
                                        Haberes
                                    </Typography>
                                    <SectionRow label="Sueldo base" value={fmt(liq.base)} t={t} />
                                    <SectionRow label="Gratificación (Art. 50)" value={fmt(liq.gratif)} t={t} />
                                    <SectionRow label="Bono de desempeño" value={fmt(liq.bono)} t={t} />
                                    <SectionRow label="Colación" value={fmt(liq.colacion)} t={t} />
                                    <SectionRow label="Movilización" value={fmt(liq.movilizacion)} t={t} />
                                    <SectionRow label="Total haberes" value={fmt(liq.totalHaberes)} bold t={t} />
                                </Box>
                                <Box sx={{ bgcolor: t.surface2, borderRadius: '12px', border: `1px solid ${t.border}`, px: '16px', py: '4px' }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.8px', py: '8px' }}>
                                        Descuentos
                                    </Typography>
                                    <SectionRow label="AFP (10%)" value={fmt(liq.afp)} t={t} />
                                    <SectionRow label="Salud (7%)" value={fmt(liq.salud)} t={t} />
                                    <SectionRow label="AFC (0.6%)" value={fmt(liq.afc)} t={t} />
                                    <SectionRow label="Total descuentos" value={fmt(liq.totalDescuentos)} bold t={t} />
                                </Box>
                                <Box sx={{
                                    bgcolor: `${t.primary}15`, borderRadius: '12px',
                                    border: `2px solid ${t.primary}30`, p: '16px', textAlign: 'center',
                                }}>
                                    <Typography sx={{ fontSize: '11.5px', fontWeight: 600, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.8px', mb: '4px' }}>
                                        Líquido a pagar
                                    </Typography>
                                    <Typography sx={{ fontSize: '28px', fontWeight: 900, color: t.primary, lineHeight: 1 }}>
                                        {fmt(liq.liquido)}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Tab 1: Ausencias */}
                        {activeTab === 1 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { tipo: 'Vacaciones', dias: 15, saldo: 12, color: t.info },
                                    { tipo: 'Licencias médicas', dias: 0, saldo: 0, color: t.warning },
                                    { tipo: 'Permisos administrativos', dias: 2, saldo: 3, color: t.success },
                                ].map((item, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        p: '14px 16px', borderRadius: '12px',
                                        bgcolor: t.surface2, border: `1px solid ${t.border}`,
                                    }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: t.ink }}>{item.tipo}</Typography>
                                            <Typography sx={{ fontSize: '12px', color: t.muted }}>Tomados este año: {item.dias} día(s)</Typography>
                                        </Box>
                                        <Box sx={{
                                            px: '12px', py: '5px', borderRadius: '20px',
                                            bgcolor: `${item.color}1a`, border: `1px solid ${item.color}40`,
                                        }}>
                                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: item.color }}>
                                                {item.saldo} disponibles
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Tab 2: Anticipos */}
                        {activeTab === 2 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { fecha: '05/03/2026', monto: 150000, estado: 'Descontado' },
                                    { fecha: '10/04/2026', monto: 200000, estado: 'Pendiente' },
                                ].map((ant, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        p: '12px 16px', borderRadius: '12px',
                                        bgcolor: t.surface2, border: `1px solid ${t.border}`,
                                    }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: t.ink }}>{fmt(ant.monto)}</Typography>
                                            <Typography sx={{ fontSize: '12px', color: t.muted }}>{ant.fecha}</Typography>
                                        </Box>
                                        <Chip
                                            label={ant.estado}
                                            size="small"
                                            sx={{
                                                fontWeight: 700, fontSize: '11px',
                                                bgcolor: ant.estado === 'Descontado' ? `${t.success}1a` : `${t.warning}1a`,
                                                color: ant.estado === 'Descontado' ? t.success : t.warning,
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Tab 3: Finiquito */}
                        {activeTab === 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <Box sx={{
                                    p: '14px', borderRadius: '12px',
                                    bgcolor: `${t.warning}10`, border: `1px solid ${t.warning}30`,
                                }}>
                                    <Typography sx={{ fontSize: '13px', color: t.warning, fontWeight: 600, mb: '4px' }}>
                                        Simulador de Finiquito (Art. 161)
                                    </Typography>
                                    <Typography sx={{ fontSize: '12.5px', color: t.muted }}>
                                        Estimación para término por necesidades de la empresa.
                                    </Typography>
                                </Box>
                                {(() => {
                                    const hire = new Date(employee.hiredate ?? '');
                                    const now = new Date();
                                    const yearsRaw = (now.getTime() - hire.getTime()) / (365.25 * 24 * 3600 * 1000);
                                    const years = Math.min(Math.max(0, Math.floor(yearsRaw)), 11);
                                    const indemnizacion = years * employee.salary;
                                    const vacProp = Math.round(employee.salary / 12);
                                    return (
                                        <Box sx={{ bgcolor: t.surface2, borderRadius: '12px', border: `1px solid ${t.border}`, px: '16px', py: '4px' }}>
                                            <SectionRow label="Años de servicio" value={`${years} año(s)`} t={t} />
                                            <SectionRow label="Última remuneración" value={fmt(employee.salary)} t={t} />
                                            <SectionRow label="Vacaciones proporcionales" value={fmt(vacProp)} t={t} />
                                            <SectionRow label="Indemnización (Art. 161)" value={fmt(indemnizacion)} bold t={t} />
                                            <SectionRow label="Total estimado finiquito" value={fmt(indemnizacion + vacProp)} bold t={t} />
                                        </Box>
                                    );
                                })()}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}
