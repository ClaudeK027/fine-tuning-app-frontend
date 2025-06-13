import React, { useState, useEffect, useCallback } from 'react';
import { getDatasets, deleteDataset, Dataset } from '../services/api';
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Trash2, Download, Loader2, AlertCircle, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DatasetUploadFormShadcn from '@/components/DatasetUploadForm.shadcn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

const DatasetsListPageShadcn: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDatasets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDatasets();
      setDatasets(data);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des datasets:", err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
      setError(`Impossible de charger la liste des datasets: ${errorMessage}`);
      toast.error(`Impossible de charger la liste des datasets.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const handleUploadSuccess = () => {
    toast.success('Dataset uploadé avec succès !');
    fetchDatasets();
    setIsUploadModalOpen(false);
  };

  const handleDeleteClick = (datasetId: number) => {
    setSelectedDatasetId(datasetId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedDatasetId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDatasetId === null) return;
    try {
      await deleteDataset(selectedDatasetId);
      toast.success('Dataset supprimé avec succès !');
      setDatasets(prev => prev.filter(d => d.id !== selectedDatasetId));
    } catch (err) {
      console.error("Erreur lors de la suppression du dataset:", err);
      toast.error(`Impossible de supprimer le dataset #${selectedDatasetId}.`);
    } finally {
      handleDeleteClose();
    }
  };

  const getSelectedDatasetName = () => {
    return datasets.find(d => d.id === selectedDatasetId)?.name || '';
  };

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    } catch {
      return dateString;
    }
  };

 return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Datasets</h1>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Uploader un dataset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Uploader un nouveau dataset</DialogTitle>
              <DialogDescription>
                Fournissez un nom et le fichier de votre jeu de données pour l'ajouter à la plateforme.
              </DialogDescription>
            </DialogHeader>
            <DatasetUploadFormShadcn onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des datasets..."
          className="pl-8 sm:w-1/2 md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datasets Enregistrés</CardTitle>
          <CardDescription>Liste de tous les datasets disponibles pour le fine-tuning.</CardDescription>
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
                  <TableHead>Format</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      Aucun dataset trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDatasets.map((dataset) => (
                    <TableRow key={dataset.id}>
                      <TableCell className="font-medium">{dataset.name}</TableCell>
                      <TableCell>{dataset.file_format ?? 'N/A'}</TableCell>
                      <TableCell>{formatDate(dataset.created_at)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button asChild variant="ghost" size="icon" disabled={!dataset.upload_path_url} title="Télécharger le dataset">
                           <a href={dataset.upload_path_url ?? undefined} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(dataset.id)} title="Supprimer le dataset">
                          <Trash2 className="h-4 w-4" />
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
              Cette action est irréversible. Elle supprimera définitivement le dataset "{getSelectedDatasetName()}".
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

export default DatasetsListPageShadcn;
