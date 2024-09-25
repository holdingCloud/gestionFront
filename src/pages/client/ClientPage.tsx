import { Button, Container, Grid, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DataTable, UrlBreadCrumbs } from "../../components";


export const ClientPage = () => {
    return (
        <Container
            maxWidth={false} disableGutters>

            <UrlBreadCrumbs />

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    margin: 1,
                    padding: 2,

                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
            >

                <Typography
                > Clientes</Typography>

                <Grid item={true} xs={12}
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {
                            m: 1,
                            width: '25ch'
                        },
                        '& .MuiButton-root': {
                            m: 1,
                            width: '30ch',
                            height: '40px'
                        },
                    }}
                    noValidate
                    autoComplete="off">


                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        size="small">
                        Crear
                    </Button>



                </Grid>
            </Grid>

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    margin: 1,
                    padding: 2,

                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
            >


                <Grid item={true} xs={12}
                    component="form"
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        '& .MuiTextField-root': {
                            marginLeft: 1,
                            width: '30ch'
                        },
                        '& .MuiButton-root': {
                            marginLeft: 1,
                            width: '20ch',
                            height: '40px'
                        },
                    }}
                    noValidate
                    autoComplete="off">

                    <DataTable>
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
                            <TableRow>
                                <TableCell>as</TableCell>
                                <TableCell>a</TableCell>
                                <TableCell>as</TableCell>
                                <TableCell>as</TableCell>
                                <TableCell>as</TableCell>
                                <TableCell>as</TableCell>
                            </TableRow>
                        </TableBody>
                    </DataTable>



                </Grid>
            </Grid>


        </Container>
    )
}


export default ClientPage;