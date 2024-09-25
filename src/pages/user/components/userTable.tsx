import { VerifiedUserOutlined, GppBadOutlined, EditOutlined, DeleteForeverOutlined } from "@mui/icons-material"
import { Grid, TableHead, TableRow, TableCell, TableBody, Tooltip, ButtonGroup, Button } from "@mui/material"
import { DataTable } from "../../../components"


export const UserTable = ({
    count,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    users,
    handleActive,
    handleUpdate,
    handleDelete
}: any) => {

    console.log(users)

    return (
        <Grid
            sx={{
                bgcolor: '#FFF',
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

            <Grid item={true} xs={12} >

                <DataTable
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage} >
                    <TableHead>
                        <TableRow>
                            <TableCell>Usuario</TableCell>
                            <TableCell >Nombre completo</TableCell>
                            <TableCell >Email</TableCell>
                            <TableCell >Avatar</TableCell>
                            <TableCell >Estado</TableCell>
                            <TableCell >Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(users?.length != 0) ? users?.map((row: any) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.userName}
                                </TableCell>
                                <TableCell >{row.fullName}</TableCell>
                                <TableCell >{row.email}</TableCell>
                                <TableCell >{row.avatar}</TableCell>
                                <TableCell >{
                                    row.isActive ?
                                        (<Tooltip onClick={() => handleActive(row.id, false)} title="ACTIVO" sx={{ cursor: "pointer" }}>
                                            <VerifiedUserOutlined color='success' />
                                        </Tooltip>)
                                        : (<Tooltip onClick={() => handleActive(row.id, true)} title="INACTIVO" sx={{ cursor: "pointer" }} >
                                            <GppBadOutlined color='error' />
                                        </Tooltip>)
                                }</TableCell>
                                <TableCell
                                ><ButtonGroup
                                    disableElevation
                                    variant="contained"
                                    aria-label="Disabled button group"

                                >
                                        <Button onClick={() => handleUpdate(row)}><EditOutlined /></Button>
                                        <Button color="error" onClick={() => handleDelete(row.id)}><DeleteForeverOutlined /></Button>
                                    </ButtonGroup></TableCell>
                            </TableRow>
                        )) : <TableRow >
                            <TableCell colSpan={6} sx={{
                                textAlign: 'center'
                            }}>No se encontraron datos</TableCell>
                        </TableRow>}
                    </TableBody>
                </DataTable>

            </Grid>

        </Grid>
    )
}
