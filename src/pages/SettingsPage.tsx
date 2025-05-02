// src/pages/SettingsPage.tsx
import React from 'react';
import { useThemeContext } from '../context/ThemeContext'; // Importez le hook
// Importations MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icône sombre
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icône claire

const SettingsPage: React.FC = () => {
  // Récupère le mode actuel et la fonction pour le changer depuis le contexte
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Paramètres
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mt: 2, maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Apparence
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'} // Coche si le mode est sombre
              onChange={toggleTheme} // Appelle la fonction du contexte au changement
              color="secondary" // Utilise la couleur secondaire pour le switch
            />
          }
          label={mode === 'dark' ? 'Mode Sombre' : 'Mode Clair'}
          labelPlacement="start" // Place le label avant le switch
          sx={{ justifyContent: 'space-between', ml: 0, width: '100%' }} // Style pour aligner
        />
        {/* Affiche l'icône correspondante au mode */}
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          {mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
