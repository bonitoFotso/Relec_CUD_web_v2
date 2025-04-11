// pages/MissionDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMissions } from "@/contexts/MissionContext";
import { useStickers } from "@/contexts/StickerContext";
import { useUsers } from "@/contexts/UserContext";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeftIcon,
  Pencil1Icon,
  TrashIcon,
  PersonIcon,
  ClipboardIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

// Composants
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AssignAgentDialog from "@/components/AssignAgentDialog";
import { Mission } from "@/services/missions.service";
import { Sticker } from "@/services/stickers.service";
import { toast } from "react-toastify";
import { MapPinIcon } from "lucide-react";
import StickerFormDialog from "@/components/StickerFormDialog";
import StickerCard from "@/components/card/StickerCard";
import { User } from "@/services/UsersService";

export interface Agent {
  id: number;
  name: string;
}

// Schéma de validation pour le formulaire de sticker
const stickerFormSchema = z.object({
  equipment_type_id: z.number({
    required_error: "Veuillez sélectionner un type d'équipement.",
  }),
  count: z
    .number({
      required_error: "Veuillez entrer un nombre.",
    })
    .min(1, "Le nombre doit être au moins 1."),
  mission_id: z.number(), // Sera défini automatiquement
});

type StickerFormValues = z.infer<typeof stickerFormSchema>;

const MissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUserById } = useUsers();
  const {
    getMission,
    formData: missionFormData,
    fetchFormData: fetchMissionFormData,
    deleteMission,
    assignAgent,
  } = useMissions();
  const {
    fetchFormData: fetchStickerFormData,
    formData: stickerFormData,
    getStickersByMission,
  } = useStickers();

  const [mission, setMission] = useState<Mission | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isStickerDialogOpen, setIsStickerDialogOpen] = useState(false);

  // Formulaire pour le sticker
  const stickerForm = useForm<StickerFormValues>({
    resolver: zodResolver(stickerFormSchema),
    defaultValues: {
      equipment_type_id: undefined,
      count: 1,
      mission_id: id ? parseInt(id) : undefined,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Charger les données des formulaires pour les références
        await Promise.all([fetchMissionFormData(), fetchStickerFormData()]);

        // Charger la mission
        const missionData = await getMission(parseInt(id));
        setMission(missionData.mission);
        setStickers(missionData.stickers);
        setAgents(missionData.agents);

        // Charger les détails de l'utilisateur (selon votre logique, ici on utilise getUserById)
        const userData = await getUserById(parseInt(id));
        setUser(userData || null);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des données";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    getMission,
    fetchMissionFormData,
    fetchStickerFormData,
    getStickersByMission,
    getUserById,
  ]);

  // Formatter la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      console.error(e);
      return "Date invalide";
    }
  };

  // Formatter l'heure pour l'affichage
  const formatTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "HH:mm", { locale: fr });
    } catch (e) {
      console.error(e);
      return "Heure invalide";
    }
  };

  // Obtenir le libellé du type d'intervention
  const getInterventionTypeName = (id?: number) => {
    if (!id) return "Type inconnu";
    const interventionType = missionFormData.interventions?.find(
      (type) => type.id === id
    );
    return interventionType?.name || "Type inconnu";
  };

  // Nouvelle fonction pour obtenir les noms des rues à partir d'un tableau d'identifiants
  const getStreetNames = (ids?: number[]) => {
    if (!ids || ids.length === 0) return "Boulevard De La Paix";
    const names = ids.map((id) => {
      const street = missionFormData.streets?.find((s) => s.id === id);
      return street ? street.name : "Inconnue";
    });
    return names.join(", ");
  };

  // Obtenir le nom de l'utilisateur
  const getUserName = (id?: number) => {
    if (!id) return "Utilisateur inconnu";
    const user = getUserById(id);
    return user?.name || "Utilisateur inconnu";
  };

  // Obtenir le nom du type d'équipement
  const getEquipmentTypeName = (id?: number) => {
    if (!id) return "Type inconnu";
    const equipmentType = stickerFormData.data?.find((type) => type.id === id);
    return equipmentType?.name || "Type inconnu";
  };

  // Gérer la suppression de la mission
  const handleDelete = async () => {
    if (!mission?.id) return;

    try {
      await deleteMission(mission.id);
      toast.success("Mission supprimée");
      navigate("/missions");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la suppression";
      toast.error(errorMessage);
    }
  };

  // Gérer l'assignation d'un agent
  const handleAssignAgent = async (userId: number) => {
    if (!mission?.id) return;

    try {
      await assignAgent(mission.id, userId);
      // Mettre à jour les données de la mission
      const updatedMission = await getMission(mission.id);
      setMission(updatedMission.mission);
      toast.success("Agent assigné");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'assignation";
      toast.error(errorMessage);
    }
  };

  // Ouvrir le dialogue de création de sticker
  const handleAddStickerClick = () => {
    if (mission?.id) {
      stickerForm.reset({
        equipment_type_id: undefined,
        count: 1,
        mission_id: mission.id,
      });
      setIsStickerDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/missions")}
            className="mr-2"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>
              La mission n'a pas pu être chargée. Veuillez réessayer plus tard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <p className="text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/missions")}>
              Retour à la liste des missions
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* En-tête avec navigation et actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/missions")}
            className="mr-2"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails de la mission</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAssignDialogOpen(true)}>
            <PersonIcon className="mr-2 h-4 w-4" />
            Assigner un agent
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera
                  définitivement la mission "{mission.title}" et toutes ses
                  données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Carte d'information principale */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-2xl">{mission.title}</CardTitle>
              <CardDescription className="mt-2">
                <Badge variant="outline" className="mr-2">
                  {getInterventionTypeName(mission.intervention_type_id)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Créée le {formatDate(mission.created_at)} à{" "}
                  {formatTime(mission.created_at)}
                </span>
              </CardDescription>
            </div>
            {mission.status && (
              <Badge className="w-fit">{mission.status}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium flex items-center mb-2">
                <ClipboardIcon className="mr-2 h-4 w-4" />
                Description
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {mission.description || "Aucune description fournie."}
              </p>

              <h3 className="text-sm font-medium flex items-center mb-2">
                <MapPinIcon className="mr-2 h-4 w-4" />
                Lieu d'intervention
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {mission.streets?.map((s) => s.name).join(", ")}
              </p>

              <h3 className="text-sm font-medium flex items-center mb-2">
                <PersonIcon className="mr-2 h-4 w-4" />
                Responsable
              </h3>
              <p className="text-sm text-muted-foreground">
                {getUserName(mission.user_id)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3">Agents assignés</h3>
              <div className="h-44 overflow-hidden overflow-y-scroll">
                {agents && agents.length > 0 ? (
                  <div className="space-y-2">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center bg-secondary/50 p-2 rounded"
                      >
                        <PersonIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{agent.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun agent assigné à cette mission.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets pour les informations supplémentaires */}
      <Tabs defaultValue="stickers" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="stickers">Etiquettes</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="stickers" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">
                    Etiquette de la mission
                  </CardTitle>
                  <CardDescription>
                    Liste des etiquettes associées à cette mission.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleAddStickerClick}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Générer l'étiquette
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stickers.map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    equipment_type={getEquipmentTypeName(
                      sticker.equipment_type_id
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Historique de la mission
              </CardTitle>
              <CardDescription>
                Suivi des modifications et actions effectuées sur cette mission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-center mb-1">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatDate(mission.created_at)}
                    </span>
                    <ClockIcon className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatTime(mission.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">
                    Mission créée par {getUserName(mission.user_id)}
                  </p>
                </div>

                <div className="border-l-2 border-muted pl-4 py-2">
                  <div className="flex items-center mb-1">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatDate(mission.updated_at)}
                    </span>
                    <ClockIcon className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatTime(mission.updated_at)}
                    </span>
                  </div>
                  <p className="text-sm">Mission mise à jour</p>
                </div>

                {mission.agents &&
                  mission.agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="border-l-2 border-muted pl-4 py-2"
                    >
                      <div className="flex items-center mb-1">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {formatDate(mission.updated_at)}
                        </span>
                        <ClockIcon className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatTime(mission.updated_at)}
                        </span>
                      </div>
                      <p className="text-sm">
                        Agent {agent.name} assigné à la mission
                      </p>
                    </div>
                  ))}

                {stickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    className="border-l-2 border-muted pl-4 py-2"
                  >
                    <div className="flex items-center mb-1">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {formatDate(sticker.created_at)}
                      </span>
                      <ClockIcon className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatTime(sticker.created_at)}
                      </span>
                    </div>
                    <p className="text-sm">
                      {sticker.used ? "Utilisé" : "Non utilisé"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue d'assignation d'agent */}
      <AssignAgentDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        mission={mission}
        onAssign={handleAssignAgent}
      />

      {/* Dialogue d'ajout de sticker */}
      <StickerFormDialog
        open={isStickerDialogOpen}
        onOpenChange={setIsStickerDialogOpen}
        form={stickerForm}
        onCancel={() => setIsStickerDialogOpen(false)}
        missionId={mission.id}
        formData={stickerFormData}
      />
    </div>
  );
};

export default MissionDetails;
