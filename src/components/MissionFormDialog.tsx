import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // Ajout du Spinner
import { Mission, MissionFormData } from "@/services/missions.service";
import { MissionFormValues } from "@/pages/missions/MissionManagement";
import { useUsers } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "./ui/alert";
import StreetSelectionDialog from "@/components/StreetSelectionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MissionFormValues>;
  onSubmit: (values: Mission) => Promise<void>;
  onCancel: () => void;
  editingMission: Mission | null;
  formData: MissionFormData;
}

const MissionFormDialog: React.FC<MissionFormDialogProps> = ({
  open,
  onOpenChange,
  form,
  onSubmit,
  onCancel,
  editingMission,
  formData,
}) => {
  const { users } = useUsers();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isStreetDialogOpen, setIsStreetDialogOpen] = useState(false);

  // Obtenir le nom de l'utilisateur
  const getUserName = (id: number) => {
    const user = users?.find((u) => u.id === id);
    return user?.name || "Utilisateur inconnu";
  };

  if (!currentUser || !currentUser.id) {
    return <Alert variant="destructive">Aucun utilisateur connecté.</Alert>;
  }

  // Fonction pour afficher la liste des rues sélectionnées sous forme de texte
  const getStreetNamesText = () => {
    const ids: number[] = form.getValues("streets") || [];
    if (ids.length === 0) return "Sélectionner des rues";
    const names = ids
      .map((id) => formData.streets?.find((s) => s.id === id)?.name)
      .filter(Boolean);
    return names.join(", ") || "Sélectionner des rues";
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingMission ? "Modifier la mission" : "Ajouter une mission"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de la mission ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                setLoading(true);
                await onSubmit({ ...data, id: editingMission?.id || 0 });
                setLoading(false);
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de la mission" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de la mission"
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1">
                {/* Bouton pour ouvrir le modal de sélection des rues */}
                <FormField
                  control={form.control}
                  name="streets"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-3">
                      <FormLabel>Rue(s)</FormLabel>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsStreetDialogOpen(true)}
                        >
                          {getStreetNamesText()}
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="intervention_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'intervention</FormLabel>
                    {/* Ici vous pouvez conserver votre Select pour le type d'intervention */}
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type d'intervention" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData.interventions?.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />{" "}
                      {editingMission
                        ? "Mise à jour en cours"
                        : "Création en cours"}
                    </>
                  ) : editingMission ? (
                    "Mettre à jour"
                  ) : (
                    "Créer"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de sélection des rues */}
      <StreetSelectionDialog
        open={isStreetDialogOpen}
        onOpenChange={setIsStreetDialogOpen}
        streets={formData.streets || []}
        selectedStreetIds={form.getValues("streets") || []}
        onConfirm={(selectedIds) => {
          form.setValue("streets", selectedIds);
        }}
      />
    </>
  );
};

export default MissionFormDialog;
