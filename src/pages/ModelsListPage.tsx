import React, { useState, useEffect } from 'react';
import { getModels, AIModel } from '../services/api';
// Importations MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper'; // Pour encadrer la liste
import Box from '@mui/material/Box';

// Interface pour les props (utile si on passe la clé)
interface ModelsListPageProps {
  key?: number; // Accepte la clé pour le re-render
}

const ModelsListPage: React.FC<ModelsListPageProps> = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const data = await getModels();
        setModels(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des modèles:", err);
        setError('Impossible de charger les modèles.');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Liste des Modèles IA
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}

      {!loading && !error && (
        <Paper elevation={2} sx={{ mt: 2 }}> {/* Encadre la liste avec Paper */}
          {models.length === 0 ? (
            <Typography sx={{ p: 2 }}>Aucun modèle trouvé.</Typography>
          ) : (
            <List>
              {models.map((model) => (
                <ListItem key={model.id} divider> {/* Ajoute un séparateur */}
                  <ListItemText
                    primary={model.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: 'block' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {`Type: ${model.model_type || 'Non spécifié'} - Architecture: ${model.architecture || 'N/A'}`}
                        </Typography>
                        {model.description}
                      </React.Fragment>
                    }
                  />
                  {/* Ajoutez ici des actions si nécessaire (ex: IconButton) */}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ModelsListPage;
