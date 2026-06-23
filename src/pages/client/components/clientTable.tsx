import { EditOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
    Box, CircularProgress, Link, TableHead, TableRow, TableCell,
    TableBody, Tooltip, Chip, IconButton, Typography, Avatar,
} from '@mui/material';
import { DataTable } from '../../../components';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { ClientResponse } from '../../../interfaces/client.interface';

const AVATAR_COLORS = [
    '#5b7cf6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

const STATUS_CHIP_SX: Record<string, object> = {
    LLAMAR:     { bgcolor: '#fff7ed', color: '#c2410c', fontWeight: 700, border: '1px solid #fed7aa' },
    CONTACTADO: { bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 700, border: '1px solid #bbf7d0' },
    VENCIDO:    { bgcolor: '#fff1f2', color: '#be123c', fontWeight: 700, border: '1px solid #fecdd3' },
};

function formatAddress(dir: ClientResponse['direccion']): string {
    if (!dir) return '';
    const parts = [dir.calle];
    if (dir.numero) parts.push(dir.numero);
    return parts.join(' ');
}

function getClientSubtitle(row: ClientResponse): string {
    const city = row.direccion?.commune?.name;
    const address = formatAddress(row.direccion);
    if (city && address) return `${city} · ${address}`;
    if (city) return city;
    return address;
}

function formatPhone(phone: string): string {
    const trimmed = phone.trim();
    if (trimmed.startsWith('+56')) return trimmed;
    const digits = trimmed.replace(/\D/g, '');
    if (digits.startsWith('56')) return `+${digits}`;
    return `+56${digits}`;
}

function buildWhatsAppUrl(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('56') ? digits : `56${digits}`;
    return `https://wa.me/${number}`;
}

function formatDate(iso: string | null): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getLastPurchaseDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs.map((f: any) => f.actualPurchaseDate).filter(Boolean).sort().reverse();
    return dates[0] ?? null;
}

function getNextEstimatedDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs.map((f: any) => f.nextEstimatedDate).filter(Boolean).sort();
    return dates[0] ?? null;
}

interface ClientTableProps {
    count: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clients: ClientResponse[];
    loading: boolean;
    handleUpdate: (row: ClientResponse) => void;
    handleDelete: (id: number) => void;
    handlePurchases: (id: number, name: string) => void;
    onAiMessage: (client: ClientResponse) => void;
}

export const ClientTable = ({
    count, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
    clients, loading, handleUpdate, handleDelete, handlePurchases, onAiMessage,
}: ClientTableProps) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const cellSx = {
        px: 1.5,
        py: 0.9,
        whiteSpace: 'nowrap' as const,
        borderBottom: `1px solid ${t.border}`,
    };
    const headSx = {
        ...cellSx,
        fontWeight: 700,
        fontSize: '11.5px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.7px',
    };

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
                        <TableCell sx={{ ...headSx, width: '100%', minWidth: 180 }}>Cliente</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 100, whiteSpace: 'nowrap' }}>Referencia</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 148, whiteSpace: 'nowrap' }}>Teléfono</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 120, whiteSpace: 'nowrap' }}>Empresa</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 90,  whiteSpace: 'nowrap' }}>Estado</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 100, whiteSpace: 'nowrap' }}>Frecuencia</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 108, whiteSpace: 'nowrap' }}>Fecha estimada</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 54,  whiteSpace: 'nowrap' }} align="center">Compra</TableCell>
                        <TableCell sx={{ ...headSx, minWidth: 168, whiteSpace: 'nowrap' }}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={9} sx={{ py: 6, border: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : clients?.length !== 0 ? clients?.map((row: any) => {
                        const subtitle = getClientSubtitle(row);
                        const lastPurchase = getLastPurchaseDate(row);
                        const nextEstimated = getNextEstimatedDate(row);
                        return (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}
                            >
                                {/* CLIENTE */}
                                <TableCell component="th" scope="row" sx={cellSx}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{
                                            width: 34, height: 34, flexShrink: 0,
                                            bgcolor: getAvatarColor(row.fullname),
                                            fontSize: '12px', fontWeight: 700,
                                        }}>
                                            {getInitials(row.fullname)}
                                        </Avatar>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight={600} noWrap sx={{ lineHeight: 1.3 }}>
                                                {row.fullname}
                                            </Typography>
                                            {subtitle && (
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', lineHeight: 1.3 }}>
                                                    {subtitle}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </TableCell>

                                {/* REFERENCIA */}
                                <TableCell sx={cellSx}>
                                    <Typography
                                        variant="body2"
                                        noWrap
                                        color={row.direccion?.referencia ? 'text.primary' : 'text.disabled'}
                                    >
                                        {row.direccion?.referencia ?? '—'}
                                    </Typography>
                                </TableCell>

                                {/* TELÉFONO */}
                                <TableCell sx={cellSx}>
                                    {row.phone ? (
                                        <Tooltip title="Abrir WhatsApp">
                                            <Link
                                                href={buildWhatsAppUrl(row.phone)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                underline="hover"
                                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#25D366', width: 'fit-content' }}
                                            >
                                                <WhatsAppIcon fontSize="small" />
                                                <Typography variant="body2" noWrap>
                                                    {formatPhone(row.phone)}
                                                </Typography>
                                            </Link>
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="body2" color="text.disabled">-</Typography>
                                    )}
                                </TableCell>

                                {/* EMPRESA */}
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap color={row.company?.name ? 'text.primary' : 'text.disabled'}>
                                        {row.company?.name ?? '—'}
                                    </Typography>
                                </TableCell>

                                {/* ESTADO */}
                                <TableCell sx={cellSx}>
                                    <Chip
                                        label={row.contactStatus ?? '-'}
                                        size="small"
                                        sx={{
                                            borderRadius: '20px',
                                            fontSize: '11.5px',
                                            height: '22px',
                                            ...(STATUS_CHIP_SX[row.contactStatus] ?? {}),
                                        }}
                                    />
                                </TableCell>

                                {/* FRECUENCIA */}
                                <TableCell sx={cellSx}>
                                    {row.frequency != null ? (
                                        <Box>
                                            <Typography variant="body2" fontWeight={700} noWrap sx={{ lineHeight: 1.3 }}>
                                                {row.frequency} días
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', lineHeight: 1.3 }}>
                                                Últ: {formatDate(lastPurchase)}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">-</Typography>
                                    )}
                                </TableCell>

                                {/* FECHA ESTIMADA */}
                                <TableCell sx={cellSx}>
                                    <Typography variant="caption" noWrap>
                                        {formatDate(nextEstimated)}
                                    </Typography>
                                </TableCell>

                                {/* COMPRA */}
                                <TableCell sx={cellSx} align="center">
                                    <Tooltip title="Ver y registrar compras">
                                        <IconButton
                                            size="small"
                                            color="secondary"
                                            onClick={() => handlePurchases(row.id, row.fullname)}
                                        >
                                            <ShoppingCartOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>

                                {/* ACCIONES */}
                                <TableCell sx={cellSx}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {/* Mensaje IA */}
                                        <Box
                                            onClick={() => onAiMessage(row)}
                                            sx={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '5px 10px', borderRadius: '8px', cursor: 'pointer',
                                                background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                                                color: '#fff', fontWeight: 700, fontSize: '11.5px',
                                                boxShadow: `0 3px 10px rgba(14,159,140,.22)`,
                                                userSelect: 'none', transition: 'opacity .15s',
                                                '&:hover': { opacity: 0.88 },
                                            }}
                                        >
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3" />
                                                <circle cx="12" cy="12" r="3.2" />
                                            </svg>
                                            Mensaje IA
                                        </Box>
                                        {/* Edit */}
                                        <Tooltip title="Editar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleUpdate(row)}
                                                sx={{ color: '#2f6df6', '&:hover': { bgcolor: 'rgba(47,109,246,.08)' } }}
                                            >
                                                <EditOutlined sx={{ fontSize: 17 }} />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Delete */}
                                        <Tooltip title="Eliminar">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(row.id)}
                                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,.08)' } }}
                                            >
                                                <DeleteForeverOutlined sx={{ fontSize: 17 }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={9} sx={{ textAlign: 'center', py: 5, color: 'text.secondary', border: 0 }}>
                                No se encontraron datos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Box>
    );
};
