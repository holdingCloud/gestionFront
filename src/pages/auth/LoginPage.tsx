import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../../store/auth/auth.store';
import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Alert, AlertTitle, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const WelcomeIllustration = () => (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 440 }}>
        <circle cx="250" cy="190" r="180" fill="rgba(255,255,255,0.04)" />
        <circle cx="250" cy="190" r="140" fill="rgba(255,255,255,0.04)" />

        {/* Monitor */}
        <rect x="60" y="50" width="380" height="240" rx="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <rect x="60" y="50" width="380" height="36" rx="14" fill="rgba(255,255,255,0.18)" />
        <rect x="60" y="72" width="380" height="14" fill="rgba(255,255,255,0.18)" />

        {/* Window buttons */}
        <circle cx="88" cy="68" r="6" fill="#ff5f56" />
        <circle cx="108" cy="68" r="6" fill="#ffbd2e" />
        <circle cx="128" cy="68" r="6" fill="#27c93f" />
        <rect x="208" y="61" width="84" height="14" rx="7" fill="rgba(255,255,255,0.2)" />

        {/* Sidebar */}
        <rect x="60" y="86" width="70" height="204" fill="rgba(255,255,255,0.06)" />
        <rect x="72" y="104" width="46" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="72" y="122" width="46" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        <rect x="72" y="140" width="46" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        <rect x="72" y="158" width="46" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        <rect x="72" y="176" width="46" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
        <circle cx="85" cy="258" r="7" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="85" cy="278" rx="11" ry="7" fill="rgba(255,255,255,0.25)" />

        {/* Stat cards */}
        <rect x="146" y="96" width="84" height="52" rx="8" fill="rgba(255,255,255,0.12)" />
        <rect x="244" y="96" width="84" height="52" rx="8" fill="rgba(255,255,255,0.12)" />
        <rect x="342" y="96" width="82" height="52" rx="8" fill="rgba(255,255,255,0.12)" />
        <rect x="158" y="108" width="30" height="16" rx="4" fill="rgba(255,255,255,0.6)" />
        <rect x="158" y="128" width="56" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
        <rect x="256" y="108" width="30" height="16" rx="4" fill="rgba(255,255,255,0.6)" />
        <rect x="256" y="128" width="56" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
        <rect x="354" y="108" width="30" height="16" rx="4" fill="rgba(255,255,255,0.6)" />
        <rect x="354" y="128" width="54" height="8" rx="4" fill="rgba(255,255,255,0.25)" />

        {/* Bar chart */}
        <rect x="146" y="158" width="182" height="120" rx="8" fill="rgba(255,255,255,0.07)" />
        <rect x="158" y="168" width="70" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
        <rect x="163" y="232" width="18" height="36" rx="3" fill="rgba(129,212,250,0.7)" />
        <rect x="190" y="215" width="18" height="53" rx="3" fill="rgba(79,195,247,0.85)" />
        <rect x="217" y="223" width="18" height="45" rx="3" fill="rgba(129,212,250,0.7)" />
        <rect x="244" y="205" width="18" height="63" rx="3" fill="rgba(79,195,247,0.9)" />
        <rect x="271" y="218" width="18" height="50" rx="3" fill="rgba(129,212,250,0.75)" />
        <rect x="298" y="210" width="18" height="58" rx="3" fill="rgba(79,195,247,0.85)" />
        <polyline points="172,235 199,218 226,226 253,208 280,221 307,214" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeDasharray="4 2" />

        {/* Donut chart */}
        <rect x="342" y="158" width="82" height="120" rx="8" fill="rgba(255,255,255,0.07)" />
        <circle cx="383" cy="210" r="30" stroke="rgba(255,255,255,0.12)" strokeWidth="16" fill="none" />
        <circle cx="383" cy="210" r="30" stroke="rgba(79,195,247,0.8)" strokeWidth="16" fill="none" strokeDasharray="75 120" strokeDashoffset="30" />
        <circle cx="383" cy="210" r="30" stroke="rgba(107,203,119,0.8)" strokeWidth="16" fill="none" strokeDasharray="45 150" strokeDashoffset="-45" />

        {/* Monitor stand */}
        <rect x="225" y="290" width="50" height="14" rx="5" fill="rgba(255,255,255,0.18)" />
        <rect x="205" y="304" width="90" height="8" rx="4" fill="rgba(255,255,255,0.15)" />

        {/* Floating card left */}
        <rect x="14" y="155" width="96" height="62" rx="10" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="34" cy="177" r="10" fill="rgba(79,195,247,0.5)" />
        <rect x="52" y="171" width="48" height="8" rx="4" fill="rgba(255,255,255,0.45)" />
        <rect x="52" y="184" width="34" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
        <rect x="22" y="199" width="76" height="6" rx="3" fill="rgba(255,255,255,0.15)" />

        {/* Floating card right */}
        <rect x="390" y="305" width="96" height="56" rx="10" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="410" cy="323" r="10" fill="rgba(107,203,119,0.5)" />
        <rect x="428" y="317" width="48" height="8" rx="4" fill="rgba(255,255,255,0.45)" />
        <rect x="428" y="330" width="34" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
        <rect x="398" y="345" width="76" height="6" rx="3" fill="rgba(255,255,255,0.15)" />

        {/* Decorative dots */}
        <circle cx="38" cy="100" r="4" fill="rgba(255,255,255,0.2)" />
        <circle cx="460" cy="130" r="6" fill="rgba(255,255,255,0.15)" />
        <circle cx="472" cy="80" r="3" fill="rgba(255,255,255,0.2)" />
        <circle cx="28" cy="340" r="5" fill="rgba(255,255,255,0.15)" />
        <circle cx="460" cy="350" r="4" fill="rgba(255,255,255,0.2)" />
    </svg>
);

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © Gestion proyecto '}
            {new Date().getFullYear()}
        </Typography>
    );
}

export function LoginPage() {

    const loginUser = useAuthStore(state => state.loginUser);
    const error = useAuthStore(state => state.error);
    const stateError = useAuthStore(state => state.setStateError);

    const [showPassword, setShowPassword] = useState(false);
    const savedEmail = localStorage.getItem('rememberedEmail') ?? '';
    const [rememberMe, setRememberMe] = useState(!!savedEmail);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleFocus = () => stateError(false);

    const { handleSubmit, errors, touched, values, handleBlur, handleChange } = useFormik({
        initialValues: {
            email: savedEmail,
            password: '',
        },
        onSubmit: async ({ email, password }) => {
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            await loginUser(email, password);
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Debe ser un email válido').required('Requerido'),
            password: Yup.string().min(6, 'La contraseña debe tener más de 6 caracteres').required('Requerido').notOneOf(['it-jr'], 'Esta opción no es permitida'),
        })
    });

    useEffect(() => {
        stateError(false);
    }, []);

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />

            {/* Left panel — illustration */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 60%, #0288d1 100%)',
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                }}
            >
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1, textAlign: 'center' }}>
                    Bienvenido al Sistema de Gestión
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, textAlign: 'center' }}>
                    Gestiona tu negocio de forma eficiente y centralizada
                </Typography>
                <WelcomeIllustration />
            </Grid>

            {/* Right panel — form */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Iniciar Sesión
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        sx={{ mt: 1, width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoFocus={!savedEmail}
                            value={values.email}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            autoFocus={!!savedEmail}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Recordarme"
                        />

                        {error && (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                Email o contraseña incorrectos.
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Iniciar Sesión
                        </Button>

                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default LoginPage;
