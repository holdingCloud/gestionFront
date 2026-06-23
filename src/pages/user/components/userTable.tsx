import { EditOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import {
    Box, CircularProgress, TableHead, TableRow, TableCell,
    TableBody, Button, Tooltip, Typography,
} from '@mui/material';
import { DataTable } from '../../../components';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { Users } from '../../../interfaces';

const ROLE_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
    ADMINISTRADOR: { label: 'Administrador', bg: 'rgba(14,159,140,.14)', color: '#0e9f8c' },
    REPARTIDOR:    { label: 'Repartidor',    bg: 'rgba(224,145,63,.14)', color: '#e0913f' },
    COMUN:         { label: 'Común',          bg: 'rgba(124,114,100,.12)', color: '#7c7264' },
};

const headSx = {
    px: 1.5, py: 1,
    fontWeight: 700, fontSize: '11px',
    textTransform: 'uppercase' as const, letterSpacing: '0.7px',
};
const cellSx = { px: 1.5, py: 1 };

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS = [
    '#0e9f8c', '#2f6df6', '#e0913f', '#d9583f', '#2f9e6f',
    '#7c5cbf', '#c2185b', '#0288d1',
];

function getAvatarColor(id: number): string {
    return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

interface UserTableProps {
    count: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    users: Users[];
    loading?: boolean;
    handleActive: (id: number, status: boolean) => void;
    handleUpdate: (row: Users) => void;
    handleDelete: (id: number) => void;
}

export const UserTable = ({
    count, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
    users, loading, handleActive, handleUpdate, handleDelete,
}: UserTableProps) => {
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
            <DataTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={headSx}>Usuario</TableCell>
                        <TableCell sx={headSx}>Rol</TableCell>
                        <TableCell sx={headSx} align="center">Actividad</TableCell>
                        <TableCell sx={headSx} align="center">Estado</TableCell>
                        <TableCell sx={headSx}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : users?.length > 0 ? users.map((row) => {
                        const roleConf = ROLE_CONFIG[row.rol] ?? { label: row.rol, bg: 'rgba(124,114,100,.12)', color: t.muted };
                        const avatarColor = getAvatarColor(row.id);

                        return (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                                {/* Avatar + Nombre + Email */}
                                <TableCell sx={cellSx}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Box sx={{
                                            width: 38, height: 38, borderRadius: '11px', flexShrink: 0,
                                            background: `linear-gradient(135deg,${avatarColor},${avatarColor}aa)`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '13px', color: '#fff',
                                        }}>
                                            {getInitials(row.fullName)}
                                        </Box>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '13.5px', color: 'text.primary', lineHeight: 1.2 }}>
                                                {row.fullName}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: '2px' }}>
                                                {row.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* Rol */}
                                <TableCell sx={cellSx}>
                                    <Box sx={{
                                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                                        padding: '4px 10px', borderRadius: '8px',
                                        bgcolor: roleConf.bg, color: roleConf.color,
                                        fontSize: '12px', fontWeight: 700,
                                    }}>
                                        {roleConf.label}
                                    </Box>
                                </TableCell>

                                {/* Actividad — isLoged */}
                                <TableCell sx={cellSx} align="center">
                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                        <Box sx={{
                                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                            bgcolor: row.isLoged ? t.success : t.border,
                                            boxShadow: row.isLoged ? `0 0 0 3px ${t.success}30` : 'none',
                                        }} />
                                        <Typography sx={{
                                            fontSize: '12px', fontWeight: 600,
                                            color: row.isLoged ? t.success : 'text.secondary',
                                        }}>
                                            {row.isLoged ? 'En sesión' : 'Desconectado'}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Estado — isActive toggle */}
                                <TableCell sx={cellSx} align="center">
                                    <Tooltip title={row.isActive ? 'Activo — clic para desactivar' : 'Inactivo — clic para activar'}>
                                        <Box
                                            onClick={() => handleActive(row.id, !row.isActive)}
                                            sx={{
                                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                padding: '4px 10px', borderRadius: '8px', cursor: 'pointer',
                                                bgcolor: row.isActive ? `${t.success}18` : `${t.danger}12`,
                                                color: row.isActive ? t.success : t.danger,
                                                border: `1.5px solid ${row.isActive ? t.success : t.danger}44`,
                                                fontSize: '12px', fontWeight: 700, userSelect: 'none',
                                                transition: 'all .15s',
                                            }}
                                        >
                                            <Box sx={{
                                                width: 6, height: 6, borderRadius: '50%',
                                                bgcolor: row.isActive ? t.success : t.danger,
                                            }} />
                                            {row.isActive ? 'Activo' : 'Inactivo'}
                                        </Box>
                                    </Tooltip>
                                </TableCell>

                                {/* Acciones */}
                                <TableCell sx={cellSx}>
                                    <Box sx={{ display: 'flex', gap: '5px' }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disableElevation
                                            onClick={() => handleUpdate(row)}
                                            sx={{
                                                minWidth: 0, padding: '5px 10px', borderRadius: '8px',
                                                bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                                            }}
                                        >
                                            <EditOutlined sx={{ fontSize: 14 }} />
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disableElevation
                                            color="error"
                                            onClick={() => handleDelete(row.id)}
                                            sx={{ minWidth: 0, padding: '5px 10px', borderRadius: '8px' }}
                                        >
                                            <DeleteForeverOutlined sx={{ fontSize: 14 }} />
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                No se encontraron usuarios
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Box>
    );
};
