import {
    Box, Card, CardContent, Chip, Divider, FormControl,
    FormControlLabel, Grid, InputLabel, MenuItem, Select,
    Switch, Tooltip, Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useThemeStore } from '../../store';

const colorSwatches = [
    '#1d2b75', '#1976d2', '#0288d1', '#00897b',
    '#43a047', '#fb8c00', '#e53935', '#8e24aa',
    '#5e35b1', '#37474f',
];

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card sx={{ borderRadius: 3, boxShadow: 4, mb: 3 }}>
        <CardContent>
            <Typography variant="subtitle1" fontWeight={700} mb={1.5}>{title}</Typography>
            <Divider sx={{ mb: 2 }} />
            {children}
        </CardContent>
    </Card>
);

export default function ConfigPage() {
    const primaryColor = useThemeStore(state => state.primaryColor);
    const mode = useThemeStore(state => state.mode);
    const setPrimaryColor = useThemeStore(state => state.setPrimaryColor);
    const setMode = useThemeStore(state => state.setMode);

    return (
        <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 800 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>Configuración</Typography>

            {/* ── Apariencia ── */}
            <SectionCard title="Apariencia">
                <Typography variant="body2" color="text.secondary" mb={1.5}>Color principal</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {colorSwatches.map(color => (
                        <Tooltip key={color} title={color}>
                            <Box
                                onClick={() => setPrimaryColor(color)}
                                sx={{
                                    width: 36, height: 36,
                                    borderRadius: '50%',
                                    bgcolor: color,
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: primaryColor === color ? '3px solid #000' : '3px solid transparent',
                                    boxShadow: primaryColor === color ? 4 : 1,
                                    transition: 'all 0.15s',
                                }}
                            >
                                {primaryColor === color && <CheckIcon sx={{ color: '#fff', fontSize: 18 }} />}
                            </Box>
                        </Tooltip>
                    ))}
                </Box>

                <Typography variant="body2" color="text.secondary" mb={1}>Modo</Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {(['light', 'dark'] as const).map(m => (
                        <Chip
                            key={m}
                            icon={m === 'light' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                            label={m === 'light' ? 'Claro' : 'Oscuro'}
                            variant={mode === m ? 'filled' : 'outlined'}
                            color={mode === m ? 'primary' : 'default'}
                            onClick={() => setMode(m)}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Box>
            </SectionCard>

            {/* ── Notificaciones ── */}
            <SectionCard title="Notificaciones">
                <Grid container direction="column" spacing={1}>
                    {[
                        { label: 'Clientes por llamar', sub: 'Notificar cuando hay clientes pendientes de contacto' },
                        { label: 'Alertas de inventario', sub: 'Notificar cuando un producto tenga stock bajo' },
                        { label: 'Resumen diario', sub: 'Recibir resumen de actividad al inicio del día' },
                    ].map(item => (
                        <Grid item key={item.label}>
                            <FormControlLabel
                                control={<Switch defaultChecked />}
                                label={
                                    <Box>
                                        <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            </SectionCard>

            {/* ── Idioma y Región ── */}
            <SectionCard title="Idioma y Región">
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Idioma</InputLabel>
                    <Select defaultValue="es" label="Idioma">
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="pt">Português</MenuItem>
                        <MenuItem value="fr">Français</MenuItem>
                    </Select>
                </FormControl>
            </SectionCard>

            {/* ── Seguridad ── */}
            <SectionCard title="Seguridad">
                <Grid container direction="column" spacing={1}>
                    <Grid item>
                        <FormControlLabel
                            control={<Switch defaultChecked />}
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>Cierre de sesión por inactividad</Typography>
                                    <Typography variant="caption" color="text.secondary">Cerrar sesión automáticamente tras 60 min sin actividad</Typography>
                                </Box>
                            }
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={<Switch />}
                            label={
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>Cerrar sesión en todos los dispositivos</Typography>
                                    <Typography variant="caption" color="text.secondary">Al cambiar contraseña, cerrar sesión en otros dispositivos</Typography>
                                </Box>
                            }
                        />
                    </Grid>
                </Grid>
            </SectionCard>
        </Box>
    );
}
