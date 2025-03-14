
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

// Array of routes that should always use dark mode
const FORCE_DARK_ROUTES = ['/', '/login', '/signup'];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setTheme } = useTheme();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on a route that forces dark mode
    const shouldForceDarkMode = FORCE_DARK_ROUTES.includes(location.pathname);
    
    if (shouldForceDarkMode) {
      // Always set to dark theme for these routes
      setTheme('dark');
    } else {
      // For other routes, check user preference
      const storedTheme = localStorage.getItem('dashboard-theme');
      
      // If no user preference exists, apply route-based default
      if (!storedTheme) {
        const isPublicRoute = ['/login', '/signup', '/'].includes(location.pathname);
        setTheme(isPublicRoute ? 'dark' : 'light');
      }
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
