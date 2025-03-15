
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/ui/LoadingState';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, user, authChecked } = useAuth();
  const location = useLocation();
  
  // Show loading state only during initial auth check or when explicitly loading
  if (isLoading || !authChecked) {
    return <LoadingState message="Verificando autenticación..." />;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated || !user) {
    console.log('No autenticado, redirigiendo a la página de inicio de sesión');
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Only return the outlet if authenticated
  return <Outlet />;
};

export default PrivateRoute;
