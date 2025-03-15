
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import AuthFormContainer from '@/components/auth/AuthFormContainer';

const Login = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  
  // If already authenticated, redirect to courses
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/courses');
    }
  }, [isAuthenticated, navigate]);

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
