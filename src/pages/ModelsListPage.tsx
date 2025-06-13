import React, { useState, useEffect, useCallback } from 'react';
import { modelService, AIModel } from '@/services/modelService';
import ModelUploadForm from '@/components/ModelUploadForm';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ModelsListPage: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
      try {
      const fetchedModels = await modelService.getModels();
      setModels(fetchedModels);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des modèles:", err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
      setError(`Impossible de charger la liste des modèles: ${errorMessage}`);
      toast.error(`Impossible de charger la liste des modèles.`);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleDeleteClick = (modelId: number) => {
    setSelectedModelId(modelId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedModelId(null);
  };

  const handleUploadSuccess = () => {
    toast.success('Modèle uploadé avec succès !');
    fetchModels();
  };

  const handleDeleteConfirm = async () => {
    if (selectedModelId === null) return;

    try {
      await modelService.deleteModel(selectedModelId);
      toast.success('Modèle supprimé avec succès !');
      fetchModels();
    } catch (error) {
      console.error('Erreur lors de la suppression du modèle:', error);
      toast.error('Erreur lors de la suppression du modèle.');
    } finally {
      handleDeleteClose();
    }
  };

  const getSelectedModelName = () => {
    return models.find(m => m.id === selectedModelId)?.name || '';
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
            Gestion des Modèles
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 800 }}>
            <ModelUploadForm onUploadSuccess={handleUploadSuccess} />
        </Box>

        <Box sx={{ width: '100%', maxWidth: 800 }}>
            <Paper elevation={2} sx={{ p: 0, width: '100%' }}>
                <Typography variant="h6" sx={{ p: 2 }}>
                    Modèles Enregistrés
      </Typography>

                {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Chemin</TableCell>
                                <TableCell>Créé le</TableCell>
                                <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
              {models.map((model) => (
                                <TableRow
                                    key={model.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                    {model.name}
                                    </TableCell>
                                    <TableCell>{model.upload_path}</TableCell>
                                    <TableCell>{new Date(model.created_at).toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                    <IconButton onClick={() => handleDeleteClick(model.id)} color="error">
                                        <Trash2 size={20} />
                                    </IconButton>
                                    </TableCell>
                                </TableRow>
              ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
          )}
        </Paper>
        </Box>

        <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Êtes-vous sûr ?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Cette action est irréversible. Elle supprimera définitivement le modèle "{getSelectedModelName()}" et tous ses fichiers associés du serveur.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleDeleteClose}>Annuler</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Supprimer
            </Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default ModelsListPage;
