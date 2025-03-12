'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Темы
export const lightTheme = {
  isDarkMode: false,
  background: '#ffffff',
  text: '#111827',
  secondaryText: '#4b5563',
  primary: '#3b82f6',
  secondary: '#f3f4f6',
  danger: '#ef4444',
  border: '#d1d5db',
  cardBackground: '#ffffff',
  navBackground: '#ffffff',
  shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  inputBackground: '#ffffff',
  hoverBackground: '#e5e7eb',
  titleColor: '#111827',
  headingColor: '#1f2937',
};

export const darkTheme = {
  isDarkMode: true,
  background: '#121212',
  text: '#ffffff',
  secondaryText: '#a3a3a3',
  primary: '#60a5fa',
  secondary: '#2d3748',
  danger: '#f87171',
  border: '#4b5563',
  cardBackground: '#1e1e1e',
  navBackground: '#1e1e1e',
  shadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
  inputBackground: '#2d3748',
  hoverBackground: '#374151',
  titleColor: '#ffffff',
  headingColor: '#e5e7eb',
};

type ThemeContextType = {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (prefersDark) {
      setIsDarkMode(true);
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 