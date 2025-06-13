import React, { useState, useEffect, useCallback } from 'react';
import { getDatasets, uploadDataset, deleteDataset, Dataset } from '../services/api';
// Importations MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

// --- Composant Formulaire d'Upload ---
interface DatasetUploadFormProps {
  onUploadSuccess: () => void;
}

const DatasetUploadForm: React.FC<DatasetUploadFormProps> = ({ onUploadSuccess }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !file) {
      setError('Le nom et le fichier du dataset sont requis.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (description) formData.append('description', description);
    formData.append('upload_path', file as Blob);

    setUploading(true);
    setError(null);

    try {
      await uploadDataset(formData);
      setName('');
      setDescription('');
      setFile(null);
      const fileInput = document.getElementById('dataset-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      onUploadSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload du dataset:", err);
      let errorMessage = 'Échec de l\'upload du dataset.';
      if (err instanceof Error) errorMessage += ` (${err.message})`;
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Uploader un nouveau Dataset
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="dataset-name"
          label="Nom du Dataset"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          id="dataset-description"
          label="Description (optionnel)"
          name="description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 1, textTransform: 'none' }}
        >
          Choisir un fichier (.csv, .json, ...){' '}
          {file ? `(${file.name})` : ''}
          <input
            id="dataset-file-input"
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        >
          {uploading ? 'Upload en cours...' : 'Uploader le Dataset'}
        </Button>
      </Box>
    </Paper>
  );
};

// --- Composant Principal de la Page ---
const DatasetsListPage: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDatasets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getDatasets();
            setDatasets(data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors de la récupération des datasets:", err);
            setError("Impossible de charger la liste des datasets.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDatasets();
    }, [fetchDatasets]);

    const handleUploadSuccess = () => {
        // Rafraîchir la liste après un upload réussi
        fetchDatasets();
    };

    const handleDelete = async (datasetId: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dataset ?')) {
            try {
                await deleteDataset(datasetId);
                // Mettre à jour l'état pour retirer le dataset de la liste
                setDatasets(prev => prev.filter(d => d.id !== datasetId));
            } catch (err) {
                console.error("Erreur lors de la suppression du dataset:", err);
                setError(`Impossible de supprimer le dataset #${datasetId}.`);
            }
        }
    };
  
    const formatDate = (dateString: string) => {
        try {
          return new Date(dateString).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
        } catch (e) {
          return dateString;
        }
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Datasets
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <DatasetUploadForm onUploadSuccess={handleUploadSuccess} />
      </Box>

      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Paper elevation={2} sx={{ p: 3, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Datasets Enregistrés
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : datasets.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              Aucun dataset trouvé.
            </Typography>
          ) : (
            <List disablePadding>
              {datasets.map((dataset, index) => (
                <ListItem key={dataset.id} divider={index < datasets.length - 1}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {dataset.name}
                      </Typography>
                    }
                    secondary={`Format: ${dataset.file_format ?? 'N/A'} - Ajouté le: ${formatDate(dataset.created_at)}`}
                  />
                  <Tooltip title="Télécharger le dataset">
                    <IconButton href={dataset.upload_path_url} target="_blank" rel="noopener noreferrer" disabled={!dataset.upload_path_url}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer le dataset">
                    <IconButton onClick={() => handleDelete(dataset.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DatasetsListPage;
