import { Button, Container, Grid, IconButton, MenuItem, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DataTable, UrlBreadCrumbs } from "../../components";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import timezonedDayjs from '../../utils/dayjs.util';
import { Dayjs } from "dayjs";
import { useState } from "react";

const currencies = [
    {
        value: 1,
        label: 'ADMINISTRADOR',
    },
    {
        value: 2,
        label: 'COMUN',
    },
    {
        value: 3,
        label: 'REPARTIDOR',
    }
];

export const EmployeePage = () => {


    const [value, setValue] = useState<Dayjs | null>(timezonedDayjs);
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
                > Empleados</Typography>

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
                        name="rut"
                        label="R.U.T"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="Nombres"
                        label="Nombres"
                    />
                    <TextField
                        fullWidth
                        size="small"
                        name="Apellidos"
                        label="Apellidos"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="Email"
                        label="Email"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="Sueldo"
                        label="Sueldo"
                    />

                    <LocalizationProvider
                        dateAdapter={AdapterDayjs} >
                        <DemoContainer
                            sx={{
                                marginTop: -1
                            }}
                            components={['DatePicker']}
                        >
                            <DatePicker
                                label="Fecha"
                                format="DD-MM-YYYY"
                                name="fecha"
                                value={value}
                                slotProps={{ textField: { size: 'small' } }}
                                onChange={(newValue) => setValue(newValue)}
                            />
                        </DemoContainer>
                    </LocalizationProvider>

                    <TextField
                        fullWidth
                        size="small"
                        name="Ciudad"
                        label="Ciudad"
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="Direccióm"
                        label="Direccióm"
                    />

                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Rol"
                        defaultValue="1"
                        size="small"
                        helperText="Selecciona un rol"
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

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

                <Typography
                > Empleados</Typography>
                <br></br>
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


export default EmployeePage;