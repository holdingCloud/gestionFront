import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
    Box,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Typography,
    Divider,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { Role } from "../../../interfaces";

const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5, mt: 0.5 }}>
        {icon}
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.8} textTransform="uppercase">
            {label}
        </Typography>
        <Divider sx={{ flex: 1 }} />
    </Box>
);

const roleLabels: Record<string, string> = {
    ADMINISTRADOR: 'Administrador',
    REPARTIDOR: 'Repartidor',
    COMUN: 'Común',
};

export const UserForm = ({
    onSetCreateModal,
    handleSubmit,
    values,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    showPassword,
    hiddeButton,
    handleClickShowPassword,
    saveUpdate,
    cancelUpdate,
    roles,
}: any) => {

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>

                <SectionLabel icon={<PersonOutlineIcon fontSize="small" color="action" />} label="Datos del usuario" />

                <TextField
                    fullWidth size="small" name="fullName" label="Nombre completo"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth size="small" name="email" label="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth size="small" name="imagen" label="URL de imagen / avatar"
                    value={values.imagen}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.imagen && Boolean(errors.imagen)}
                    helperText={(touched.imagen && errors.imagen) || 'URL de la foto de perfil'}
                    sx={{ mb: 2 }}
                />

                <SectionLabel icon={<TuneOutlinedIcon fontSize="small" color="action" />} label="Acceso" />

                <FormControl fullWidth size="small" sx={{ mb: 2 }} error={touched.rol && Boolean(errors.rol)}>
                    <InputLabel>Rol</InputLabel>
                    <Select
                        name="rol"
                        value={values.rol ?? ''}
                        label="Rol"
                        onChange={(e) => setFieldValue('rol', e.target.value)}
                        onBlur={handleBlur}
                    >
                        {(roles as Role[])?.map(r => (
                            <MenuItem key={r.id} value={r.id}>
                                {roleLabels[r.type] ?? r.type}
                            </MenuItem>
                        ))}
                    </Select>
                    {touched.rol && errors.rol && (
                        <FormHelperText>{errors.rol as string}</FormHelperText>
                    )}
                </FormControl>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField
                        fullWidth size="small" name="password" label="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={(touched.password && errors.password) || (hiddeButton ? '' : 'Dejar vacío para no cambiar')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end" size="small">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth size="small" name="passwordConfirmation" label="Confirmar contraseña"
                        type={showPassword ? 'text' : 'password'}
                        value={values.passwordConfirmation}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
                        helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowPassword} edge="end" size="small">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button variant="outlined" onClick={() => { onSetCreateModal(false); cancelUpdate(); }}>
                    Cancelar
                </Button>
                {hiddeButton
                    ? <Button variant="contained" type="submit" color="primary">Guardar</Button>
                    : <Button variant="contained" type="button" color="info" onClick={saveUpdate}>Guardar cambios</Button>
                }
            </DialogActions>
        </Box>
    );
};
