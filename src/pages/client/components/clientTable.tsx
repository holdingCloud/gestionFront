import { EditOutlined, DeleteForeverOutlined } from "@mui/icons-material"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Box, CircularProgress, Grid, TableHead, TableRow, TableCell, TableBody, Tooltip, ButtonGroup, Button, Chip, IconButton, Typography } from "@mui/material"
import { DataTable } from "../../../components"

const statusColor: Record<string, 'warning' | 'error' | 'success' | 'default'> = {
    LLAMAR: 'warning',
    CONTACTADO: 'success',
    VENCIDO: 'error',
};

const cellSx = { px: 1, py: 0.75 };

function formatDate(iso: string | null): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getNextEstimatedDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs
        .map((f: any) => f.nextEstimatedDate)
        .filter(Boolean)
        .sort();
    return dates[0] ?? null;
}

function getLastPurchaseDate(row: any): string | null {
    const freqs: any[] = row.frequencies ?? [];
    const dates = freqs
        .map((f: any) => f.actualPurchaseDate)
        .filter(Boolean)
        .sort()
        .reverse();
    return dates[0] ?? null;
}

export const ClientTable = ({
    count,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    clients,
    loading,
    handleUpdate,
    handleDelete,
    handlePurchases,
}: any) => {
    return (
        <Grid
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 10,
                borderColor: '#ccc',
                height: '100%',
                margin: 1,
                padding: 2
            }}
            item={true}
            xs={12} sm={12} md={12} lg={12}
        >
            <Grid item={true} xs={12}>
                <DataTable
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={cellSx}>Comuna</TableCell>
                            <TableCell sx={cellSx}>Dirección</TableCell>
                            <TableCell sx={cellSx}>Referencia</TableCell>
                            <TableCell sx={cellSx}>Teléfono</TableCell>
                            <TableCell sx={cellSx}>Nombre</TableCell>
                            <TableCell sx={cellSx}>Empresa</TableCell>
                            <TableCell sx={cellSx}>Estado</TableCell>
                            <TableCell sx={cellSx}>Frecuencia</TableCell>
                            <TableCell sx={cellSx}>Última compra</TableCell>
                            <TableCell sx={cellSx}>Fecha estimada</TableCell>
                            <TableCell sx={cellSx} align="center">Compra</TableCell>
                            <TableCell sx={cellSx}>Acciones</TableCell>
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
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                        {row.commune?.name ?? '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                                        {row.address}{row.n_depto_casa ? `, ${row.n_depto_casa}` : ''}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 130 }} color={row.referencia ? 'text.primary' : 'text.disabled'}>
                                        {row.referencia ?? '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 130 }}>{row.phone}</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row" sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>{row.fullname}</Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 130 }} color={row.company?.name ? 'text.primary' : 'text.disabled'}>
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
                                        ? <Typography variant="caption" fontWeight={600}>{row.frequency} Días</Typography>
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
                                    <ButtonGroup disableElevation variant="contained" size="small">
                                        <Button onClick={() => handleUpdate(row)}><EditOutlined /></Button>
                                        <Button color="error" onClick={() => handleDelete(row.id)}><DeleteForeverOutlined /></Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={12} sx={{ textAlign: 'center' }}>No se encontraron datos</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </DataTable>
            </Grid>
        </Grid>
    )
}
