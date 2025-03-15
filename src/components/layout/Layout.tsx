
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setTheme } = useTheme();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on public routes
    const isPublicRoute = ['/login', '/signup', '/'].includes(location.pathname);
    
    // Check if user has a theme preference
    const storedTheme = localStorage.getItem('dashboard-theme');
    
    // If no user preference exists, apply route-based default
    if (!storedTheme) {
      // Public routes get dark theme, everything else gets light
      const defaultTheme = isPublicRoute ? 'dark' : 'light';
      setTheme(defaultTheme);
    }
  }, [location.pathname, setTheme]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
