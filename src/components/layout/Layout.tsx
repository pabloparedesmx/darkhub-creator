
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/hooks/use-theme';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme, isPublicRoute } = useTheme();
  
  return (
    <div className={`flex flex-col min-h-screen ${isPublicRoute ? 'bg-background dark:bg-background' : theme === 'light' ? 'bg-gray-50' : 'bg-background'}`}>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
