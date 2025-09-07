import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Define available themes
export const THEMES = {
  DEFAULT: 'default',
  PURPLE: 'purple',
  GREEN: 'green',
  ORANGE: 'orange',
  BLUE: 'blue',
  PINK: 'pink',
  DARK: 'dark'
};

// Theme configurations
export const THEME_CONFIGS = {
  [THEMES.DEFAULT]: {
    name: 'Default Blue',
    primary: 'blue-600',
    primaryLight: 'blue-50',
    primaryDark: 'blue-700',
    accent: 'blue-500',
    gradient: 'from-blue-600 to-purple-700',
    sidebar: 'bg-white border-gray-200',
    header: 'bg-white border-gray-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    primaryColor: '#2563eb',
    accentColor: '#3b82f6',
    primaryRgb: '37, 99, 235',
    accentRgb: '59, 130, 246'
  },
  [THEMES.PURPLE]: {
    name: 'Royal Purple',
    primary: 'purple-600',
    primaryLight: 'purple-50',
    primaryDark: 'purple-700',
    accent: 'purple-500',
    gradient: 'from-purple-600 to-pink-600',
    sidebar: 'bg-white border-purple-200',
    header: 'bg-white border-purple-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-purple-200',
    primaryColor: '#9333ea',
    accentColor: '#a855f7',
    primaryRgb: '147, 51, 234',
    accentRgb: '168, 85, 247'
  },
  [THEMES.GREEN]: {
    name: 'Nature Green',
    primary: 'green-600',
    primaryLight: 'green-50',
    primaryDark: 'green-700',
    accent: 'green-500',
    gradient: 'from-green-600 to-teal-600',
    sidebar: 'bg-white border-green-200',
    header: 'bg-white border-green-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-green-200',
    primaryColor: '#16a34a',
    accentColor: '#22c55e',
    primaryRgb: '22, 163, 74',
    accentRgb: '34, 197, 94'
  },
  [THEMES.ORANGE]: {
    name: 'Sunset Orange',
    primary: 'orange-600',
    primaryLight: 'orange-50',
    primaryDark: 'orange-700',
    accent: 'orange-500',
    gradient: 'from-orange-600 to-red-600',
    sidebar: 'bg-white border-orange-200',
    header: 'bg-white border-orange-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-orange-200',
    primaryColor: '#ea580c',
    accentColor: '#f97316',
    primaryRgb: '234, 88, 12',
    accentRgb: '249, 115, 22'
  },
  [THEMES.BLUE]: {
    name: 'Ocean Blue',
    primary: 'blue-500',
    primaryLight: 'blue-50',
    primaryDark: 'blue-600',
    accent: 'blue-400',
    gradient: 'from-blue-500 to-cyan-600',
    sidebar: 'bg-white border-blue-200',
    header: 'bg-white border-blue-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-blue-200',
    primaryColor: '#3b82f6',
    accentColor: '#60a5fa',
    primaryRgb: '59, 130, 246',
    accentRgb: '96, 165, 250'
  },
  [THEMES.PINK]: {
    name: 'Rose Pink',
    primary: 'pink-600',
    primaryLight: 'pink-50',
    primaryDark: 'pink-700',
    accent: 'pink-500',
    gradient: 'from-pink-600 to-rose-600',
    sidebar: 'bg-white border-pink-200',
    header: 'bg-white border-pink-200',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-pink-200',
    primaryColor: '#db2777',
    accentColor: '#ec4899',
    primaryRgb: '219, 39, 119',
    accentRgb: '236, 72, 153'
  },
  [THEMES.DARK]: {
    name: 'Dark Mode',
    primary: 'gray-700',
    primaryLight: 'gray-800',
    primaryDark: 'gray-900',
    accent: 'gray-600',
    gradient: 'from-gray-800 to-gray-900',
    sidebar: 'bg-gray-900 border-gray-700',
    header: 'bg-gray-900 border-gray-700',
    card: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    primaryColor: '#374151',
    accentColor: '#4b5563',
    primaryRgb: '55, 65, 81',
    accentRgb: '75, 85, 99'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Get theme from localStorage or default
    return localStorage.getItem('theme') || THEMES.DEFAULT;
  });

  const themeConfig = THEME_CONFIGS[currentTheme];

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    
    // Apply theme to document root for CSS variables
    const root = document.documentElement;
    const config = THEME_CONFIGS[theme];
    
    // Remove existing theme classes
    const themeClasses = ['theme-default', 'theme-purple', 'theme-green', 'theme-orange', 'theme-blue', 'theme-pink', 'theme-dark'];
    root.classList.remove(...themeClasses);
    document.body.classList.remove(...themeClasses);
    
    // Add new theme class
    root.classList.add(`theme-${theme}`);
    document.body.classList.add(`theme-${theme}`);
    
    // Set CSS custom properties for the theme - these will override the CSS file values
    root.style.setProperty('--theme-primary', config.primaryColor);
    root.style.setProperty('--theme-accent', config.accentColor);
    root.style.setProperty('--theme-primary-rgb', config.primaryRgb);
    root.style.setProperty('--theme-accent-rgb', config.accentRgb);
    
    // Set theme-aware colors based on theme type
    if (theme === THEMES.DARK) {
      root.style.setProperty('--theme-text', '#ffffff');
      root.style.setProperty('--theme-text-secondary', '#d1d5db');
      root.style.setProperty('--theme-card', '#1f2937');
      root.style.setProperty('--theme-border', '#374151');
      root.style.setProperty('--theme-bg', '#111827');
      root.style.setProperty('--theme-sidebar', '#1f2937');
      root.style.setProperty('--theme-header', '#1f2937');
    } else {
      // Light themes
      root.style.setProperty('--theme-text', '#111827');
      root.style.setProperty('--theme-text-secondary', '#6b7280');
      root.style.setProperty('--theme-card', '#ffffff');
      root.style.setProperty('--theme-border', '#e5e7eb');
      root.style.setProperty('--theme-bg', '#f9fafb');
      root.style.setProperty('--theme-sidebar', '#ffffff');
      root.style.setProperty('--theme-header', '#ffffff');
    }
    
    // Force a repaint to ensure changes are applied
    document.body.style.display = 'none';
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  };

  // Apply theme on mount
  useEffect(() => {
    changeTheme(currentTheme);
  }, [currentTheme]);

  const value = {
    currentTheme,
    themeConfig,
    changeTheme,
    availableThemes: THEMES,
    themeConfigs: THEME_CONFIGS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
