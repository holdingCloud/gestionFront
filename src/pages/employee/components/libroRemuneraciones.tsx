import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from "@mui/material";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Employees } from '../../../interfaces/employee.interface';

function calcLiq(emp: Employees) {
    const base = emp.salary ?? 0;
    const gratif = Math.round(Math.min(base * 0.25, 81674));
    const totalHaberes = base + gratif + 50000 + 80000 + 50000;
    const afp = Math.round(base * 0.10);
    const salud = Math.round(base * 0.07);
    const afc = Math.round(base * 0.006);
    const totalDescuentos = afp + salud + afc;
    const liquido = totalHaberes - totalDescuentos;
    return { base, gratif, totalHaberes, afp, salud, afc, totalDescuentos, liquido };
}

const fmt = (n: number) => `$${n.toLocaleString('es-CL')}`;

interface Props {
    employees: Employees[];
    loading: boolean;
}

export function LibroRemuneraciones({ employees, loading }: Props) {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const rows = employees.map(emp => ({ emp, ...calcLiq(emp) }));
    const totals = rows.reduce((acc, r) => ({
        base: acc.base + r.base,
        gratif: acc.gratif + r.gratif,
        totalHaberes: acc.totalHaberes + r.totalHaberes,
        afp: acc.afp + r.afp,
        salud: acc.salud + r.salud,
        afc: acc.afc + r.afc,
        totalDescuentos: acc.totalDescuentos + r.totalDescuentos,
        liquido: acc.liquido + r.liquido,
    }), { base: 0, gratif: 0, totalHaberes: 0, afp: 0, salud: 0, afc: 0, totalDescuentos: 0, liquido: 0 });

    const hSx = {
        fontSize: '11px', fontWeight: 700, color: t.muted,
        textTransform: 'uppercase' as const, letterSpacing: '0.4px',
        whiteSpace: 'nowrap' as const, py: '8px', px: '12px', border: 0,
    };
    const cSx = {
        fontSize: '12.5px', color: t.ink,
        py: '9px', px: '12px', border: 0,
        whiteSpace: 'nowrap' as const,
    };

    return (
        <Box sx={{
            mx: '8px', mb: '8px', bgcolor: 'background.paper',
            borderRadius: '18px', border: `1px solid ${t.border}`,
            boxShadow: t.shadow, overflow: 'hidden',
        }}>
            {/* Header */}
            <Box sx={{
                px: '20px', py: '14px', borderBottom: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '10px',
            }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '16px', color: t.ink }}>
                        Libro de Remuneraciones
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: t.muted }}>
                        Junio 2026 · Documento legal oficial
                    </Typography>
                </Box>
                <Box sx={{
                    px: '16px', py: '9px', borderRadius: '10px',
                    border: `1.5px solid ${t.primary}`, color: t.primary,
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '7px',
                    userSelect: 'none', transition: 'all .15s',
                    '&:hover': { bgcolor: `${t.primary}0a` },
                }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Exportar Previred
                </Box>
            </Box>

            {/* Legal notice */}
            <Box sx={{
                px: '20px', py: '10px',
                bgcolor: `${t.warning}0d`,
                borderBottom: `1px solid ${t.warning}25`,
            }}>
                <Typography sx={{ fontSize: '12px', color: t.warning, fontWeight: 600 }}>
                    Libro de Remuneraciones — Art. 62 Código del Trabajo. Uso exclusivo interno y para fiscalización laboral.
                </Typography>
            </Box>

            {/* Table */}
            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: t.surface2 }}>
                            <TableCell sx={hSx}>N°</TableCell>
                            <TableCell sx={hSx}>Nombre</TableCell>
                            <TableCell sx={hSx}>RUT</TableCell>
                            <TableCell sx={hSx} align="right">Sueldo base</TableCell>
                            <TableCell sx={hSx} align="right">Gratificación</TableCell>
                            <TableCell sx={hSx} align="right">Total haberes</TableCell>
                            <TableCell sx={hSx} align="right">Desc. AFP</TableCell>
                            <TableCell sx={hSx} align="right">Desc. Salud</TableCell>
                            <TableCell sx={hSx} align="right">Desc. AFC</TableCell>
                            <TableCell sx={{ ...hSx, color: t.primary }} align="right">Líquido</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} sx={{ py: 6, border: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <CircularProgress size={28} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} sx={{ ...cSx, textAlign: 'center', py: 5, color: t.muted }}>
                                    No hay empleados registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            <>
                                {rows.map((r, idx) => (
                                    <TableRow key={r.emp.id} sx={{ '&:hover': { bgcolor: t.surface2 } }}>
                                        <TableCell sx={{ ...cSx, color: t.muted }}>{idx + 1}</TableCell>
                                        <TableCell sx={{ ...cSx, fontWeight: 600 }}>{r.emp.fullname}</TableCell>
                                        <TableCell sx={cSx}>{r.emp.rut}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.base)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.gratif)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.totalHaberes)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.afp)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.salud)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.afc)}</TableCell>
                                        <TableCell sx={{ ...cSx, fontWeight: 700, color: t.primary }} align="right">
                                            {fmt(r.liquido)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Totals row */}
                                <TableRow sx={{ bgcolor: `${t.primary}08`, borderTop: `2px solid ${t.border}` }}>
                                    <TableCell colSpan={3} sx={{ ...cSx, fontWeight: 800 }}>Totales</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.base)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.gratif)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.totalHaberes)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.afp)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.salud)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.afc)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 800, color: t.primary, fontSize: '14px' }} align="right">
                                        {fmt(totals.liquido)}
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}
