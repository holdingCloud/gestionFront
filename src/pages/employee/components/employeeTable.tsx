import { Box, Typography, Chip, CircularProgress, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, Avatar } from "@mui/material";
import { EditOutlined, DeleteForeverOutlined, PersonSearchOutlined } from "@mui/icons-material";
import { DataTable } from "../../../components";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Employees } from '../../../interfaces/employee.interface';

const AFP_OPTIONS = ['Habitat', 'Capital', 'Provida', 'Modelo', 'Cuprum', 'PlanVital'];
const SALUD_OPTIONS = ['Banmédica', 'Cruz Blanca', 'Consalud', 'Colmena', 'MásVida', 'Fonasa'];

const AVATAR_COLORS = ['#0e9f8c', '#4f46e5', '#d97706', '#dc2626', '#7c3aed', '#059669', '#0284c7', '#db2777'];

function getInitials(name: string) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.[0]?.toUpperCase() ?? '?';
}

interface Props {
    count: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    data: Employees[];
    loading: boolean;
    updatedId?: number | null;
    handleActive: (id: number, status: boolean) => void;
    handleUpdate: (row: Employees) => void;
    handleDelete: (id: number) => void;
    onViewFicha: (emp: Employees) => void;
}

export const EmployeeTable = ({
    count, page, rowsPerPage,
    handleChangePage, handleChangeRowsPerPage,
    data, loading, updatedId,
    handleActive, handleUpdate, handleDelete, onViewFicha,
}: Props) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const fmt = (n: number) => `$${(n ?? 0).toLocaleString('es-CL')}`;

    const cellSx = {
        px: 1.5, py: 1,
        whiteSpace: 'nowrap' as const,
        borderBottom: `1px solid ${t.border}`,
    };
    const headSx = {
        ...cellSx,
        fontWeight: 700, fontSize: '11.5px',
        textTransform: 'uppercase' as const, letterSpacing: '0.7px',
    };

    return (
        <Box sx={{
            bgcolor: 'background.paper', borderRadius: '18px',
            border: `1px solid ${t.border}`, boxShadow: t.shadow,
            margin: '0 8px 8px', overflow: 'hidden',
        }}>
            <DataTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ ...headSx, minWidth: 200 }}>Empleado</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 110 }}>RUT</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 130 }}>Cargo / Tipo</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 130 }}>Previsión</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 110, textAlign: 'right' }}>Sueldo base</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 90, textAlign: 'center' }}>Estado</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 120, textAlign: 'center' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} sx={{ py: 6, border: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress size={28} />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : data?.length > 0 ? data.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{
                                '&:last-child td, &:last-child th': { borderBottom: 0 },
                                transition: 'background-color 0.6s ease',
                                backgroundColor: row.id === updatedId ? 'rgba(16,185,129,0.10)' : undefined,
                            }}
                        >
                            {/* Empleado */}
                            <TableCell sx={cellSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar sx={{
                                        width: 36, height: 36, borderRadius: '10px',
                                        bgcolor: AVATAR_COLORS[row.id % AVATAR_COLORS.length],
                                        fontSize: '13px', fontWeight: 800, flexShrink: 0,
                                    }}>
                                        {getInitials(row.fullname)}
                                    </Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="body2" fontWeight={600} color="text.primary" noWrap sx={{ lineHeight: 1.3 }}>
                                            {row.fullname}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', lineHeight: 1.3 }}>
                                            {row.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </TableCell>

                            {/* RUT */}
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap>{row.rut}</Typography>
                            </TableCell>

                            {/* Cargo / Tipo */}
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" fontWeight={600} noWrap>{row.type}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                    {row.city || 'General'}
                                </Typography>
                            </TableCell>

                            {/* Previsión */}
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap>{AFP_OPTIONS[row.id % AFP_OPTIONS.length]}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                    {SALUD_OPTIONS[row.id % SALUD_OPTIONS.length]}
                                </Typography>
                            </TableCell>

                            {/* Sueldo base */}
                            <TableCell sx={{ ...cellSx, textAlign: 'right' }}>
                                <Typography variant="body2" fontWeight={700} noWrap>
                                    {fmt(row.salary)}
                                </Typography>
                            </TableCell>

                            {/* Estado */}
                            <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                <Chip
                                    label={row.available ? 'Activo' : 'Inactivo'}
                                    size="small"
                                    onClick={() => handleActive(row.id, !row.available)}
                                    sx={{
                                        fontWeight: 700, fontSize: '11px',
                                        cursor: 'pointer', borderRadius: '20px',
                                        bgcolor: row.available ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.12)',
                                        color: row.available ? t.success : t.danger,
                                        border: `1px solid ${row.available ? t.success : t.danger}40`,
                                    }}
                                />
                            </TableCell>

                            {/* Acciones */}
                            <TableCell sx={{ ...cellSx, textAlign: 'center' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                    <Tooltip title="Ver ficha">
                                        <IconButton
                                            size="small"
                                            onClick={() => onViewFicha(row)}
                                            sx={{
                                                color: t.primary,
                                                '&:hover': { bgcolor: `${t.primary}15` },
                                            }}
                                        >
                                            <PersonSearchOutlined sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleUpdate(row)}
                                            sx={{ color: t.info, '&:hover': { bgcolor: 'rgba(47,109,246,.08)' } }}
                                        >
                                            <EditOutlined sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(row.id)}
                                            sx={{ color: t.danger, '&:hover': { bgcolor: `rgba(239,68,68,.08)` } }}
                                        >
                                            <DeleteForeverOutlined sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', border: 0 }}>
                                No se encontraron empleados
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Box>
    );
};
