import { Grid, DialogContent, DialogContentText, TextField, InputAdornment, IconButton, DialogActions, Button, MenuItem } from "@mui/material"

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import { useState } from "react";
import timezonedDayjs from "../../../utils/dayjs.util";

export const EmployeeForm = ({
    onSetCreateModal,
    handleSubmit,
    values,
    touched,
    handleChange,
    handleBlur,
    errors,
    hiddeButton,
    saveUpdate,
    cancelUpdate }: any) => {


    const [value, setValue] = useState<Dayjs | null>(timezonedDayjs);

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



    return (
        <Grid item={true} xs={12}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& .MuiTextField-root': {
                    m: 1,
                    width: '25ch',
                },
                '& .MuiButton-root': {
                    m: 1,
                    width: '20ch',
                },
            }}
            noValidate
            autoComplete="off">
            <DialogContent>
                <DialogContentText>

                    <TextField
                        fullWidth
                        size="small"
                        name="rut"
                        label="RUT"
                        value={values.rut}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.rut && Boolean(errors.rut)}
                        helperText={touched.rut && errors.rut}
                    />


                    <TextField
                        fullWidth
                        size="small"
                        name="fullName"
                        label="Nombre completo"
                        value={values.fullname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fullname && Boolean(errors.fullname)}
                        helperText={touched.fullname && errors.fullname}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="salary"
                        label="Sueldo"
                        value={values.salary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.salary && Boolean(errors.salary)}
                        helperText={touched.salary && errors.salary}
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
                                label="Fecha de contrato"
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
                        name="city"
                        label="Ciudad"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                    />

                    <TextField
                        fullWidth
                        size="small"
                        name="Dirección"
                        label="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                    />

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




                </DialogContentText>
            </DialogContent>



            <DialogActions>
                {hiddeButton ? <Button
                    variant="contained"
                    type="submit"
                    color="primary">
                    Guardar
                </Button> :
                    <Button
                        variant="contained"
                        type="button"
                        color="info"
                        onClick={saveUpdate}>
                        Editar
                    </Button>
                }
                <Button autoFocus variant="outlined" onClick={() => {
                    onSetCreateModal(false)
                    cancelUpdate()
                }}>
                    Cancelar
                </Button>

            </DialogActions>

        </Grid>
    )
}
