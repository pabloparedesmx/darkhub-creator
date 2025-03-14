
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

  // Get the current path from window.location
  const currentPath = window.location.pathname;
  
  // Detect if we're on a public route (homepage, login, signup)
  const isPublicRoute = 
    currentPath === '/' || 
    currentPath === '/login' || 
    currentPath === '/signup';

  // Set the appropriate default theme based on route
  const routeBasedDefaultTheme = isPublicRoute ? 'dark' : 'light';

  useEffect(() => {
    // Always enforce dark mode on public routes
    if (isPublicRoute) {
      setTheme('dark');
    } else {
      // Apply the default theme based on route only if user hasn't set a preference yet
      if (!localStorage.getItem(storageKey)) {
        setTheme(routeBasedDefaultTheme);
      }
    }
  }, [currentPath, routeBasedDefaultTheme, storageKey, isPublicRoute]);

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
    setTheme: (theme: Theme) => {
      // Only allow theme changes on non-public routes
      if (!isPublicRoute) {
        setTheme(theme);
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
