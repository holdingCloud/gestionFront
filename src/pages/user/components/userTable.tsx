import { VerifiedUserOutlined, GppBadOutlined, EditOutlined, DeleteForeverOutlined } from "@mui/icons-material";
import { Grid, TableHead, TableRow, TableCell, TableBody, Tooltip, ButtonGroup, Button, Chip } from "@mui/material";
import { DataTable } from "../../../components";

const roleColor: Record<string, 'primary' | 'warning' | 'default'> = {
    ADMINISTRADOR: 'primary',
    REPARTIDOR: 'warning',
    COMUN: 'default',
};

const roleLabel: Record<string, string> = {
    ADMINISTRADOR: 'Administrador',
    REPARTIDOR: 'Repartidor',
    COMUN: 'Común',
};

const cellSx = { px: 1, py: 0.75 };

export const UserTable = ({
    count,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    users,
    handleActive,
    handleUpdate,
    handleDelete,
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
                padding: 2,
            }}
            item={true}
            xs={12}
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
                        <TableCell sx={cellSx}>Nombre</TableCell>
                        <TableCell sx={cellSx}>Email</TableCell>
                        <TableCell sx={cellSx}>Rol</TableCell>
                        <TableCell sx={cellSx} align="center">Estado</TableCell>
                        <TableCell sx={cellSx}>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users?.length > 0 ? users.map((row: any) => (
                        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={cellSx} component="th" scope="row">
                                {row.fullName}
                            </TableCell>
                            <TableCell sx={cellSx}>{row.email}</TableCell>
                            <TableCell sx={cellSx}>
                                <Chip
                                    label={roleLabel[row.rol] ?? row.rol ?? '-'}
                                    color={roleColor[row.rol] ?? 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell sx={cellSx} align="center">
                                {row.isActive ? (
                                    <Tooltip title="Activo — clic para desactivar" sx={{ cursor: 'pointer' }}>
                                        <VerifiedUserOutlined color="success" onClick={() => handleActive(row.id, false)} />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Inactivo — clic para activar" sx={{ cursor: 'pointer' }}>
                                        <GppBadOutlined color="error" onClick={() => handleActive(row.id, true)} />
                                    </Tooltip>
                                )}
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
                            <TableCell colSpan={5} sx={{ textAlign: 'center' }}>No se encontraron usuarios</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </DataTable>
        </Grid>
    );
};
