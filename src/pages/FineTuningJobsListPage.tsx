// fine-tuning-app-frontend/src/pages/FineTuningJobsListPage.tsx

import { useState, useEffect, useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getFineTuningJobs, FineTuningJob, deleteFineTuningJob } from "@/services/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/ui/status-badge";
import { Loader2, PlusCircle, RefreshCw, Trash2, AlertCircle } from "lucide-react";

const FineTuningJobsListPage = () => {
  const [jobs, setJobs] = useState<FineTuningJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const isPolling = true;

  const fetchJobs = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const data = await getFineTuningJobs();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.warn("La réponse de l'API pour les jobs n'est pas un tableau. Initialisation à []. Réponse reçue:", data);
        setJobs([]);
      }
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des jobs:", err);
      setError("Impossible de charger la liste des jobs.");
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(true);
    let intervalId: number | null = null;
    if (isPolling) {
      intervalId = setInterval(() => fetchJobs(false), 15000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchJobs, isPolling]);

  const handleRefresh = () => {
    fetchJobs(true);
  };

  const openDeleteDialog = (jobId: number) => {
    setJobToDelete(jobId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete === null) return;
    try {
      await deleteFineTuningJob(jobToDelete);
      fetchJobs(false);
    } catch (err) {
      console.error(`Erreur lors de la suppression du job ${jobToDelete}:`, err);
      setError(`Erreur lors de la suppression du job #${jobToDelete}.`);
    } finally {
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Jobs de Fine-Tuning</h1>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="sr-only">Rafraîchir</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rafraîchir la liste</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button asChild>
            <RouterLink to="/fine-tuning-jobs/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouveau Job
            </RouterLink>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Jobs</CardTitle>
          <CardDescription>Liste de tous les jobs de fine-tuning, passés et présents.</CardDescription>
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
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Modèle / Dataset</TableHead>
                  <TableHead>Hyperparamètres</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">#{job.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{job.model_details?.name ?? `Modèle ${job.model}`}</div>
                        <div className="text-sm text-muted-foreground">{job.dataset_details?.name ?? `Dataset ${job.dataset}`}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {job.hyperparameters && typeof job.hyperparameters === 'object' ? (
                          Object.entries(job.hyperparameters)
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key}>{`${key}: ${value}`}</div>
                            ))
                        ) : (
                          <div>N/A</div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(job.created_at)}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <button type="button"><StatusBadge status={job.status} statusDisplay={job.status_display} /></button>
                            </TooltipTrigger>
                            {job.status === "FAILED" && job.error_message && (
                              <TooltipContent className="max-w-xs break-words">
                                <p>{job.error_message}</p>
                              </TooltipContent>
                            )}
                            {job.status === "SUCCESS" && job.output_model_path && (
                              <TooltipContent>
                                <p>Modèle de sortie: {job.output_model_path}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(job.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Supprimer le job</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Aucun job de fine-tuning trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Elle supprimera définitivement le job #{jobToDelete}.
              {jobs.find((job) => job.id === jobToDelete)?.status === 'RUNNING'
                ? " La tâche de calcul associée sera également annulée."
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className={buttonVariants({ variant: "destructive" })}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FineTuningJobsListPage;
