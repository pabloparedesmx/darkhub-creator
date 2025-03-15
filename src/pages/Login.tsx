
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import AuthFormContainer from '@/components/auth/AuthFormContainer';
import LoadingState from '@/components/ui/LoadingState';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthenticated, authChecked } = useAuth();
  
  // Get redirect path from location state or default to courses
  const from = location.state?.from || '/courses';
  
  // If already authenticated, redirect to intended destination
  useEffect(() => {
    if (authChecked && isAuthenticated && !isLoading) {
      console.log(`Authenticated, redirecting to: ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, authChecked, isLoading, from]);

  // Show loading state during initial auth check
  if (!authChecked) {
    return <LoadingState message="Checking authentication..." />;
  }

  // Don't render login page if already authenticated and still on the page
  // (This is a safety check in case the redirect hasn't happened yet)
  if (isAuthenticated && !isLoading) {
    return <LoadingState message="Redirecting..." />;
  }

  return (
    <AuthFormContainer
      title="Welcome back"
      subtitle="Please enter your details to sign in."
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkUrl="/signup"
    >
      <LoginForm isLoading={isLoading} />
      <SocialLogin isLoading={isLoading} />
    </AuthFormContainer>
  );
};

export default Login;
