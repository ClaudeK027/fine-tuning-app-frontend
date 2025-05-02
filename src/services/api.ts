import axios from 'axios';

// L'URL de base de notre API, utilisant le proxy configuré dans vite.config.ts
const API_BASE_URL = '/api';

// Interface pour décrire la structure d'un modèle IA (optionnel mais recommandé avec TS)
export interface AIModel {
  id: number;
  name: string;
  description?: string | null;
  architecture?: string | null;
  upload_path?: string | null; // Chemin interne (peut être utile)
  upload_path_url?: string | null; // URL publique/servie
  created_at: string;
  updated_at: string;
}

// Interface pour décrire la structure d'un dataset (optionnel mais recommandé avec TS)
export interface Dataset {
  id: number;
  name: string;
  description?: string | null;
  file_format?: string | null;
  upload_path: string; // Requis pour dataset
  upload_path_url?: string | null;
  created_at: string;
  updated_at: string;
}

// Fonction pour récupérer la liste des modèles
export const getModels = async (): Promise<AIModel[]> => {
  const response = await axios.get<AIModel[]>(`${API_BASE_URL}/models/`);
  return response.data;
};

// Fonction pour récupérer la liste des datasets
export const getDatasets = async (): Promise<Dataset[]> => {
  const response = await axios.get<Dataset[]>(`${API_BASE_URL}/datasets/`);
  return response.data;
};

// Fonction pour uploader un nouveau modèle
// Prend un objet FormData qui contient les champs et le fichier
export const uploadModel = async (formData: FormData): Promise<AIModel> => {
  const response = await axios.post<AIModel>(`${API_BASE_URL}/models/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Fonction pour uploader un nouveau dataset
export const uploadDataset = async (formData: FormData): Promise<Dataset> => {
  const response = await axios.post<Dataset>(`${API_BASE_URL}/datasets/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Vous pouvez aussi garder la fonction healthcheck ici si vous le souhaitez
export const getHealthCheck = async (): Promise<{ status: string }> => {
  const response = await axios.get<{ status: string }>(`${API_BASE_URL}/healthcheck/`);
  return response.data;
};

