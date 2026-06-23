import { useEffect, useState } from 'react';
import { Dialog, Box, Typography, Button } from '@mui/material';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useAuthStore } from '../../store';
import { useThemeStore, THEME_TOKENS } from '../../store/theme/theme.store';

interface Props {
    open: boolean;
    onKeepSession: () => void;
}

export const SessionModal = ({ open, onKeepSession }: Props) => {
    const logoutUser = useAuthStore(state => state.logoutUser);
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [timerKey, setTimerKey] = useState(0);

    useEffect(() => {
        if (open) setTimerKey(k => k + 1);
    }, [open]);

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                px: 3, py: 2.5,
                display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '10px',
                    bgcolor: 'rgba(255,255,255,.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </Box>
                <Box>
                    <Typography fontWeight={800} fontSize="15px" color="#fff" lineHeight={1.2}>
                        Sesión por expirar
                    </Typography>
                    <Typography fontSize="12px" color="rgba(255,255,255,.75)" lineHeight={1.2}>
                        Se detectó inactividad en el sistema
                    </Typography>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5 }}>
                <Typography sx={{
                    fontSize: '13.5px', color: 'text.secondary',
                    textAlign: 'center', lineHeight: 1.65, maxWidth: 280,
                }}>
                    Tu sesión se cerrará automáticamente. ¿Deseas mantenerla activa?
                </Typography>

                {/* Countdown */}
                <CountdownCircleTimer
                    key={timerKey}
                    isPlaying={open}
                    duration={60}
                    size={120}
                    strokeWidth={9}
                    colors={['#22c55e', '#f59e0b', '#ef4444', '#ef4444']}
                    colorsTime={[60, 30, 10, 0]}
                    trailColor={t.border}
                    onComplete={() => {
                        logoutUser();
                        return { shouldRepeat: false };
                    }}
                >
                    {({ remainingTime, color }) => (
                        <Box sx={{ textAlign: 'center', userSelect: 'none' }}>
                            <Typography sx={{ fontSize: '36px', fontWeight: 800, color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                                {remainingTime}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>
                                seg
                            </Typography>
                        </Box>
                    )}
                </CountdownCircleTimer>

                {/* Divider */}
                <Box sx={{ width: '100%', height: '1px', bgcolor: t.border }} />

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={logoutUser}
                        sx={{ borderRadius: '11px', textTransform: 'none', fontWeight: 600, fontSize: '13px', py: 1 }}
                    >
                        Cerrar sesión
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        disableElevation
                        onClick={onKeepSession}
                        sx={{
                            borderRadius: '11px', textTransform: 'none', fontWeight: 700, fontSize: '13px', py: 1,
                            bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                        }}
                    >
                        Mantener sesión
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};
