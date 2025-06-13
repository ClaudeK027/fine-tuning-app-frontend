// fine-tuning-app-frontend/src/services/api.ts

import axios from "axios";

// Lire l'URL de base de l'API depuis les variables d'environnement de Vite.
// Fallback sur /api si la variable n'est pas définie.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Interface pour décrire la structure d'un modèle IA
export interface AIModel {
  id: number;
  name: string;
  description?: string | null;
  architecture?: string | null;
  upload_path?: string | null; // Chemin interne
  upload_path_url?: string | null; // URL publique/servie
  model_type: string; // Ajout basé sur le modèle Django
  model_type_display: string; // Ajout pour la version lisible
  created_at: string;
  updated_at: string;
}

// Interface pour décrire la structure d'un dataset
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

// --- Ajouts pour Itération 2 --- 

// Interface pour les hyperparamètres (peut être affinée)
export interface Hyperparameters {
  lr?: number;
  epochs?: number;
  batch_size?: number;
  [key: string]: any; // Permet d'autres clés si nécessaire
}

// Interface pour un FineTuningJob
export interface FineTuningJob {
  id: number;
  model: number; // ID du modèle
  dataset: number; // ID du dataset
  model_details?: AIModel; // Détails imbriqués (lecture)
  dataset_details?: Dataset; // Détails imbriqués (lecture)
  hyperparameters: Hyperparameters;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  status_display: string; // Ajout pour la version lisible
  celery_task_id?: string | null;
  output_model_path?: string | null;
  created_at: string;
  updated_at: string;
  error_message?: string | null;
}

// Interface pour les données de création d'un job (envoyées au POST)
export interface CreateFineTuningJobPayload {
  model_id: number;
  dataset_id: number;
  hyperparameters: Hyperparameters;
}

// --- Fin Ajouts pour Itération 2 --- 


// Fonction pour récupérer la liste des modèles
export const getModels = async (): Promise<AIModel[]> => {
  const response = await axios.get<AIModel[]>(`${API_BASE_URL}/ai-models/`);
  return response.data;
};

// Fonction pour récupérer la liste des datasets
export const getDatasets = async (): Promise<Dataset[]> => {
  const response = await axios.get<Dataset[]>(`${API_BASE_URL}/datasets/`);
  return response.data;
};

// Fonction pour supprimer un dataset
export const deleteDataset = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/datasets/${id}/`);
};

// Fonction pour uploader un nouveau modèle
export const uploadModel = async (formData: FormData): Promise<AIModel> => {
  const response = await axios.post<AIModel>(`${API_BASE_URL}/ai-models/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Fonction pour uploader un nouveau dataset
export const uploadDataset = async (formData: FormData): Promise<Dataset> => {
  const response = await axios.post<Dataset>(`${API_BASE_URL}/datasets/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Fonction pour vérifier l'état de santé
export const getHealthCheck = async (): Promise<{ status: string }> => {
  const response = await axios.get<{ status: string }>(`${API_BASE_URL}/healthcheck/`);
  return response.data;
};


// --- Fonctions pour les Fine-Tuning Jobs (Ajout Itération 2) ---

// Créer un nouveau job
export const createFineTuningJob = async (payload: CreateFineTuningJobPayload): Promise<FineTuningJob> => {
  const response = await axios.post<FineTuningJob>(`${API_BASE_URL}/fine-tuning-jobs/`, payload);
  return response.data;
};

// Récupérer la liste des jobs
export const getFineTuningJobs = async (): Promise<FineTuningJob[]> => {
  const response = await axios.get<FineTuningJob[]>(`${API_BASE_URL}/fine-tuning-jobs/`);
  return response.data;
};

// Récupérer les détails d'un job spécifique
export const getFineTuningJob = async (id: number): Promise<FineTuningJob> => {
  const response = await axios.get<FineTuningJob>(`${API_BASE_URL}/fine-tuning-jobs/${id}/`);
  return response.data;
};

// Supprimer un job de fine-tuning
export const deleteFineTuningJob = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/fine-tuning-jobs/${id}/`);
};

// --- Fin Fonctions Fine-Tuning Jobs --- 
