
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
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'dashboard-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // First remove both classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Check if we're in a dashboard area
    if (window.location.pathname.match(/^\/(dashboard|courses|profile|admin)/)) {
      root.classList.add('dashboard-area');
      // In dashboard area, use the selected theme (light or dark)
    } else {
      // For non-dashboard pages, force dark mode regardless of theme setting
      if (theme === 'light') {
        root.classList.remove('light');
        root.classList.add('dark');
      }
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Only allow theme switching on dashboard pages
      if (window.location.pathname.match(/^\/(dashboard|courses|profile|admin)/)) {
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
