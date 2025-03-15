
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingState from '@/components/ui/LoadingState';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <LoadingState message="Checking admin access..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('Not authenticated, redirecting to login page');
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to dashboard if authenticated but not admin
  if (!isAdmin) {
    console.log('Not an admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to admin routes
  return <Outlet />;
};

export default AdminRoute;
