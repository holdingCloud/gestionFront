import { useEffect } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { DataTable } from '../../../components';
import { useInactiveClients } from '../hooks/useInactiveClients';
import { AlertLevel } from '../../../interfaces/report.interface';

const alertColor: Record<AlertLevel, 'success' | 'warning' | 'error'> = {
    NORMAL: 'success',
    ATENCION: 'warning',
    RIESGO: 'error',
};

const alertLabel: Record<AlertLevel, string> = {
    NORMAL: 'Normal',
    ATENCION: 'Atención',
    RIESGO: 'Riesgo',
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

const cellSx = { px: 1, py: 0.75 };

export const InactiveClientsReport = () => {
    const {
        data, loading,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    } = useInactiveClients();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const paginated = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Button variant="contained" onClick={fetchData} disabled={loading}>
                    Actualizar
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid
                    sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, margin: 0, padding: 2 }}
                    item xs={12}
                >
                    <DataTable
                        count={data.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell sx={cellSx}>Cliente</TableCell>
                                <TableCell sx={cellSx}>Comuna</TableCell>
                                <TableCell sx={cellSx} align="right">Frec. (días)</TableCell>
                                <TableCell sx={cellSx}>Última compra</TableCell>
                                <TableCell sx={cellSx} align="right">Días sin compra</TableCell>
                                <TableCell sx={cellSx} align="right">Desviación</TableCell>
                                <TableCell sx={cellSx} align="center">Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginated.length > 0 ? paginated.map(row => (
                                <TableRow key={row.clientId}>
                                    <TableCell sx={cellSx}>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{row.clientName}</Typography>
                                    </TableCell>
                                    <TableCell sx={cellSx}>
                                        <Typography variant="body2">{row.communeName}</Typography>
                                    </TableCell>
                                    <TableCell sx={cellSx} align="right">{row.frequency}</TableCell>
                                    <TableCell sx={cellSx}>
                                        <Typography variant="body2" noWrap>{formatDate(row.lastPurchaseDate)}</Typography>
                                    </TableCell>
                                    <TableCell sx={cellSx} align="right">{row.daysSinceLastPurchase}</TableCell>
                                    <TableCell sx={cellSx} align="right">{row.deviation}</TableCell>
                                    <TableCell sx={cellSx} align="center">
                                        <Chip
                                            label={alertLabel[row.alertLevel]}
                                            color={alertColor[row.alertLevel]}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                                        No hay clientes inactivos
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </DataTable>
                </Grid>
            )}
        </Box>
    );
};
