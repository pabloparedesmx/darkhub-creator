
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

  // Only show loading state when initially checking authentication
  // This prevents the loading screen from flashing after login timeout errors
  if (isLoading && !authChecked) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Once we've checked authentication, either allow access or redirect
  return isAuthenticated && user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
