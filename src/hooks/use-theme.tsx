
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
  theme: 'light', // Changed default to light
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light', // Changed default to light
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

  // Force dark theme only on public routes, but don't override user preference after login
  useEffect(() => {
    if (isPublicRoute) {
      // Apply dark theme to DOM, but don't update state
      const root = window.document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      // When not on public routes, apply the user's theme preference
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Save the theme preference
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, isPublicRoute, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Always allow theme changes, even on public routes
      setTheme(newTheme);
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
