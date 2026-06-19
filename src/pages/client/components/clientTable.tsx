import { EditOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
    Box, CircularProgress, Link, TableHead, TableRow, TableCell,
    TableBody, Tooltip, Button, Chip, IconButton, Typography,
} from '@mui/material';
import { DataTable } from '../../../components';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { ClientResponse } from '../../../interfaces/client.interface';

const statusColor: Record<string, 'warning' | 'error' | 'success' | 'default'> = {
    LLAMAR: 'warning',
    CONTACTADO: 'success',
    VENCIDO: 'error',
};

const cellSx = { px: 1, py: 0.75, whiteSpace: 'nowrap' as const };
const headSx = { ...cellSx, fontWeight: 700, fontSize: '11.5px', textTransform: 'uppercase' as const, letterSpacing: '0.7px' };

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

function getNextEstimatedDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs.map((f: any) => f.nextEstimatedDate).filter(Boolean).sort();
    return dates[0] ?? null;
}

function getLastPurchaseDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs.map((f: any) => f.actualPurchaseDate).filter(Boolean).sort().reverse();
    return dates[0] ?? null;
}

interface ClientTableProps {
    count: number;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
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
                        <TableCell sx={headSx}>Nombre</TableCell>
                        <TableCell sx={headSx}>Dirección</TableCell>
                        <TableCell sx={headSx}>Referencia</TableCell>
                        <TableCell sx={headSx}>Teléfono</TableCell>
                        <TableCell sx={headSx}>Comuna</TableCell>
                        <TableCell sx={headSx}>Empresa</TableCell>
                        <TableCell sx={headSx}>Estado</TableCell>
                        <TableCell sx={headSx}>Frecuencia</TableCell>
                        <TableCell sx={headSx}>Última compra</TableCell>
                        <TableCell sx={headSx}>Fecha estimada</TableCell>
                        <TableCell sx={headSx} align="center">Compra</TableCell>
                        <TableCell sx={headSx}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={12} sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : clients?.length !== 0 ? clients?.map((row: any) => (
                        <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" sx={cellSx}>
                                <Typography variant="body2" noWrap fontWeight={500}>{row.fullname}</Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap>
                                    {row.address}{row.n_depto_casa ? `, ${row.n_depto_casa}` : ''}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap color={row.referencia ? 'text.primary' : 'text.disabled'}>
                                    {row.referencia ?? '-'}
                                </Typography>
                            </TableCell>
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
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap>
                                    {row.commune?.name ?? '-'}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap color={row.company?.name ? 'text.primary' : 'text.disabled'}>
                                    {row.company?.name ?? '—'}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Chip
                                    label={row.contactStatus ?? '-'}
                                    color={statusColor[row.contactStatus] ?? 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell sx={cellSx}>
                                {row.frequency != null
                                    ? <Typography variant="caption" fontWeight={600} noWrap sx={{ fontFamily: "'JetBrains Mono', monospace" }}>{row.frequency}d</Typography>
                                    : <Typography variant="caption" color="text.secondary">-</Typography>
                                }
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="caption" noWrap>
                                    {formatDate(getLastPurchaseDate(row))}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="caption" noWrap>
                                    {formatDate(getNextEstimatedDate(row))}
                                </Typography>
                            </TableCell>
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
                            <TableCell sx={cellSx}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {/* Mensaje IA */}
                                    <Box
                                        onClick={() => onAiMessage(row)}
                                        sx={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '5px 9px', borderRadius: '8px', cursor: 'pointer',
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
                                        IA
                                    </Box>
                                    {/* Edit */}
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disableElevation
                                        onClick={() => handleUpdate(row)}
                                        sx={{
                                            minWidth: 0, padding: '5px 8px', borderRadius: '8px',
                                            bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                                        }}
                                    >
                                        <EditOutlined sx={{ fontSize: 14 }} />
                                    </Button>
                                    {/* Delete */}
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disableElevation
                                        color="error"
                                        onClick={() => handleDelete(row.id)}
                                        sx={{ minWidth: 0, padding: '5px 8px', borderRadius: '8px' }}
                                    >
                                        <DeleteForeverOutlined sx={{ fontSize: 14 }} />
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={12} sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
                                No se encontraron datos
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Box>
    );
};
