import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeColor = 'blue' | 'purple' | 'green';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('studyapp_theme');
    return (saved as ThemeMode) || 'light';
  });

  const [color, setColor] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('studyapp_color');
    return (saved as ThemeColor) || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('studyapp_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('studyapp_color', color);
    const root = document.documentElement;
    root.classList.remove('theme-blue', 'theme-purple', 'theme-green');
    if (color !== 'blue') {
      root.classList.add(`theme-${color}`);
    }
  }, [color]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
