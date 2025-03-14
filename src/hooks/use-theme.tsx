
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
  logoUrl: string;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,
  logoUrl: '/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png', // Dark mode logo (default)
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

  const [logoUrl, setLogoUrl] = useState<string>(
    theme === 'light' 
      ? '/lovable-uploads/91142018-76c6-4b4e-ac1e-00b29d6464f6.png'  // Light mode logo
      : '/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png'  // Dark mode logo
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Store the current theme
    localStorage.setItem(storageKey, theme);

    // Update logo URL based on theme
    setLogoUrl(
      theme === 'light'
        ? '/lovable-uploads/91142018-76c6-4b4e-ac1e-00b29d6464f6.png'  // Light mode logo
        : '/lovable-uploads/a1eb8418-2a78-4ec8-b3f9-ac0807a34936.png'  // Dark mode logo
    );
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
    logoUrl,
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
