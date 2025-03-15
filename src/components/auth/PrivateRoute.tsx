
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
      console.log('Authentication check completed:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
      setAuthChecked(true);
    }
  }, [isLoading, isAuthenticated]);

  // Only show loading state when initially checking authentication
  if (isLoading && !authChecked) {
    console.log('Showing loading state while checking authentication');
    return <LoadingState message="Checking authentication..." />;
  }

  // Properly redirect to login page if not authenticated
  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only return the outlet if authenticated
  console.log('User is authenticated, rendering protected route');
  return <Outlet />;
};

export default PrivateRoute;
