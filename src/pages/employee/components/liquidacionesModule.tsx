import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from "@mui/material";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Employees } from '../../../interfaces/employee.interface';

function calcLiq(emp: Employees) {
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

interface Props {
    employees: Employees[];
    loading: boolean;
    onVerLiquidacion: (emp: Employees) => void;
}

export function LiquidacionesModule({ employees, loading, onVerLiquidacion }: Props) {
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
        impuesto: acc.impuesto + r.impuesto,
        totalDescuentos: acc.totalDescuentos + r.totalDescuentos,
        liquido: acc.liquido + r.liquido,
    }), { base: 0, gratif: 0, totalHaberes: 0, afp: 0, salud: 0, afc: 0, impuesto: 0, totalDescuentos: 0, liquido: 0 });

    const hSx = {
        fontSize: '11.5px', fontWeight: 700, color: t.muted,
        textTransform: 'uppercase' as const, letterSpacing: '0.5px',
        whiteSpace: 'nowrap' as const, py: '10px', px: '12px', border: 0,
    };
    const cSx = {
        fontSize: '13px', color: t.ink,
        py: '10px', px: '12px', border: 0,
        whiteSpace: 'nowrap' as const,
    };

    return (
        <Box sx={{
            mx: '8px', mb: '8px', bgcolor: 'background.paper',
            borderRadius: '18px', border: `1px solid ${t.border}`,
            boxShadow: t.shadow, overflow: 'hidden',
        }}>
            {/* Period header */}
            <Box sx={{
                px: '20px', py: '14px', borderBottom: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '10px',
            }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '16px', color: t.ink }}>
                        Liquidaciones
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: t.muted }}>
                        Período: Junio 2026
                    </Typography>
                </Box>
                <Box sx={{
                    px: '16px', py: '9px', borderRadius: '10px',
                    background: `linear-gradient(135deg,${t.primary},${t.primaryDark})`,
                    color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    userSelect: 'none', transition: 'opacity .15s', '&:hover': { opacity: 0.9 },
                }}>
                    Procesar período
                </Box>
            </Box>

            {/* Table */}
            <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: t.surface2 }}>
                            <TableCell sx={hSx}>Empleado</TableCell>
                            <TableCell sx={hSx} align="right">Sueldo base</TableCell>
                            <TableCell sx={hSx} align="right">Gratificación</TableCell>
                            <TableCell sx={hSx} align="right">Total haberes</TableCell>
                            <TableCell sx={hSx} align="right">AFP</TableCell>
                            <TableCell sx={hSx} align="right">Salud</TableCell>
                            <TableCell sx={hSx} align="right">AFC</TableCell>
                            <TableCell sx={hSx} align="right">Total desc.</TableCell>
                            <TableCell sx={{ ...hSx, color: t.primary }} align="right">Líquido</TableCell>
                            <TableCell sx={hSx} align="center">Ver</TableCell>
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
                                {rows.map(r => (
                                    <TableRow key={r.emp.id} sx={{ '&:hover': { bgcolor: t.surface2 } }}>
                                        <TableCell sx={cSx}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: t.ink }}>
                                                {r.emp.fullname}
                                            </Typography>
                                            <Typography sx={{ fontSize: '11.5px', color: t.muted }}>
                                                {r.emp.rut}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.base)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.gratif)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.totalHaberes)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.afp)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.salud)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.afc)}</TableCell>
                                        <TableCell sx={cSx} align="right">{fmt(r.totalDescuentos)}</TableCell>
                                        <TableCell sx={{ ...cSx, fontWeight: 700, color: t.primary }} align="right">
                                            {fmt(r.liquido)}
                                        </TableCell>
                                        <TableCell sx={{ ...cSx, textAlign: 'center' }}>
                                            <Box
                                                onClick={() => onVerLiquidacion(r.emp)}
                                                sx={{
                                                    display: 'inline-flex', px: '10px', py: '4px', borderRadius: '8px',
                                                    border: `1.5px solid ${t.primary}`, color: t.primary,
                                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                                    transition: 'all .15s', '&:hover': { bgcolor: `${t.primary}10` },
                                                }}
                                            >
                                                Ver
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Totals row */}
                                <TableRow sx={{ bgcolor: `${t.primary}08`, borderTop: `2px solid ${t.border}` }}>
                                    <TableCell sx={{ ...cSx, fontWeight: 800 }}>Totales</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.base)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.gratif)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.totalHaberes)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.afp)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.salud)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.afc)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 700 }} align="right">{fmt(totals.totalDescuentos)}</TableCell>
                                    <TableCell sx={{ ...cSx, fontWeight: 800, color: t.primary, fontSize: '14px' }} align="right">
                                        {fmt(totals.liquido)}
                                    </TableCell>
                                    <TableCell sx={cSx} />
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}
