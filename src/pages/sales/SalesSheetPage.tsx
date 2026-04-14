import { Autocomplete, Button, Container, Grid, IconButton, MenuItem, TextField } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import timezonedDayjs from '../../utils/dayjs.util';
import { Dayjs } from "dayjs";
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { BillModal } from "./components/BillModal";


const currencies = [
    {
        value: 1,
        label: 'repartidor 1',
    },
    {
        value: 2,
        label: 'repartidor 2',
    },
    {
        value: 3,
        label: 'repartidor 3',
    }
];

export const salesSheet = () => {


    const [value, setValue] = useState<Dayjs | null>(timezonedDayjs);
    const [open, setOpen] = useState<boolean>(false);


    const to = useNavigate();

    const handleBack = () => {
        to('/dashboard');
    }

    const handleModal = () => {
        setOpen(true)
    }

    const onClose = (action: boolean) => {
        console.log(action)
        setOpen(false);

    }

    return (
        <Container
            maxWidth={false} disableGutters>

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    margin: 2,
                    padding: 5
                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
            >
                <IconButton
                    color="primary"
                    sx={{
                        marginTop: -7,
                        marginLeft: -4
                    }}
                    onClick={handleBack} aria-label="delete">
                    <ArrowBackIcon />
                </IconButton>
                <Typography
                    sx={{
                        marginTop: -7,
                        marginLeft: 3,
                        fontSize: 20
                    }} > Hoja de ventas</Typography>
                <br></br>
                <Grid item={true} xs={12}
                    component="form"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
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


                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Repartidor"
                        defaultValue="1"
                        size="small"
                        helperText="Selecciona un repartidor"
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        size="small"
                        name="description"
                        label="Observación"
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


                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        size="small"
                        onClick={handleModal}>
                        Otros Gastos
                    </Button>

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
                    margin: 2,
                    padding: 5,
                    '& .MuiButton-root': {
                        marginLeft: 1,
                        width: '5ch'
                    }
                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
            >
                <Typography
                    fontWeight={"bold"}
                    sx={{
                        marginTop: -4,
                        marginLeft: 1,
                        fontSize: 20
                    }} > Repartidor: 1</Typography>
                <br />
                <Grid
                    sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{
                            display: 'inline'
                        }}
                        size="small"
                        renderInput={(params) =>
                            <TextField
                                sx={{
                                    marginLeft: 1,
                                    width: '60ch'
                                }}
                                {...params} label="Buscar cliente" />}
                    />

                    <TextField
                        id="outlined-select-currency"
                        sx={{
                            marginLeft: 1,
                            width: '40ch'
                        }}
                        select
                        label="Producto"
                        defaultValue="1"
                        size="small"
                        helperText="Seleccionar producto"
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        sx={{
                            marginLeft: 1,
                            width: '10ch'
                        }}
                        fullWidth
                        name="quantity"
                        label="Cantidad"
                        size="small"
                    />

                    <TextField
                        sx={{
                            marginLeft: 1,
                            width: '20ch'
                        }}
                        fullWidth
                        name="discount"
                        label="descuento"
                        size="small"
                    />

                    <Button
                        sx={{
                            height: '40px'
                        }}
                        variant="contained"
                        type="submit"
                        color="primary">
                        <AddIcon />
                    </Button>
                </Grid>

            </Grid>

            <BillModal
                title={'Agregar una cuenta en hoja de ventas'}
                content={'Con esta acción borrara al usuario de forma permanente'}
                open={open}
                onClose={onClose} />

        </Container>
    )
}

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
];


export default salesSheet;