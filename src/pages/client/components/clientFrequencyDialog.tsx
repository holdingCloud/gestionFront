import {
    Box, Chip, CircularProgress, Dialog, DialogContent,
    DialogTitle, Divider, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { ClientFrequency, FrequencyStatus } from '../../../interfaces/client.interface';
import { ClientService } from '../../../services';

const frequencyColor: Record<FrequencyStatus, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
    NUEVO: 'info',
    EN_PLAZO: 'success',
    POR_VENCER: 'warning',
    VENCIDO: 'error',
};

const frequencyLabel: Record<FrequencyStatus, string> = {
    NUEVO: 'Nuevo',
    EN_PLAZO: 'En plazo',
    POR_VENCER: 'Por vencer',
    VENCIDO: 'Vencido',
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
    open: boolean;
    clientId: number;
    clientName: string;
    onClose: () => void;
}

export const ClientFrequencyDialog = ({ open, clientId, clientName, onClose }: Props) => {
    const [rows, setRows] = useState<ClientFrequency[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        ClientService.getClientFrequency(clientId)
            .then(setRows)
            .catch(() => setRows([]))
            .finally(() => setLoading(false));
    }, [open, clientId]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>Frecuencia de compras</Typography>
                    <Typography variant="caption" color="text.secondary">{clientName}</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : rows.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                            Sin registros de frecuencia para este cliente.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell><b>Producto</b></TableCell>
                                    <TableCell align="center"><b>Compras</b></TableCell>
                                    <TableCell align="center"><b>Prom. días</b></TableCell>
                                    <TableCell align="center"><b>Días desde compra</b></TableCell>
                                    <TableCell align="center"><b>Último registro</b></TableCell>
                                    <TableCell align="center"><b>Próx. estimada</b></TableCell>
                                    <TableCell align="center"><b>Estado</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>
                                            {row.product
                                                ? <Box>
                                                    <Typography variant="body2" fontWeight={500}>{row.product.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{row.product.code}</Typography>
                                                  </Box>
                                                : `ID ${row.productsId}`}
                                        </TableCell>
                                        <TableCell align="center">{row.purchaseCount}</TableCell>
                                        <TableCell align="center">
                                            {row.avgDaysBetweenPurchases != null
                                                ? `${Math.round(row.avgDaysBetweenPurchases)} días`
                                                : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.daysSinceLastPurchase != null
                                                ? `${row.daysSinceLastPurchase} días`
                                                : '—'}
                                        </TableCell>
                                        <TableCell align="center">{formatDate(row.lastPurchaseDate)}</TableCell>
                                        <TableCell align="center">{formatDate(row.nextEstimatedDate)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={frequencyLabel[row.status]}
                                                color={frequencyColor[row.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>
    );
};
