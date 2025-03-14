
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
  
  const isPublicRoute = ['/login', '/signup', '/'].includes(location.pathname);
  
  useEffect(() => {
    // For public routes, always enforce dark mode
    if (isPublicRoute) {
      setTheme('dark');
    }
  }, [location.pathname, setTheme, isPublicRoute]);
  
  return (
    <div className={`flex flex-col min-h-screen ${isPublicRoute ? 'bg-background dark:bg-background' : 'bg-gray-50 dark:bg-background'}`}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
