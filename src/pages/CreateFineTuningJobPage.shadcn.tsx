// fine-tuning-app-frontend/src/pages/CreateFineTuningJobPage.shadcn.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "sonner";
import { getModels, getDatasets, createFineTuningJob, AIModel, Dataset, Hyperparameters, CreateFineTuningJobPayload } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from '@/components/ui/combobox';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import axios from 'axios'; // Import axios for type checking

const CreateFineTuningJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState<AIModel[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [hyperparameters, setHyperparameters] = useState<Hyperparameters>({ lr: 0.00001, epochs: 1, batch_size: 8 });
  
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [loadingDatasets, setLoadingDatasets] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ model?: string; dataset?: string; lr?: string; epochs?: string; batch_size?: string }>({});

  // Load Models
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      setLoadingModels(true);
      try {
        const modelsData = await getModels();
        if (isMounted) {
          setModels(modelsData);
        }
      } catch (err) {
        if (isMounted) {
          let message = "une erreur inconnue est survenue";
          if (err instanceof Error) {
            message = err.message;
          }
          if (axios.isAxiosError(err) && err.response?.data?.detail) {
            message = err.response.data.detail;
          }
          toast.error(`Impossible de charger les modèles: ${message}`);
        }
      } finally {
        if (isMounted) {
          setLoadingModels(false);
        }
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  // Load Datasets
  useEffect(() => {
    let isMounted = true;
    const loadDatasets = async () => {
      setLoadingDatasets(true);
      try {
        const datasetsData = await getDatasets();
        if (isMounted) {
          setDatasets(datasetsData);
        }
      } catch (err) {
        if (isMounted) {
          let message = "une erreur inconnue est survenue";
          if (err instanceof Error) {
            message = err.message;
          }
          if (axios.isAxiosError(err) && err.response?.data?.detail) {
            message = err.response.data.detail;
          }
          toast.error(`Impossible de charger les datasets: ${message}`);
        }
      } finally {
        if (isMounted) {
          setLoadingDatasets(false);
        }
      }
    };
    loadDatasets();
    return () => { isMounted = false; };
  }, []);

  const handleHyperparameterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numericValue = value === '' ? undefined : Number(value);

    setHyperparameters(prev => ({ ...prev, [name]: numericValue }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { model?: string; dataset?: string; lr?: string; epochs?: string; batch_size?: string } = {};
    if (!selectedModelId) {
      errors.model = "Le modèle est requis.";
    }
    if (!selectedDatasetId) {
      errors.dataset = "Le dataset est requis.";
    }
    if (!hyperparameters.lr || hyperparameters.lr <= 0) {
      errors.lr = "Le taux d'apprentissage doit être un nombre positif.";
    }
    if (hyperparameters.epochs === undefined || hyperparameters.epochs < 1) {
      errors.epochs = "Le nombre d'époques doit être d'au moins 1.";
    }
    if (hyperparameters.batch_size === undefined || hyperparameters.batch_size < 1) {
      errors.batch_size = "La taille du batch doit être d'au moins 1.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload: CreateFineTuningJobPayload = {
      model_id: parseInt(selectedModelId, 10),
      dataset_id: parseInt(selectedDatasetId, 10),
      hyperparameters: hyperparameters,
    };

    try {
      await createFineTuningJob(payload);
      toast.success("Job de fine-tuning créé avec succès !", {
        description: "Vous allez être redirigé vers la liste des jobs.",
      });
      setTimeout(() => navigate('/fine-tuning-jobs'), 2000);
    } catch (err) {
      let message = "Une erreur inconnue est survenue lors de la création du job.";
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        message = err.response.data.detail;
      }
      setSubmitError(message);
      toast.error("Erreur de soumission", { description: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Créer un Job d'Affinage</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild disabled={submitting}>
            <RouterLink to="/fine-tuning-jobs">Annuler</RouterLink>
          </Button>
          <Button type="submit" disabled={submitting || loadingModels || loadingDatasets}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Lancer l'affinage
          </Button>
        </div>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de Base</CardTitle>
            <CardDescription>
              Sélectionnez le modèle de base et le jeu de données pour l'entraînement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Combobox
                  options={models.map(model => ({ value: String(model.id), label: model.name }))}
                  value={selectedModelId || ''}
                  onChange={(value) => setSelectedModelId(value)}
                  placeholder="Sélectionner un modèle"
                  searchPlaceholder="Rechercher un modèle..."
                  emptyMessage="Aucun modèle trouvé."
                />
                {formErrors.model && <p className="text-sm text-destructive">{formErrors.model}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Combobox
                  options={datasets.map(dataset => ({ value: String(dataset.id), label: dataset.name }))}
                  value={selectedDatasetId || ''}
                  onChange={(value) => setSelectedDatasetId(value)}
                  placeholder="Sélectionner un dataset"
                  searchPlaceholder="Rechercher un dataset..."
                  emptyMessage="Aucun dataset trouvé."
                />
                {formErrors.dataset && <p className="text-sm text-destructive">{formErrors.dataset}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hyperparamètres</CardTitle>
            <CardDescription>Ajustez les paramètres pour optimiser le processus d'entraînement.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="lr">Taux d'apprentissage</Label>
              <Input type="number" id="lr" name="lr" value={hyperparameters.lr ?? ''} onChange={handleHyperparameterChange} step={0.00001} min={0} disabled={submitting} />
              {formErrors.lr && <p className="text-sm text-destructive mt-2">{formErrors.lr}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="epochs">Nombre d'époques</Label>
              <Input type="number" id="epochs" name="epochs" value={hyperparameters.epochs ?? ''} onChange={handleHyperparameterChange} step={1} min={1} disabled={submitting} />
              {formErrors.epochs && <p className="text-sm text-destructive mt-2">{formErrors.epochs}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="batch_size">Taille du Batch</Label>
              <Input type="number" id="batch_size" name="batch_size" value={hyperparameters.batch_size ?? ''} onChange={handleHyperparameterChange} step={1} min={1} disabled={submitting} />
              {formErrors.batch_size && <p className="text-sm text-destructive mt-2">{formErrors.batch_size}</p>}
            </div>
          </CardContent>
        </Card>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de soumission</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
};

export default CreateFineTuningJobPage;
