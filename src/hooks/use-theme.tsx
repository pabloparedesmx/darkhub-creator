
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

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
  isPublicRoute: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
  isPublicRoute: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'dashboard-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  // Use location from react-router for consistency
  const location = useLocation();
  
  // Detect if we're on a public route (homepage, login, signup)
  const isPublicRoute = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup';

  useEffect(() => {
    // Always enforce dark mode on public routes
    if (isPublicRoute) {
      setTheme('dark');
    } else {
      // For non-public routes, respect user preference if it exists
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, [location.pathname, storageKey, isPublicRoute]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Only store theme preference if not on public routes
    if (!isPublicRoute) {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey, isPublicRoute]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Only allow theme changes on non-public routes
      if (!isPublicRoute) {
        setTheme(newTheme);
      }
    },
    isPublicRoute,
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
