import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth/auth.store";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { keyframes } from "@mui/system";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

export const AuthLayout = () => {

    const authStatus = useAuthStore(state => state.status);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
    const navigate = useNavigate();

    const [showSpinner, setShowSpinner] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);
    const cameFromLoadingSession = useRef(false);

    useEffect(() => {
        if (authStatus === 'loading-session') {
            cameFromLoadingSession.current = true;
            setShowSpinner(true);
            setFadingOut(false);
        }

        if (authStatus === 'authorized' && cameFromLoadingSession.current) {
            setFadingOut(true);
            const timer = setTimeout(() => {
                cameFromLoadingSession.current = false;
                navigate('/dashboard');
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [authStatus, navigate]);

    if (authStatus === 'pending') {
        checkAuthStatus();
        return <>Loading...</>;
    }

    if (showSpinner) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 60%, #0288d1 100%)',
                    animation: fadingOut
                        ? `${fadeOut} 0.6s ease forwards`
                        : `${fadeIn} 0.6s ease forwards`,
                }}
            >
                <CircularProgress size={64} thickness={4} sx={{ color: '#fff' }} />
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500, letterSpacing: 1 }}>
                    Cargando sesión
                </Typography>
            </Box>
        );
    }

    if (authStatus === 'authorized') {
        return <Navigate to='/dashboard' />;
    }

    return <Outlet />;
}
