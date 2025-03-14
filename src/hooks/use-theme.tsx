
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme?: Theme;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Array of routes that should always use dark mode
const FORCE_DARK_ROUTES = ['/', '/login', '/signup'];

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'dashboard-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Get the current path from window.location
  const currentPath = window.location.pathname;
  
  // Check if we're on a route that should force dark mode
  const shouldForceDarkMode = FORCE_DARK_ROUTES.includes(currentPath);

  useEffect(() => {
    // For force dark mode routes, always use dark theme
    if (shouldForceDarkMode) {
      setTheme('dark');
      return;
    }
    
    // For other routes, apply the default theme based on route only if user hasn't set a preference yet
    if (!localStorage.getItem(storageKey)) {
      const isPublicRoute = 
        currentPath === '/' || 
        currentPath === '/login' || 
        currentPath === '/signup';
      const routeBasedDefaultTheme = isPublicRoute ? 'dark' : 'light';
      setTheme(routeBasedDefaultTheme);
    }
  }, [currentPath, storageKey, shouldForceDarkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Only store the theme if we're not on a force dark mode route
    if (!shouldForceDarkMode) {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey, shouldForceDarkMode]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Only allow theme changes if we're not on a force dark mode route
      if (!shouldForceDarkMode) {
        setTheme(newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
