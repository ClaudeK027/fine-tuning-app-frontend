// src/context/ThemeContext.tsx
import React, { createContext, useState, useMemo, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../theme'; // Importez vos thèmes

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Créez le contexte avec une valeur par défaut (qui ne sera pas réellement utilisée)
const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark', // Défaut initial
  toggleTheme: () => console.warn('toggleTheme function not ready'),
});

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  // Essaye de lire le thème préféré depuis localStorage, sinon utilise 'dark'
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const storedMode = localStorage.getItem('themeMode') as ThemeMode | null;
      return storedMode || 'dark'; // Défaut si rien n'est stocké
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage pour themeMode", error);
      return 'dark';
    }
  });

  // Mémorise la fonction toggleTheme pour éviter les re-renders inutiles
  const toggleTheme = useMemo(
    () => () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        try {
          localStorage.setItem('themeMode', newMode);
        } catch (error) {
          console.error("Erreur lors de l'écriture dans localStorage pour themeMode", error);
        }
        return newMode;
      });
    },
    [],
  );

  // Sélectionne le thème MUI en fonction du mode actuel
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Fournit le mode et la fonction toggleTheme via le contexte
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Applique le thème MUI sélectionné */}
      <MuiThemeProvider theme={theme}>
        {/* Applique les styles de base et la couleur de fond */}
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour utiliser facilement le contexte du thème
export const useThemeContext = () => useContext(ThemeContext);
