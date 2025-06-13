// fine-tuning-app-frontend/src/pages/CreateFineTuningJobPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getModels, getDatasets, createFineTuningJob, AIModel, Dataset, Hyperparameters, CreateFineTuningJobPayload } from "../services/api";
import axios from "axios";

// Importations MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid"; // Utilisation de Grid pour la disposition horizontale
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import FormHelperText from "@mui/material/FormHelperText";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink } from "react-router-dom";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles"; // Pour le style personnalisé

// Style personnalisé pour la surbrillance
const HighlightedFormControl = styled(FormControl)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5),
  transition: theme.transitions.create(["border-color", "box-shadow"]),
  "&:hover": {
    borderColor: theme.palette.text.primary,
  },
  "&.Mui-focused": {
    borderColor: theme.palette.primary.main,
    boxShadow: `${theme.palette.primary.main} 0 0 0 1px`,
  },
}));

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
  const [modelError, setModelError] = useState<string | null>(null); // Error state for models
  const [datasetError, setDatasetError] = useState<string | null>(null); // Error state for datasets
  const [formErrors, setFormErrors] = useState<{ model?: string; dataset?: string; lr?: string; epochs?: string; batch_size?: string }>({});

  // useEffect for loading models
  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      setLoadingModels(true);
      setModelError(null); // Clear previous model error
      try {
        const modelsData = await getModels();
        if (isMounted) {
          setModels(modelsData);
        }
      } catch (err: any) {
        if (isMounted) {
          const message = err?.response?.data?.detail || err?.message || "une erreur inconnue est survenue";
          setModelError(`Impossible de charger les modèles: ${message}`);
        }
      } finally {
        if (isMounted) {
          setLoadingModels(false);
        }
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []); // Run once on mount

  // useEffect for loading datasets
  useEffect(() => {
    let isMounted = true;
    const loadDatasets = async () => {
      setLoadingDatasets(true);
      setDatasetError(null); // Clear previous dataset error
      try {
        const datasetsData = await getDatasets();
        if (isMounted) {
          setDatasets(datasetsData);
        }
      } catch (err: any) {
        if (isMounted) {
          const message = err?.response?.data?.detail || err?.message || "une erreur inconnue est survenue";
          setDatasetError(`Impossible de charger les datasets: ${message}`);
        }
      } finally {
        if (isMounted) {
          setLoadingDatasets(false);
        }
      }
    };
    loadDatasets();
    return () => { isMounted = false; };
  }, []); // Run once on mount

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    setSelectedModelId(event.target.value);
    setFormErrors(prev => ({ ...prev, model: undefined }));
  };

  const handleDatasetChange = (event: SelectChangeEvent<string>) => {
    setSelectedDatasetId(event.target.value);
    setFormErrors(prev => ({ ...prev, dataset: undefined }));
  };

  const handleHyperparameterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let parsedValue: number | string = value;
    let errorMsg: string | undefined = undefined;

    if (name === "lr" || name === "epochs" || name === "batch_size") {
        parsedValue = name === "lr" ? parseFloat(value) : parseInt(value, 10);
        if (isNaN(parsedValue as number)) {
            errorMsg = "Doit être un nombre.";
            parsedValue = value;
        } else if ((name === "epochs" || name === "batch_size") && (parsedValue as number) <= 0) {
            errorMsg = "Doit être un entier positif.";
        } else if (name === "lr" && (parsedValue as number) <= 0) {
            errorMsg = "Doit être un nombre positif.";
        }
    }
    
    setHyperparameters(prev => ({ ...prev, [name]: parsedValue }));
    setFormErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};
    let isValid = true;
    if (!selectedModelId) {
      errors.model = "Veuillez sélectionner un modèle.";
      isValid = false;
    }
    if (!selectedDatasetId) {
      errors.dataset = "Veuillez sélectionner un dataset.";
      isValid = false;
    }
    
    const { lr, epochs, batch_size } = hyperparameters;
    if (lr === undefined || typeof lr !== "number" || lr <= 0) {
        errors.lr = "Taux d\\\\\\\\'apprentissage invalide (nombre positif requis).";
        isValid = false;
    }
    if (epochs === undefined || typeof epochs !== "number" || !Number.isInteger(epochs) || epochs <= 0) {
        errors.epochs = "Nombre d\\\\\\\\'époques invalide (entier positif requis).";
        isValid = false;
    }
    if (batch_size === undefined || typeof batch_size !== "number" || !Number.isInteger(batch_size) || batch_size <= 0) {
        errors.batch_size = "Taille de batch invalide (entier positif requis).";
        isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setModelError(null);
    setDatasetError(null);

    if (!validateForm()) {
      return;
    }

    const modelIdNum = parseInt(selectedModelId, 10);
    const datasetIdNum = parseInt(selectedDatasetId, 10);

    if (isNaN(modelIdNum) || isNaN(datasetIdNum)) {
        setModelError("Erreur interne: ID de modèle ou de dataset invalide."); // Or a general form error
        return;
    }

    const payload: CreateFineTuningJobPayload = {
      model_id: modelIdNum,
      dataset_id: datasetIdNum,
      hyperparameters: {
        lr: Number(hyperparameters.lr),
        epochs: Number(hyperparameters.epochs),
        batch_size: Number(hyperparameters.batch_size),
      },
    };

    setSubmitting(true);
    try {
      await createFineTuningJob(payload);
      navigate("/fine-tuning-jobs"); 
    } catch (err) {
      console.error("Erreur lors de la création du job:", err);
      let errorMsg = "Échec de la création du job de fine-tuning.";
      if (axios.isAxiosError(err) && err.response?.data) {
          const drfErrors = err.response.data;
          if (typeof drfErrors === "object" && drfErrors !== null) {
              const messages = Object.entries(drfErrors)
                  .map(([field, fieldErrors]) => 
                      `${field}: ${Array.isArray(fieldErrors) ? fieldErrors.join(", ") : fieldErrors}`
                  )
                  .join("; ");
              if (messages) errorMsg += ` Détails: ${messages}`;
          }
      }
      setModelError(errorMsg); // Or set a general submission error
      setSubmitting(false);
    } 
  };

  const renderSelectedValue = (selectedId: string, items: (AIModel | Dataset)[]) => {
    const selectedItem = items.find(item => item.id.toString() === selectedId);
    return selectedItem ? selectedItem.name : "";
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}> 
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/fine-tuning-jobs">
          Jobs de Fine-Tuning
        </Link>
        <Typography color="text.primary">Nouveau Job</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom>
        Lancer un Nouveau Job de Fine-Tuning
      </Typography>

      {/* Display model loading error */}
      {modelError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {modelError}
        </Alert>
      )}
      {/* Optionally, display dataset loading error separately or handle it differently */}
      {datasetError && !modelError && ( // Show dataset error only if no model error, or combine them
        <Alert severity="warning" sx={{ mb: 2 }}> {/* Using warning for dataset error to differentiate */}
          {datasetError}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}> 
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={4}> {/* Grid principal pour l'espacement vertical */} 
            
            {/* --- Section Configuration de Base --- */}
            <Grid item xs={12}> 
              <Typography variant="h6" component="h2" gutterBottom>
                Configuration de Base
              </Typography>
              <Grid container spacing={3}> {/* Grid pour Modèle et Dataset côte à côte */} 
                {/* Modèle */}
                <Grid item xs={12} sm={6}> 
                  <HighlightedFormControl fullWidth required error={!!formErrors.model}>
                    <InputLabel id="model-select-label">Modèle de Base</InputLabel>
                    <Select
                      labelId="model-select-label"
                      id="model-select"
                      value={selectedModelId}
                      label="Modèle de Base"
                      onChange={handleModelChange}
                      disabled={loadingModels || submitting}
                      renderValue={(selected) => renderSelectedValue(selected, models)} 
                      variant="outlined" // Assurer le style standard
                      sx={{ ".MuiOutlinedInput-notchedOutline": { border: "none" } }} // Cacher la bordure par défaut du Select
                    >
                      {loadingModels && <MenuItem disabled value=""><em>Chargement des modèles...</em></MenuItem>}
                      {!loadingModels && models.length === 0 && <MenuItem disabled value=""><em>Aucun modèle disponible</em></MenuItem>}
                      {models.map((model) => (
                        <MenuItem key={model.id} value={model.id.toString()}>
                          <ListItemText 
                            primary={model.name} 
                            secondary={`${model.model_type_display} - Arch: ${model.architecture || 'N/A'}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.model && <FormHelperText>{formErrors.model}</FormHelperText>}
                  </HighlightedFormControl>
                </Grid>

                {/* Dataset */}
                <Grid item xs={12} sm={6}> 
                  <HighlightedFormControl fullWidth required error={!!formErrors.dataset}>
                    <InputLabel id="dataset-select-label">Dataset</InputLabel>
                    <Select
                      labelId="dataset-select-label"
                      id="dataset-select"
                      value={selectedDatasetId}
                      label="Dataset"
                      onChange={handleDatasetChange}
                      disabled={loadingDatasets || submitting}
                      renderValue={(selected) => renderSelectedValue(selected, datasets)}
                      variant="outlined"
                      sx={{ ".MuiOutlinedInput-notchedOutline": { border: "none" } }}
                    >
                      {loadingDatasets && <MenuItem disabled value=""><em>Chargement des datasets...</em></MenuItem>}
                      {!loadingDatasets && datasets.length === 0 && <MenuItem disabled value=""><em>Aucun dataset disponible</em></MenuItem>}
                      {datasets.map((dataset) => (
                        <MenuItem key={dataset.id} value={dataset.id.toString()}>
                          <ListItemText 
                            primary={dataset.name} 
                            secondary={`Format: ${dataset.file_format || 'N/A'}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.dataset && <FormHelperText>{formErrors.dataset}</FormHelperText>}
                  </HighlightedFormControl>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}> 
              <Divider />
            </Grid>

            {/* --- Section Hyperparamètres --- */}
            <Grid item xs={12}> 
              <Typography variant="h6" component="h2" gutterBottom>
                Hyperparamètres
              </Typography>
              <Grid container spacing={3}> {/* Grid pour les hyperparamètres en ligne */} 
                {/* Taux d'apprentissage */}
                <Grid item xs={12} sm={4}> 
                  <TextField
                    required
                    fullWidth
                    id="lr"
                    label="Taux d'apprentissage (lr)"
                    name="lr"
                    type="number"
                    value={hyperparameters.lr ?? ""}
                    onChange={handleHyperparameterChange}
                    inputProps={{ step: "0.00001", min: "0" }}
                    error={!!formErrors.lr}
                    helperText={formErrors.lr || "Ex: 1e-5"}
                    disabled={submitting}
                    variant="outlined"
                  />
                </Grid>
                {/* Nombre d'époques */}
                <Grid item xs={12} sm={4}> 
                  <TextField
                    required
                    fullWidth
                    id="epochs"
                    label="Nombre d'époques"
                    name="epochs"
                    type="number"
                    value={hyperparameters.epochs ?? ""}
                    onChange={handleHyperparameterChange}
                    inputProps={{ step: "1", min: "1" }}
                    error={!!formErrors.epochs}
                    helperText={formErrors.epochs || "Ex: 3"}
                    disabled={submitting}
                    variant="outlined"
                  />
                </Grid>
                {/* Taille du Batch */}
                <Grid item xs={12} sm={4}> 
                  <TextField
                    required
                    fullWidth
                    id="batch_size"
                    label="Taille du Batch"
                    name="batch_size"
                    type="number"
                    value={hyperparameters.batch_size ?? ""}
                    onChange={handleHyperparameterChange}
                    inputProps={{ step: "1", min: "1" }}
                    error={!!formErrors.batch_size}
                    helperText={formErrors.batch_size || "Ex: 8"}
                    disabled={submitting}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Bouton de soumission */}
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}> 
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || loadingModels || loadingDatasets}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                size="large"
                sx={{ minWidth: 180 }}
              >
                {submitting ? "Lancement..." : "Lancer le Job"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateFineTuningJobPage;

