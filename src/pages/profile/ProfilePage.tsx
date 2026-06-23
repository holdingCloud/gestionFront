import {
    Avatar, Box, Card, Chip, Divider, Grid, Typography
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { useAuthStore } from '../../store';

const mockActivity = [
    { id: 1, text: 'Inició sesión en el sistema', time: 'Hace 5 min', color: '#1d2b75' },
    { id: 2, text: 'Actualizó un cliente', time: 'Hace 20 min', color: '#43a047' },
    { id: 3, text: 'Registró una compra', time: 'Hace 1 hora', color: '#fb8c00' },
    { id: 4, text: 'Creó un nuevo usuario', time: 'Hace 2 horas', color: '#8e24aa' },
    { id: 5, text: 'Actualizó inventario', time: 'Ayer', color: '#00897b' },
    { id: 6, text: 'Generó reporte de ventas', time: 'Hace 2 días', color: '#e53935' },
    { id: 7, text: 'Modificó configuración', time: 'Hace 3 días', color: '#6d4c41' },
];

export default function ProfilePage() {
    const user = useAuthStore(state => state.user);

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const infoRows = [
        { icon: <TagOutlinedIcon fontSize="small" />,           label: 'ID',     value: user?.id != null ? String(user.id) : '—' },
        { icon: <BadgeOutlinedIcon fontSize="small" />,         label: 'Nombre', value: user?.name ?? '—' },
        { icon: <VerifiedUserOutlinedIcon fontSize="small" />,  label: 'Rol',    value: user?.role ?? '—' },
        { icon: <EmailOutlinedIcon fontSize="small" />,         label: 'Email',  value: user?.email ?? '—' },
    ];

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Typography variant="h5" fontWeight={700} mb={3}>Mi Perfil</Typography>
            <Grid container spacing={3}>

                {/* ── Left card ── */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, overflow: 'visible', boxShadow: 6, pb: 3 }}>
                        {/* Banner */}
                        <Box sx={{
                            height: 100,
                            background: 'linear-gradient(135deg, #1d2b75 0%, #3a5bd9 100%)',
                            borderRadius: '12px 12px 0 0',
                            position: 'relative',
                        }}>
                            <Avatar
                                sx={{
                                    width: 80, height: 80,
                                    bgcolor: '#fff',
                                    color: '#1d2b75',
                                    fontSize: 28,
                                    fontWeight: 700,
                                    border: '4px solid #fff',
                                    boxShadow: 4,
                                    position: 'absolute',
                                    bottom: -40,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {initials}
                            </Avatar>
                        </Box>

                        <Box sx={{ mt: 6, textAlign: 'center', px: 3 }}>
                            <Typography variant="h6" fontWeight={700}>
                                {user?.name ?? 'Sin nombre'}
                            </Typography>
                            <Chip
                                label={user?.role ?? '—'}
                                color="primary"
                                size="small"
                                sx={{ mt: 0.5, mb: 2 }}
                            />

                            <Divider sx={{ mb: 2 }} />

                            {infoRows.map(row => (
                                <Box key={row.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, textAlign: 'left' }}>
                                    <Box sx={{ color: 'text.secondary' }}>{row.icon}</Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                                        <Typography variant="body2" fontWeight={500} noWrap>{row.value}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* ── Right card ── */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3, boxShadow: 6, p: 3, height: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>
                            Actividad reciente
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {mockActivity.map((item, idx) => (
                            <Box key={item.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.2 }}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: item.color, fontSize: 14 }}>
                                        {initials}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2">{item.text}</Typography>
                                        <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                                    </Box>
                                </Box>
                                {idx < mockActivity.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
