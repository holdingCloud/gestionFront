import {
    Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow,
    Button, Typography, Tooltip,
} from '@mui/material';
import { EditOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { RolConModulos, TypePosition } from '../../../interfaces';

const ROLE_TYPE_CONFIG: Record<TypePosition, { label: string; bg: string; color: string }> = {
    SUPER_ADMIN:   { label: 'Super Admin',   bg: 'rgba(47,109,246,.14)',  color: '#2f6df6' },
    ADMINISTRADOR: { label: 'Administrador', bg: 'rgba(14,159,140,.14)',  color: '#0e9f8c' },
    REPARTIDOR:    { label: 'Repartidor',    bg: 'rgba(224,145,63,.14)', color: '#e0913f' },
    COMUN:         { label: 'Común',          bg: 'rgba(124,114,100,.12)', color: '#7c7264' },
};

const TOTAL_MODULOS = 11;

const headSx = {
    px: 1.5, py: 1,
    fontWeight: 700, fontSize: '11px',
    textTransform: 'uppercase' as const, letterSpacing: '0.7px',
};
const cellSx = { px: 1.5, py: 1 };

interface RolesTableProps {
    rolesConModulos: RolConModulos[];
    onGestionarModulos: (rol: RolConModulos) => void;
    onDeleteRole: (id: number) => void;
    canManageModulos: boolean;
    loading?: boolean;
}

export const RolesTable = ({ rolesConModulos, onGestionarModulos, onDeleteRole, canManageModulos, loading }: RolesTableProps) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            borderRadius: '18px',
            border: `1px solid ${t.border}`,
            boxShadow: t.shadow,
            margin: '0 8px 8px',
            overflow: 'hidden',
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={headSx}>Tipo de Rol</TableCell>
                        <TableCell sx={headSx} align="center">Módulos asignados</TableCell>
                        <TableCell sx={headSx}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={3} sx={{ py: 6, border: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : rolesConModulos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                No hay roles registrados
                            </TableCell>
                        </TableRow>
                    ) : rolesConModulos.map((row) => {
                        const conf = ROLE_TYPE_CONFIG[row.type as TypePosition] ?? { label: row.type, bg: 'rgba(124,114,100,.12)', color: '#7c7264' };
                        return (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                <TableCell sx={cellSx}>
                                    <Box sx={{
                                        display: 'inline-flex', alignItems: 'center',
                                        padding: '4px 10px', borderRadius: '8px',
                                        bgcolor: conf.bg, color: conf.color,
                                        fontSize: '12px', fontWeight: 700,
                                    }}>
                                        {conf.label}
                                    </Box>
                                </TableCell>

                                <TableCell sx={cellSx} align="center">
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}>
                                        {row.modulos.length}
                                        <Typography component="span" sx={{ fontSize: '12px', color: 'text.secondary', fontWeight: 400 }}>
                                            {' / '}{TOTAL_MODULOS}
                                        </Typography>
                                    </Typography>
                                </TableCell>

                                <TableCell sx={cellSx}>
                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                        <Tooltip title={canManageModulos ? 'Gestionar módulos del rol' : 'Requiere rol SUPER_ADMIN'}>
                                            <span>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    disabled={!canManageModulos}
                                                    onClick={() => onGestionarModulos(row)}
                                                    startIcon={<EditOutlined sx={{ fontSize: 13 }} />}
                                                    sx={{
                                                        borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                                                        bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                                                        textTransform: 'none', px: 1.5,
                                                    }}
                                                >
                                                    Módulos
                                                </Button>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Eliminar rol (solo si no tiene usuarios)">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                disableElevation
                                                color="error"
                                                onClick={() => onDeleteRole(row.id)}
                                                sx={{ minWidth: 0, padding: '5px 10px', borderRadius: '8px' }}
                                            >
                                                <DeleteForeverOutlined sx={{ fontSize: 14 }} />
                                            </Button>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Box>
    );
};
