// src/App.tsx
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import ModelsListPage from './pages/ModelsListPage';
import DatasetsListPage from './pages/DatasetsListPage';
import SettingsPage from './pages/SettingsPage';
import ModelUploadForm from './components/ModelUploadForm';
import DatasetUploadForm from './components/DatasetUploadForm';
import './App.css';
import { useState, useEffect } from 'react';

// Importations MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar'; // Importez Toolbar pour utiliser son mixin
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// Icônes
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import StorageIcon from '@mui/icons-material/Storage';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

function App() {
  const [modelsKey, setModelsKey] = useState(0);
  const [datasetsKey, setDatasetsKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleModelUploadSuccess = () => {
    setModelsKey(prevKey => prevKey + 1);
  };

  const handleDatasetUploadSuccess = () => {
    setDatasetsKey(prevKey => prevKey + 1);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        FineTuner
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/models">
            <ListItemIcon>
              <ModelTrainingIcon />
            </ListItemIcon>
            <ListItemText primary="Modèles" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/datasets">
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary="Datasets" />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Paramètres" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar maintenant en position 'fixed' */}
      <AppBar position="fixed"> 
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                flexGrow: { xs: 1, md: 0 },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FineTuner
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <Button 
                component={RouterLink} 
                to="/models" 
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                Modèles
              </Button>
              <Button 
                component={RouterLink} 
                to="/datasets" 
                sx={{ my: 2, color: 'inherit', display: 'block', ml: 2 }}
              >
                Datasets
              </Button>
              <IconButton 
                component={RouterLink} 
                to="/settings" 
                color="inherit" 
                sx={{ ml: 2 }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Tiroir de navigation (pas de changement ici) */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer} 
        </Drawer>
      </Box>

      {/* Contenu principal - Ajout d'un Box pour appliquer le décalage */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          // Applique le décalage nécessaire pour le contenu sous l'AppBar fixe
          // Utilise theme.mixins.toolbar pour obtenir la hauteur correcte
          pt: (theme) => `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(4)})`, // Ajoute la marge initiale (mt: 4)
          pb: 4, // Garde la marge basse
          // Applique le padding horizontal du Container directement ici
          px: { xs: 2, sm: 3 } 
        }}
      >
        {/* Le Container est maintenant juste pour limiter la largeur, sans marges verticales */}
        <Container maxWidth="xl" disableGutters={false}> 
          <Routes>
            <Route path="/" element={
              <Typography variant="h4" component="h1" gutterBottom>
                Bienvenue sur FineTuner
              </Typography>
            } />
            <Route 
              path="/models" 
              element={
                <Box>
                  <ModelsListPage key={modelsKey} /> 
                  <Box sx={{ mt: 4 }}>
                    <ModelUploadForm onUploadSuccess={handleModelUploadSuccess} />
                  </Box>
                </Box>
              }
            />
            <Route 
              path="/datasets" 
              element={
                <Box>
                  <DatasetsListPage key={datasetsKey} />
                  <Box sx={{ mt: 4 }}>
                    <DatasetUploadForm onUploadSuccess={handleDatasetUploadSuccess} />
                  </Box>
                </Box>
              }
            />
            <Route path="/settings" element={<SettingsPage />} /> 
            <Route path="*" element={<Typography>Page non trouvée</Typography>} />
          </Routes>
        </Container>
      </Box>

      {/* Pied de page (pas de changement ici) */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.background.paper }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '} {new Date().getFullYear()} FineTuner App
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}

export default App;
