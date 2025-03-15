
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/ui/LoadingState';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Set authChecked to true once we've checked authentication status
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

  // Show loading state only during initial auth check
  if (isLoading && !authChecked) {
    return <LoadingState message="Verificando autenticación..." />;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated || !user) {
    console.log('No autenticado, redirigiendo a la página de inicio de sesión');
    // Use a more reliable approach that doesn't overuse localStorage
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Only return the outlet if authenticated
  return <Outlet />;
};

export default PrivateRoute;
