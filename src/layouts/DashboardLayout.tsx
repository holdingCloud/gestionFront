
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Navbar } from '../components';
import BackLoading from '../components/backdrop/backLoading';

export const DashboardLayout = () => {


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
    < >
      <Navbar />
    </>
  );
};