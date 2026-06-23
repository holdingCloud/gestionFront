import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { Navbar } from '../components';
import { AppLoadingScreen } from '../components/loading/AppLoadingScreen';

// Decode JWT exp without a library — no network needed
const isTokenExpired = (token?: string): boolean => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const DashboardLayout = () => {
    const authStatus = useAuthStore(state => state.status);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
    const logoutUser = useAuthStore(state => state.logoutUser);

    useEffect(() => {
        // ── Mount: check token immediately (covers browser-reopen + long absence) ──
        const token = useAuthStore.getState().accessToken;
        if (isTokenExpired(token)) {
            logoutUser();
            return;
        }

        if (authStatus === 'pending') {
            checkAuthStatus();
        }

        // ── Tab visible again: user switched away and came back ──
        // Covers: alt-tab to another app, phone call, another browser tab, etc.
        const handleVisibility = () => {
            if (document.visibilityState !== 'visible') return;
            const currentToken = useAuthStore.getState().accessToken;
            if (isTokenExpired(currentToken)) {
                logoutUser();
            }
        };

        // ── Window focus: user comes back from another OS window ──
        const handleFocus = () => {
            const currentToken = useAuthStore.getState().accessToken;
            if (isTokenExpired(currentToken)) {
                logoutUser();
            }
        };

        // ── Storage event: session cleared in another tab ──
        // Zustand persist uses localStorage — if another tab logs out,
        // this tab detects the storage change and reacts.
        const handleStorage = (e: StorageEvent) => {
            if (e.key !== 'auth-store') return;
            try {
                const next = e.newValue ? JSON.parse(e.newValue) : null;
                if (!next?.state?.accessToken) {
                    logoutUser();
                }
            } catch {
                logoutUser();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('storage', handleStorage);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorage);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (authStatus === 'pending') {
        return <AppLoadingScreen />;
    }

    if (authStatus === 'unauthorized') {
        return <Navigate to='/auth/login' />;
    }

    return <Navbar />;
};
