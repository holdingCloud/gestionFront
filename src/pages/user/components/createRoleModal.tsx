import {
    Box, DialogContent, DialogActions, Button,
    TextField, CircularProgress,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateModal } from '../../../components';

interface CreateRoleModalProps {
    open: boolean;
    onClose: () => void;
    formik: FormikProps<{ type: string }>;
    creating: boolean;
}

export const CreateRoleModal = ({ open, onClose, formik, creating }: CreateRoleModalProps) => {
    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <CreateModal title="Crear Rol" open={open} onClose={() => handleClose()}>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <DialogContent sx={{ pt: 2, pb: 1, px: 3, minWidth: 320 }}>
                    <TextField
                        fullWidth
                        size="small"
                        name="type"
                        label="Nombre del rol"
                        placeholder="Ej: SUPERVISOR, CAJERO..."
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.type && Boolean(formik.errors.type)}
                        helperText={formik.touched.type && formik.errors.type}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={creating}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={creating}
                        sx={{
                            borderRadius: '10px', textTransform: 'none', fontWeight: 700,
                            bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                            minWidth: 90,
                        }}
                    >
                        {creating
                        ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={14} sx={{ color: '#fff' }} />
                            <span>Guardando registro...</span>
                          </Box>
                        : 'Crear'
                    }
                    </Button>
                </DialogActions>
            </Box>
        </CreateModal>
    );
};
