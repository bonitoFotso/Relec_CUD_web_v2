import React, { useState, useEffect } from "react";
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
import { Spinner } from "@/components/ui/spinner";
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
} from "@/components/ui/select";
import AgentsSelectionDialog from "./AgentsSelectionDialog";

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
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);

  const { handleSubmit, control } = form;

  useEffect(() => {
    // init default municipality and company if needed
    if (!form.getValues("municipality_id")) {
      form.setValue("municipality_id", 1);
    }
    if (!form.getValues("company_id")) {
      form.setValue("company_id", formData.companies?.[0]?.id || 0);
    }
  }, [form, formData.companies]);

  if (!currentUser || !currentUser.id) {
    return <Alert variant="destructive">Aucun utilisateur connecté.</Alert>;
  }

  // Helper to display street names
  const getStreetNamesText = () => {
    const ids: number[] = form.getValues("streets") || [];
    if (!ids.length) return "Sélectionner des rues";
    const names =
      formData.streets?.filter((s) => ids.includes(s.id)).map((s) => s.name) ||
      [];
    return names.join(", ");
  };

  // Helper to display agent names
  const getAgentNamesText = () => {
    const ids: number[] = form.getValues("agents") || [];
    if (!ids.length) return "Sélectionner des agents";
    const names = users.filter((u) => ids.includes(u.id!)).map((u) => u.name);
    return names.join(", ");
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
              onSubmit={handleSubmit(async (data) => {
                setLoading(true);
                await onSubmit({
                  ...data,
                  id: editingMission?.id || 0,
                  // Filtrez mais ne gardez que les IDs
                  agents: data.agents,
                  status: ""
                });

                setLoading(false);
              })}
              className="space-y-4"
            >
              {/* Titre */}
              <FormField
                control={control}
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

              {/* Description */}
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de la mission"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Commune et Rue(s) sur la même ligne */}
              <div className="flex gap-4">
                {/* Commune */}
                <div className="w-1/2">
                  <FormField
                    control={control}
                    name="municipality_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commune</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une commune" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.municipalities?.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Rues */}
                <div className="w-1/2">
                  <FormField
                    control={control}
                    name="streets"
                    render={() => (
                      <FormItem>
                        <FormLabel>Rue(s)</FormLabel>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsStreetDialogOpen(true)}
                            className="w-full overflow-x-hidden"
                          >
                            {getStreetNamesText()}
                          </Button>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            

              {/* Type d'intervention */}
              <FormField
                control={control}
                name="intervention_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'intervention</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.interventions?.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* network_type */}
              <FormField
                control={control}
                name="network_type" // tu peux changer ce nom selon ce que tu veux stocker
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de réseau</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type de réseau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Avec Armoire et sans compteur">
                            Avec Armoire et sans compteur
                          </SelectItem>
                          <SelectItem value="Avec Armoire et avec compteur">
                            Avec Armoire et avec compteur
                          </SelectItem>
                          <SelectItem value="Sans Armoire et avec compteur">
                            Sans Armoire et avec compteur
                          </SelectItem>
                          <SelectItem value="Sans Armoire et sans compteur">
                            Sans Armoire et sans compteur
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Compagnie */}
              <FormField
                control={control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compagnie</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une compagnie" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.companies?.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agents */}
              <FormField
                control={control}
                name="agents"
                render={() => (
                  <FormItem>
                    <FormLabel>Agents</FormLabel>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAgentDialogOpen(true)}
                        className="w-full overflow-x-hidden"
                      >
                        {getAgentNamesText()}
                      </Button>
                    </FormControl>
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
                      <Spinner className="mr-2 h-4 w-4" />
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
        streets={
          formData.streets?.filter(
            (s) => s.municipality_id === form.getValues("municipality_id")
          ) || []
        }
        selectedStreetIds={form.getValues("streets") || []}
        onConfirm={(ids) => form.setValue("streets", ids)}
      />

      {/* Modal de sélection des agents */}
      <AgentsSelectionDialog
        open={isAgentDialogOpen}
        onOpenChange={setIsAgentDialogOpen}
        users={users.filter(
          (u): u is typeof u & { id: number } =>
            u.role === "agent" &&
            u.company_id === form.getValues("company_id") &&
            u.id !== undefined
        )}
        selectedUserIds={form.getValues("agents") || []}
        onConfirm={(ids) => form.setValue("agents", ids)}
      />
    </>
  );
};

export default MissionFormDialog;
