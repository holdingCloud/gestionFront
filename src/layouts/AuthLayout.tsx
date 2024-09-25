import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store/auth/auth.store";



export const AuthLayout = () => {


    const authStatus = useAuthStore(state => state.status);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

    if (authStatus === 'pending') {
        checkAuthStatus();
        return <>Loading...</>;
    }

    if (authStatus === 'authorized') {
        return <Navigate to='/dashboard' />
    }


    return (
        <Outlet />
    )
}
