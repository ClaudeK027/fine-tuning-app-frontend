import React, { useState } from 'react';
import { uploadDataset } from '../services/api';
// Importations MUI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    <Paper elevation={2} sx={{ p: 3 }}>
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
          Choisir un fichier dataset {file ? `(${file.name})` : '(requis)'}
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

export default DatasetUploadForm;
