import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth/auth.store';
import { useEffect } from 'react';
import { AppLoadingScreen } from '../components/loading/AppLoadingScreen';

export const AuthLayout = () => {
    const authStatus = useAuthStore(state => state.status);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

    useEffect(() => {
        if (authStatus === 'pending') {
            checkAuthStatus();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (authStatus === 'pending' || authStatus === 'loading-session') {
        return <AppLoadingScreen />;
    }

    if (authStatus === 'authorized') {
        return <Navigate to='/dashboard' />;
    }

    return <Outlet />;
};
