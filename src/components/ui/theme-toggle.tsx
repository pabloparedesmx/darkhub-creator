
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  // Check if we're on a public route
  const isPublicRoute = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup';
  
  // Don't render theme toggle on public routes
  if (isPublicRoute) {
    return null;
  }
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="rounded-full border border-blue-500/30 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-full"></div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-foreground" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
