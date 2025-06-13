import React, { useState } from 'react';
import { uploadModel } from '../services/api';
// Importations MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // Icône pour le bouton

const modelTypeChoices = {
  LLM: 'Grand Modèle de Langage (LLM)',
  IMG_GEN: 'Génération dimages',
  VOICE_GEN: 'Génération Vocale',
  VISION: 'Vision par Ordinateur (GenAI)',
  OTHER: 'Autre',
};
type ModelTypeKey = keyof typeof modelTypeChoices;

interface ModelUploadFormProps {
  onUploadSuccess: () => void;
}

const ModelUploadForm: React.FC<ModelUploadFormProps> = ({ onUploadSuccess }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<ModelTypeKey>('OTHER');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<ModelTypeKey>) => {
    setModelType(event.target.value as ModelTypeKey);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !file) {
      setError('Le nom et le fichier du modèle sont requis.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (description) formData.append('description', description);
    formData.append('file', file as Blob);
    formData.append('model_type', modelType);

    setUploading(true);
    setError(null);

    try {
      await uploadModel(formData);
      setName('');
      setDescription('');
      setFile(null);
      setModelType('OTHER');
      // Reset file input visually (important!)
      const fileInput = document.getElementById('model-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = ''; 
      onUploadSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload du modèle:", err);
      let errorMessage = 'Échec de l\'upload du modèle.';
      if (err instanceof Error) errorMessage += ` (${err.message})`;
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}> {/* Encadre le formulaire */}
      <Typography variant="h6" gutterBottom>
        Uploader un nouveau modèle
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="model-name"
          label="Nom du Modèle"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <TextField
          margin="normal"
          fullWidth
          id="model-description"
          label="Description (optionnel)"
          name="description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="model-type-label">Type de Modèle</InputLabel>
          <Select
            labelId="model-type-label"
            id="model-type"
            value={modelType}
            label="Type de Modèle"
            onChange={handleTypeChange}
          >
            {Object.entries(modelTypeChoices).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {/* Input de fichier stylisé */}
        <Button
          variant="outlined"
          component="label" // Permet au bouton d'agir comme un label pour l'input caché
          fullWidth
          sx={{ mt: 2, mb: 1, textTransform: 'none' }} // Style bouton
        >
          Choisir un fichier modèle {file ? `(${file.name})` : '(requis)'}
          <input 
            id="model-file-input" // ID pour le reset
            type="file" 
            hidden // Cache l'input moche par défaut
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
          {uploading ? 'Upload en cours...' : 'Uploader le Modèle'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ModelUploadForm;
