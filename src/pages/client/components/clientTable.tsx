import { EditOutlined, DeleteForeverOutlined } from "@mui/icons-material"
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Grid, TableHead, TableRow, TableCell, TableBody, Tooltip, ButtonGroup, Button, Chip, IconButton, Typography } from "@mui/material"
import { DataTable } from "../../../components"

const statusColor: Record<string, 'warning' | 'error' | 'success' | 'default'> = {
    LLAMAR: 'warning',
    CONTACTADO: 'success',
    VENCIDO: 'error',
};

const cellSx = { px: 1, py: 0.75 };

export const ClientTable = ({
    count,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    clients,
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
                            <TableCell sx={cellSx}>Nombre</TableCell>
                            <TableCell sx={cellSx}>Email</TableCell>
                            <TableCell sx={cellSx}>Teléfono</TableCell>
                            <TableCell sx={cellSx}>Ciudad</TableCell>
                            <TableCell sx={cellSx}>Dirección</TableCell>
                            <TableCell sx={cellSx}>Estado</TableCell>
                            <TableCell sx={cellSx}>Frecuencia</TableCell>
                            <TableCell sx={cellSx}>Compra</TableCell>
                            <TableCell sx={cellSx}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients?.length !== 0 ? clients?.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 130 }}>{row.fullname}</Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>{row.email}</Typography>
                                </TableCell>
                                <TableCell sx={cellSx}>{row.phone}</TableCell>
                                <TableCell sx={cellSx}>{row.city}</TableCell>
                                <TableCell sx={cellSx}>{row.address}</TableCell>
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
                                        : <Typography variant="caption" color="text.secondary">0 Días</Typography>
                                    }
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
                                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>No se encontraron datos</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </DataTable>
            </Grid>
        </Grid>
    )
}
