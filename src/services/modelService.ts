import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AIModel {
    id: number;
    name: string;
    description?: string;
    model_type: string;
    architecture: string;
    upload_path: string;
    created_at: string;
}

const getModels = async (): Promise<AIModel[]> => {
    const response = await axios.get(`${API_URL}/api/ai-models/`);
    return response.data;
};

const deleteModel = async (modelId: number): Promise<void> => {
    await axios.delete(`${API_URL}/api/ai-models/${modelId}/`);
};

export const modelService = {
    getModels,
    deleteModel,
}; 