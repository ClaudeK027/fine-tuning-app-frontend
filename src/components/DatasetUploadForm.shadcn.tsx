import React, { useState, useRef } from 'react';
import { uploadDataset } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from 'sonner';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';

interface DatasetUploadFormProps {
  onUploadSuccess: () => void;
}

const DatasetUploadFormShadcn: React.FC<DatasetUploadFormProps> = ({ onUploadSuccess }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !file) {
      const errorMessage = 'Le nom et le fichier du dataset sont requis.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (description) formData.append('description', description);
    formData.append('file', file as Blob);

    setUploading(true);
    setError(null);

    try {
      await uploadDataset(formData);
      toast.success('Dataset uploadé avec succès!');
      setName('');
      setDescription('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
    } catch (err) {
      console.error("Erreur lors de l'upload du dataset:", err);
      let errorMessage = 'Échec de l\'upload du dataset.';
      if (err instanceof Error) errorMessage += ` (${err.message})`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Uploader un nouveau Dataset</CardTitle>
        <CardDescription>Fournissez les détails et le fichier de votre dataset.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dataset-name">Nom du Dataset *</Label>
            <Input
              id="dataset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: données-clients-2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset-description">Description (optionnel)</Label>
            <Textarea
              id="dataset-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement le contenu du dataset..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataset-file">Fichier Dataset * (.csv, .json, ...)</Label>
            <Input
              id="dataset-file"
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Uploader le Dataset</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DatasetUploadFormShadcn;
