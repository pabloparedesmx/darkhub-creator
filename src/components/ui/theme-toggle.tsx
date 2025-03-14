
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Array of routes that should always use dark mode
const FORCE_DARK_ROUTES = ['/', '/login', '/signup'];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  // Check if we're on a route that forces dark mode
  const shouldForceDarkMode = FORCE_DARK_ROUTES.includes(location.pathname);
  
  // Don't render the toggle on forced dark mode pages
  if (shouldForceDarkMode) {
    return null;
  }
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
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
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
