import React, { useState, useRef } from 'react';
import { uploadModel } from '../services/api'; // Assuming api service is compatible
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from 'sonner';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';

const modelTypeChoices = {
  LLM: 'Grand Modèle de Langage (LLM)',
  IMG_GEN: 'Génération d\'images',
  VOICE_GEN: 'Génération Vocale',
  VISION: 'Vision par Ordinateur (GenAI)',
  OTHER: 'Autre',
};
type ModelTypeKey = keyof typeof modelTypeChoices;

interface ModelUploadFormProps {
  onUploadSuccess: () => void;
}

const ModelUploadFormShadcn: React.FC<ModelUploadFormProps> = ({ onUploadSuccess }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [modelType, setModelType] = useState<ModelTypeKey>('OTHER');
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null); // Clear error if a file is selected
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !file) {
      setError('Le nom et le fichier du modèle sont requis.');
      toast.error('Le nom et le fichier du modèle sont requis.');
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
      toast.success('Modèle uploadé avec succès!');
      setName('');
      setDescription('');
      setFile(null);
      setModelType('OTHER');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
      onUploadSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload du modèle:", err);
      let errorMessage = 'Échec de l\'upload du modèle.';
      if (err instanceof Error) errorMessage += ` (${err.message})`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Uploader un nouveau modèle</CardTitle>
        <CardDescription>Fournissez les détails et le fichier de votre modèle.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model-name">Nom du Modèle *</Label>
            <Input
              id="model-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: mon-super-modèle-v1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-description">Description (optionnel)</Label>
            <Textarea
              id="model-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement votre modèle..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-type">Type de Modèle *</Label>
            <Select value={modelType} onValueChange={(value) => setModelType(value as ModelTypeKey)} required>
              <SelectTrigger id="model-type">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(modelTypeChoices).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-file">Fichier Modèle *</Label>
            <Input
              id="model-file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              required
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {file && <p className="text-sm text-muted-foreground mt-1">Fichier sélectionné: {file.name}</p>}
          </div>

          {error && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur d'Upload</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Uploader le Modèle</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModelUploadFormShadcn;
