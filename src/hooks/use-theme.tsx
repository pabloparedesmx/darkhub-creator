
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
  
  // Detect if we're on a public route (login, signup)
  const isPublicRoute = 
    currentPath === '/' || 
    currentPath === '/login' || 
    currentPath === '/signup';

  // Force dark theme on public routes
  useEffect(() => {
    if (isPublicRoute) {
      setTheme('dark');
    }
  }, [isPublicRoute]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Only store theme preference if we're not on a public route
    if (!isPublicRoute) {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, storageKey, isPublicRoute]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (!isPublicRoute) {
        setTheme(theme);
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
