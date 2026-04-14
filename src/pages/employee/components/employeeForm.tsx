import { Grid, DialogContent, DialogContentText, TextField, DialogActions, Button, MenuItem } from "@mui/material"
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
    cancelUpdate,
    setFieldValue }: any) => {


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
                        value={values.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}
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
                        <DatePicker
                            label="Fecha de contrato"
                            format="DD-MM-YYYY"
                            name="hireDate"
                            value={value}
                            slotProps={{ textField: { size: 'small' } }}
                            onChange={
                                (newValue) => {
                                    setValue(newValue);
                                    setFieldValue("hireDate", newValue?.format('DD-MM-YYYY'));
                                }
                            }


                        />

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
                        name="address"
                        label="Dirección"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                    />


                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Función"
                        name="type"
                        size="small"
                        value={values.type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.type && Boolean(errors.type)}
                        helperText={touched.type && errors.type}
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option.label}>
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
