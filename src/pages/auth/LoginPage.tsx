import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../store/auth/auth.store';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { THEME_TOKENS } from '../../store/theme/theme.store';

// Always use the calido tokens for the login page hero panel (static gradient)
const lt = THEME_TOKENS.calido;

const LogoMark = () => (
    <svg width="34" height="34" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
        <defs>
            <linearGradient id="lglogo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0e9f8c" />
                <stop offset="1" stopColor="#0f3a4f" />
            </linearGradient>
        </defs>
        <path d="M9 9 L7 1 L16 6 Z" fill="#0e9f8c" />
        <path d="M31 9 L33 1 L24 6 Z" fill="#0e9f8c" />
        <path d="M20 6 C28 6 34 8 34 8 L34 20 C34 30 27 35 20 37 C13 35 6 30 6 20 L6 8 C6 8 12 6 20 6 Z" fill="url(#lglogo)" />
        <path d="M13.5 20 l4 4 l9 -9.5" fill="none" stroke="#fffdf9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export function LoginPage() {
    const loginUser = useAuthStore(state => state.loginUser);
    const error = useAuthStore(state => state.error);
    const stateError = useAuthStore(state => state.setStateError);

    const [showPassword, setShowPassword] = useState(false);
    const savedEmail = localStorage.getItem('rememberedEmail') ?? '';
    const [rememberMe, setRememberMe] = useState(!!savedEmail);

    const { handleSubmit, errors, touched, values, handleBlur, handleChange } = useFormik({
        initialValues: { email: savedEmail, password: '' },
        onSubmit: async ({ email, password }) => {
            if (rememberMe) localStorage.setItem('rememberedEmail', email);
            else localStorage.removeItem('rememberedEmail');
            await loginUser(email, password);
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Debe ser un email válido').required('Requerido'),
            password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido').notOneOf(['it-jr'], 'Esta opción no es permitida'),
        }),
    });

    useEffect(() => { stateError(false); }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* ── LEFT PANEL ── */}
            <Box sx={{
                flex: 1.05,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(150deg,#0c2f40 0%,#0f3a4f 55%,#0b8275 130%)',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '54px 60px',
                color: lt.brandink,
            }}>
                {/* Decorative circles */}
                <Box sx={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', border: '1px solid rgba(255,255,255,.08)', right: -160, top: -120 }} />
                <Box sx={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '1px solid rgba(255,255,255,.07)', right: -40, top: 60 }} />
                <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '36px', transform: 'rotate(20deg)', background: 'rgba(20,195,166,.12)', left: -50, bottom: 120 }} />

                {/* Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '13px', position: 'relative' }}>
                    <LogoMark />
                    <Box sx={{ lineHeight: 1 }}>
                        <Typography sx={{ fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 800, fontSize: '23px', letterSpacing: '-0.5px', color: lt.brandink }}>
                            Gestion<Box component="span" sx={{ color: lt.primary }}>ate</Box>
                        </Typography>
                        <Typography sx={{ fontSize: '10.5px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.6, mt: '4px', color: lt.brandink }}>
                            Gestión con IA
                        </Typography>
                    </Box>
                </Box>

                {/* Hero content */}
                <Box sx={{ position: 'relative', maxWidth: 440 }}>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.14)',
                        padding: '7px 13px', borderRadius: '999px',
                        fontSize: '12.5px', fontWeight: 600, mb: '22px', color: lt.brandink,
                    }}>
                        <Box sx={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: lt.primary,
                            boxShadow: `0 0 0 4px rgba(14,159,140,.25)`,
                        }} />
                        Copiloto IA activo
                    </Box>

                    <Typography sx={{
                        fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 800,
                        fontSize: '42px', lineHeight: 1.08, letterSpacing: '-1px', mb: '16px', color: lt.brandink,
                    }}>
                        Administra tu empresa, no las planillas.
                    </Typography>

                    <Typography sx={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.82, color: lt.brandink }}>
                        Ventas, inventario, clientes y equipo en un solo lugar. Tu copiloto de IA redacta los mensajes, detecta lo urgente y te ayuda a decidir.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: '10px', mt: '26px', flexWrap: 'wrap' }}>
                        {['📊 Reportes en vivo', '💬 Mensajes IA', '🔒 Seguro'].map(pill => (
                            <Box key={pill} sx={{
                                fontSize: '12.5px', fontWeight: 600,
                                background: 'rgba(255,255,255,.08)',
                                border: '1px solid rgba(255,255,255,.12)',
                                padding: '8px 13px', borderRadius: '10px', color: lt.brandink,
                            }}>
                                {pill}
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Typography sx={{ position: 'relative', fontSize: '12.5px', opacity: 0.55, color: lt.brandink }}>
                    © Gestionate {new Date().getFullYear()} · Hecho por un dev, para tu negocio
                </Typography>
            </Box>

            {/* ── RIGHT PANEL ── */}
            <Box sx={{
                flex: { xs: 1, md: 0.95 },
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px', bgcolor: lt.surface,
            }}>
                <Box sx={{ width: '100%', maxWidth: 380 }}
                    component="form"
                    onSubmit={handleSubmit}
                    onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: '30px' }}>
                        <Box sx={{
                            width: 54, height: 54, borderRadius: '16px',
                            background: lt.surface2, border: `1px solid ${lt.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '16px',
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={lt.primary} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </Box>
                        <Typography sx={{ fontFamily: "'Bricolage Grotesque', system-ui", fontWeight: 700, fontSize: '25px', mb: '6px', color: lt.ink }}>
                            Bienvenido de vuelta
                        </Typography>
                        <Typography sx={{ color: lt.muted, fontSize: '14px' }}>
                            Ingresa para entrar a tu panel de gestión
                        </Typography>
                    </Box>

                    {/* Email */}
                    <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: lt.ink, mb: '7px' }}>Email</Typography>
                    <TextField
                        fullWidth
                        name="email"
                        placeholder="tu@empresa.com"
                        autoFocus={!savedEmail}
                        value={values.email}
                        onChange={handleChange}
                        onFocus={() => stateError(false)}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        sx={{ mb: errors.email && touched.email ? 0.5 : '14px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={lt.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-10 6L2 7" />
                                    </svg>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Password */}
                    <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: lt.ink, mb: '7px', mt: '14px' }}>Contraseña</Typography>
                    <TextField
                        fullWidth
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoFocus={!!savedEmail}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ mb: '16px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={lt.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small">
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Remember + forgot */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '22px' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                    size="small"
                                    sx={{ color: lt.border, '&.Mui-checked': { color: lt.primary } }}
                                />
                            }
                            label={<Typography sx={{ fontSize: '13.5px', color: lt.muted }}>Recordarme</Typography>}
                        />
                        <Typography sx={{ fontSize: '13.5px', color: lt.primary, fontWeight: 600, cursor: 'pointer' }}>
                            ¿Olvidaste tu clave?
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                            Email o contraseña incorrectos.
                        </Alert>
                    )}

                    {/* Submit */}
                    <Box
                        component="button"
                        type="submit"
                        sx={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            border: 'none', cursor: 'pointer',
                            background: lt.primary, color: '#fff',
                            fontWeight: 700, fontSize: '15px', letterSpacing: '.2px',
                            boxShadow: `0 8px 20px rgba(14,159,140,.28)`,
                            fontFamily: "'Hanken Grotesque', system-ui, sans-serif",
                            '&:hover': { background: lt.primaryDark },
                            transition: 'background .15s',
                        }}
                    >
                        Iniciar sesión
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default LoginPage;
