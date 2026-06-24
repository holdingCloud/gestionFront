import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography, CircularProgress, Box, Divider,
} from '@mui/material';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Props {
    open: boolean;
    selectedCount: number;
    isSaving: boolean;
    onClose: () => void;
    onConfirm: (frequency: number) => void;
}

export const BulkFrequencyModal = ({ open, selectedCount, isSaving, onClose, onConfirm }: Props) => {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } =
        useFormik({
            initialValues: { frequency: '' as unknown as number },
            validationSchema: Yup.object({
                frequency: Yup.number()
                    .typeError('Debe ser un número')
                    .integer('Debe ser un número entero')
                    .min(1, 'Mínimo 1 día')
                    .max(3650, 'Máximo 3650 días')
                    .required('Requerido'),
            }),
            validateOnChange: false,
            validateOnBlur: true,
            onSubmit: (vals) => {
                onConfirm(Number(vals.frequency));
            },
        });

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '16px' }}>
                    Actualizar frecuencia
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {selectedCount} cliente{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
                </Typography>
            </DialogTitle>
            <Divider />
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        name="frequency"
                        label="Nueva frecuencia (días)"
                        type="number"
                        value={values.frequency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.frequency && Boolean(errors.frequency)}
                        helperText={
                            (touched.frequency && errors.frequency) ||
                            'Días estimados entre compras para los clientes seleccionados'
                        }
                        inputProps={{ min: 1, max: 3650 }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSaving}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSaving}
                        startIcon={
                            isSaving
                                ? <CircularProgress size={16} color="inherit" />
                                : <SystemUpdateAltOutlinedIcon fontSize="small" />
                        }
                        disableElevation
                        sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: '8px',
                            bgcolor: '#0e9f8c',
                            '&:hover': { bgcolor: '#0b8a79' },
                        }}
                    >
                        {isSaving ? 'Actualizando...' : 'Confirmar'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
