
import { Navigate } from "react-router-dom";
import SalesSheetPage from "../pages/sales/SalesSheetPage"
import { useAuthStore } from "../store";
import BackLoading from "../components/backdrop/backLoading";


export const SalesSheetLayout = () => {


    const authStatus = useAuthStore(state => state.status);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);

    if (authStatus === 'pending') {
        checkAuthStatus();
        return <BackLoading action={true} />
    }

    if (authStatus === 'unauthorized') {
        return <Navigate to='/auth/login' />
    }

    return (
        <>
            <SalesSheetPage />
        </>
    )
}


