import { Box, ButtonGroup, Button, CircularProgress, Grid, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { EditOutlined, DeleteForeverOutlined } from "@mui/icons-material";
import { DataTable } from "../../../components";

const cellSx = { px: 1, py: 0.75 };

export const CompanyTable = ({
    companies,
    loading,
    updatedId,
    count,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleUpdate,
    handleDelete,
}: any) => {
    return (
        <Grid
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 10,
                height: '100%',
                margin: 1,
                padding: 2,
            }}
            item xs={12}
        >
            <DataTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            >
                <TableHead>
                    <TableRow>
                        <TableCell sx={cellSx}>Empresa</TableCell>
                        <TableCell sx={cellSx}>Descripción</TableCell>
                        <TableCell sx={cellSx} align="center">N° Clientes</TableCell>
                        <TableCell sx={cellSx}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={4} sx={{ py: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress />
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : companies?.length > 0 ? companies.map((row: any) => (
                        <TableRow key={row.id} sx={{
                            transition: 'background-color 0.6s ease',
                            backgroundColor: row.id === updatedId ? 'rgba(16,185,129,0.10)' : undefined,
                        }}>
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                                    {row.name}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 300, color: row.description ? 'text.primary' : 'text.disabled' }}>
                                    {row.description ?? '—'}
                                </Typography>
                            </TableCell>
                            <TableCell sx={cellSx} align="center">
                                <Typography variant="body2">{row._count?.clients ?? 0}</Typography>
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
                            <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                                No se encontraron empresas
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Grid>
    );
};
