import { Grid, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material"

const formatChileanPhone = (raw: string): string => {
    // Keep only digits
    let digits = raw.replace(/\D/g, '');

    // Strip country code if the user typed it
    if (digits.startsWith('569')) digits = digits.slice(2);
    else if (digits.startsWith('56')) digits = digits.slice(2);

    // Limit to 9 digits (mobile prefix digit + 8 number digits)
    digits = digits.slice(0, 9);

    if (!digits) return '';

    const first = digits[0];       // e.g. "9"
    const rest  = digits.slice(1); // e.g. "95720483"

    if (!rest) return `+56 ${first}`;
    return `+56 ${first} ${rest}`;
};

export const ClientForm = ({
    onSetCreateModal,
    handleSubmit,
    values,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    hiddeButton,
    saveUpdate,
    cancelUpdate
}: any) => {

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatChileanPhone(e.target.value);
        setFieldValue('phone', formatted);
    };

    return (
        <Grid
            item={true}
            xs={12}
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                '& .MuiButton-root': { m: 1, width: '20ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <DialogContent>
                <DialogContentText>
                    <TextField
                        fullWidth size="small" name="fullname" label="Nombre completo"
                        value={values.fullname} onChange={handleChange} onBlur={handleBlur}
                        error={touched.fullname && Boolean(errors.fullname)}
                        helperText={touched.fullname && errors.fullname}
                    />
                    <TextField
                        fullWidth size="small" name="email" label="Email"
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />
                    <TextField
                        fullWidth size="small" name="phone" label="Teléfono"
                        placeholder="+56 9 XXXXXXXX"
                        value={values.phone}
                        onChange={handlePhoneChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={(touched.phone && errors.phone) || 'Ej: +56 9 95720483'}
                        inputProps={{ maxLength: 15 }}
                    />
                    <TextField
                        fullWidth size="small" name="city" label="Ciudad"
                        value={values.city} onChange={handleChange} onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                    />
                    <TextField
                        fullWidth size="small" name="address" label="Dirección"
                        value={values.address} onChange={handleChange} onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                    />
                    {hiddeButton && (
                        <TextField
                            fullWidth size="small" name="frequency" label="Frecuencia (días)"
                            type="number"
                            value={values.frequency ?? ''}
                            onChange={handleChange} onBlur={handleBlur}
                            inputProps={{ min: 1 }}
                            helperText="Opcional — días de frecuencia de compra"
                        />
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {hiddeButton
                    ? <Button variant="contained" type="submit" color="primary">Guardar</Button>
                    : <Button variant="contained" type="button" color="info" onClick={saveUpdate}>Editar</Button>
                }
                <Button autoFocus variant="outlined" onClick={() => { onSetCreateModal(false); cancelUpdate(); }}>
                    Cancelar
                </Button>
            </DialogActions>
        </Grid>
    )
}
