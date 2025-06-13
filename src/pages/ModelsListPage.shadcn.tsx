import React, { useState, useEffect, useCallback } from 'react';
import { modelService, AIModel } from '@/services/modelService'; // Assuming modelService is adapted or will be
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Loader2, AlertCircle, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ModelUploadFormShadcn from '@/components/ModelUploadForm.shadcn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ModelsListPageShadcn: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedModels = await modelService.getModels();
      setModels(fetchedModels);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des modèles:", err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
      setError(`Impossible de charger la liste des modèles: ${errorMessage}`);
      toast.error(`Impossible de charger la liste des modèles.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleUploadSuccess = () => {
    toast.success('Modèle uploadé avec succès !');
    fetchModels();
    setIsUploadModalOpen(false);
  };

  const handleDeleteClick = (modelId: number) => {
    setSelectedModelId(modelId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedModelId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedModelId === null) return;

    try {
      await modelService.deleteModel(selectedModelId);
      toast.success('Modèle supprimé avec succès !');
      fetchModels(); // Refresh the list
    } catch (error) {
      console.error('Erreur lors de la suppression du modèle:', error);
      toast.error('Erreur lors de la suppression du modèle.');
    } finally {
      handleDeleteClose();
    }
  };

  const getSelectedModelName = () => {
    return models.find(m => m.id === selectedModelId)?.name || '';
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Modèles</h1>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Uploader un modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Uploader un nouveau modèle</DialogTitle>
              <DialogDescription>
                Fournissez les détails et le fichier de votre modèle pour l'ajouter à la plateforme.
              </DialogDescription>
            </DialogHeader>
            <ModelUploadFormShadcn onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des modèles..."
          className="pl-8 sm:w-1/2 md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modèles Enregistrés</CardTitle>
          <CardDescription>Liste de tous les modèles disponibles sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Aucun modèle trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModels.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell>{model.model_type || 'N/A'}</TableCell>
                      <TableCell>{new Date(model.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(model.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement le modèle "{getSelectedModelName()}" et tous ses fichiers associés du serveur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteClose}>Annuler</AlertDialogCancel>
            <Button onClick={handleDeleteConfirm} variant="destructive">
              Supprimer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ModelsListPageShadcn;
