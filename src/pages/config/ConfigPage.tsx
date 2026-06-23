import {
    Box, Card, CardContent, Divider, FormControl,
    FormControlLabel, Grid, InputLabel, MenuItem, Select,
    Switch, Typography
} from '@mui/material';
import { useThemeStore, THEME_TOKENS, ThemeVariant } from '../../store/theme/theme.store';

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card sx={{ borderRadius: '18px', mb: 3 }}>
        <CardContent>
            <Typography variant="subtitle1" fontWeight={700} mb={1.5}>{title}</Typography>
            <Divider sx={{ mb: 2 }} />
            {children}
        </CardContent>
    </Card>
);

const themes: ThemeVariant[] = ['calido', 'claro', 'oscuro'];

export default function ConfigPage() {
    const theme = useThemeStore(state => state.theme);
    const setTheme = useThemeStore(state => state.setTheme);

    return (
        <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 800 }}>
            <Typography variant="h5" fontWeight={700} mb={3}>Configuración</Typography>

            <SectionCard title="Apariencia">
                <Typography variant="body2" color="text.secondary" mb={1.5}>Tema de color</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                    {themes.map(v => {
                        const t = THEME_TOKENS[v];
                        const active = theme === v;
                        return (
                            <Box
                                key={v}
                                onClick={() => setTheme(v)}
                                sx={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: 0.75, cursor: 'pointer',
                                }}
                            >
                                <Box sx={{
                                    width: 52, height: 52,
                                    borderRadius: '14px',
                                    background: t.swatch,
                                    border: active ? `2.5px solid ${t.primary}` : '2.5px solid transparent',
                                    boxShadow: active ? `0 0 0 2px ${t.primary}` : 'none',
                                    transition: 'all .15s',
                                }} />
                                <Typography variant="caption" fontWeight={active ? 700 : 500} color="text.secondary">
                                    {t.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </SectionCard>

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
