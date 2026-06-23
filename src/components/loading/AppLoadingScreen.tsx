import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

type ThemeVariant = 'calido' | 'claro' | 'oscuro';

function getPersistedTheme(): ThemeVariant {
    try {
        const stored = localStorage.getItem('theme-store');
        if (stored) {
            const parsed = JSON.parse(stored);
            const theme = parsed?.state?.theme;
            if (theme === 'calido' || theme === 'claro' || theme === 'oscuro') return theme;
        }
    } catch {}
    return 'calido';
}

const GRADIENTS: Record<ThemeVariant, string> = {
    calido: 'linear-gradient(150deg, #0c2f40 0%, #0f3a4f 55%, #0b8275 130%)',
    claro:  'linear-gradient(150deg, #16181d 0%, #101216 50%, #4f46e5 130%)',
    oscuro: 'linear-gradient(150deg, #0a0d12 0%, #0e1116 50%, #19c3a6 130%)',
};

const PRIMARIES: Record<ThemeVariant, string> = {
    calido: '#0e9f8c',
    claro:  '#4f46e5',
    oscuro: '#19c3a6',
};

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0.65); opacity: 0.45; }
  40% { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const LogoMark = ({ primary }: { primary: string }) => (
    <svg width="44" height="44" viewBox="0 0 40 40">
        <defs>
            <linearGradient id="appLoadLogo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={primary} />
                <stop offset="1" stopColor="#0c2f40" />
            </linearGradient>
        </defs>
        <path d="M9 9 L7 1 L16 6 Z" fill={primary} />
        <path d="M31 9 L33 1 L24 6 Z" fill={primary} />
        <path d="M20 6 C28 6 34 8 34 8 L34 20 C34 30 27 35 20 37 C13 35 6 30 6 20 L6 8 C6 8 12 6 20 6 Z" fill="url(#appLoadLogo)" />
        <path d="M13.5 20 l4 4 l9 -9.5" fill="none" stroke="#fffdf9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export function AppLoadingScreen() {
    const theme = getPersistedTheme();
    const gradient = GRADIENTS[theme];
    const primary = PRIMARIES[theme];

    return (
        <Box sx={{
            position: 'fixed', inset: 0,
            background: gradient,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '20px', animation: `${fadeIn} 0.3s ease`,
            overflow: 'hidden',
        }}>
            {/* Decorative circles */}
            <Box sx={{ position: 'absolute', width: 440, height: 440, borderRadius: '50%', border: '1px solid rgba(255,255,255,.07)', right: -110, top: -110, pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,255,255,.05)', left: -80, bottom: -70, pointerEvents: 'none' }} />

            <LogoMark primary={primary} />

            <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{
                    fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                    fontWeight: 800, fontSize: '28px', color: '#fffdf9',
                    letterSpacing: '-0.5px', lineHeight: 1,
                }}>
                    Gestion<Box component="span" sx={{ color: primary }}>ate</Box>
                </Typography>
                <Typography sx={{
                    fontSize: '10.5px', letterSpacing: '3px',
                    textTransform: 'uppercase', color: primary, mt: '7px',
                    fontWeight: 600,
                }}>
                    Cargando sesión
                </Typography>
            </Box>

            {/* Pulsing dots */}
            <Box sx={{ display: 'flex', gap: '8px' }}>
                {[0, 1, 2].map(i => (
                    <Box key={i} sx={{
                        width: 8, height: 8, borderRadius: '50%', bgcolor: primary,
                        animation: `${pulse} 1s ${i * 0.2}s infinite ease-in-out`,
                    }} />
                ))}
            </Box>
        </Box>
    );
}

export default AppLoadingScreen;
