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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // Ajout du Spinner
import { Mission, MissionFormData } from "@/services/missions.service";
import { MissionFormValues } from "@/pages/missions/MissionManagement";
import { useUsers } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "./ui/alert";

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
  const [loading, setLoading] = useState(false); // Ajout du state loading

  // Obtenir le nom de l'utilisateur
  const getUserName = (id: number) => {
    const user = users?.find((u) => u.id === id);
    return user?.name || "Utilisateur inconnu";
  };

  if (!currentUser || !currentUser.id) {
    return <Alert variant="destructive">Aucun utilisateur connecté.</Alert>;
  }

  return (
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
              setLoading(true); // Active le mode chargement
              await onSubmit({ ...data, id: editingMission?.id || 0 });
              setLoading(false); // Désactive le mode chargement après soumission
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="user_id"
                defaultValue={currentUser.id}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={getUserName(currentUser.id)}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une rue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData.streets?.map((street) => (
                          <SelectItem
                            key={street.id}
                            value={street.id.toString()}
                          >
                            {street.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" /> 
                    {editingMission ? "Mise à jour en cours" : "Création en cours"}
                  </>
                ) : (
                  editingMission ? "Mettre à jour" : "Créer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionFormDialog;
