import { Box, Button, DialogActions, DialogContent, TextField } from "@mui/material";

export const CompanyForm = ({
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
}: any) => {
    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
                <TextField
                    fullWidth size="small" name="name" label="Nombre de la empresa"
                    value={values.name} onChange={handleChange} onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth size="small" name="description" label="Descripción"
                    multiline rows={3}
                    value={values.description} onChange={handleChange} onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={(touched.description && errors.description) || 'Opcional'}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button variant="outlined" onClick={() => { onSetCreateModal(false); cancelUpdate(); }}>
                    Cancelar
                </Button>
                {hiddeButton
                    ? <Button variant="contained" type="submit">Guardar</Button>
                    : <Button variant="contained" color="info" onClick={saveUpdate}>Guardar cambios</Button>
                }
            </DialogActions>
        </Box>
    );
};
