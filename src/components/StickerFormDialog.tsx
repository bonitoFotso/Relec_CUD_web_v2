// components/StickerFormDialog.tsx
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
import { Button } from "@/components/ui/button";
import { StickerFormData, StickersService } from "@/services/stickers.service";
import axios from "axios";
import { Spinner } from "./ui/spinner";

interface StickerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<
    {
      equipment_type_id: number;
      mission_id: number;
      count: number;
    },
    undefined
  >;
  onCancel: () => void;
  missionId?: number; // ID de la mission si pré-sélectionnée
  formData: StickerFormData;
}

const StickerFormDialog: React.FC<StickerFormDialogProps> = ({
  open,
  onOpenChange,
  form,
  onCancel,
  missionId,
  formData,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setProgress("Préparation de votre demande...");

    let requestTimeoutId: number | null = null;

    const values = form.getValues();
    console.log("Valeurs du formulaire:", values);

    // Si un missionId est fourni via les props, l'utiliser
    if (missionId && !values.mission_id) {
      values.mission_id = missionId;
    }

    try {
      // Vérifier le nombre d'étiquettes et avertir si c'est beaucoup
      if (values.count > 100) {
        setProgress(
          `Génération de ${values.count} plaquettes. Cela peut prendre un certain temps...`
        );
      } else {
        setProgress("Génération des plaquettes en cours...");
      }

      // Créer une promesse avec timeout personnalisé
      const timeoutPromise = new Promise((_, reject) => {
        requestTimeoutId = window.setTimeout(() => {
          reject(
            new Error(
              "La génération des plaquettes prend trop de temps. Essayez avec moins de plaquettes."
            )
          );
        }, 180000); // 3 minutes de timeout
      });

      // Appeler le service avec downloadAsZip=true pour obtenir un Blob
      const responsePromise = StickersService.create(values, true);

      // Race entre la réponse et le timeout
      const response = await Promise.race([responsePromise, timeoutPromise]);

      // Annuler le timeout si on a une réponse
      if (requestTimeoutId) {
        window.clearTimeout(requestTimeoutId);
        requestTimeoutId = null;
      }

      console.log("Réponse du service:", response);
      setProgress("Préparation du téléchargement...");

      // Vérifier que la réponse est un Blob
      if (response instanceof Blob) {
        // Créer un nom de fichier significatif
        const fileName = `${getMissionName(
          values.mission_id,
          values.equipment_type_id
        )}.zip`;

        // Télécharger le fichier
        setProgress("Téléchargement du fichier...");
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Fermer le dialogue après téléchargement réussi
        onOpenChange(false);
        // Réinitialiser le formulaire
        form.reset();
      } else {
        setError("Format de réponse inattendu");
      }
    } catch (error) {
      console.error("Erreur lors de la création de plaquettes:", error);

      // Annuler le timeout s'il est toujours actif
      if (requestTimeoutId) {
        window.clearTimeout(requestTimeoutId);
      }

      let errorMessage = "Une erreur s'est produite";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage =
            "La requête a dépassé le délai d'attente. Essayez avec moins de plaquettes.";
        } else if (error.response?.status === 500) {
          errorMessage =
            "Erreur serveur. Vérifiez que tous les fichiers nécessaires existent sur le serveur.";
        } else if (error.response?.status === 413) {
          errorMessage =
            "Le fichier généré est trop volumineux. Réduisez le nombre de plaquettes.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setProgress("");
    }
  };

  // Fonction utilitaire pour obtenir le nom de la mission
  const getMissionName = (
    missionId?: number,
    equipmentTypeId?: number
  ): string => {
    console.log(formData);
    if (!missionId) return "mission";

    const equipmentType = formData.data?.find((d) => d.id === equipmentTypeId);
    const equipmentName = equipmentType
      ? equipmentType.name.replace(/\s+/g, "-").toLowerCase()
      : "type";
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);

    return `mission_${missionId}_${equipmentName}_${timestamp}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        // Empêcher la fermeture pendant la soumission
        if (isSubmitting) return;
        onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter des plaquettes</DialogTitle>
          <DialogDescription>
            Ajoutez des plaquettes pour cette mission. Un fichier ZIP sera
            téléchargé automatiquement.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!missionId && (
              <FormField
                control={form.control}
                name="mission_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une mission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {formData.missions?.map(
                          (mission) =>
                            mission.id && (
                              <SelectItem
                                key={mission.id}
                                value={mission.id.toString()}
                              >
                                {mission.title}
                              </SelectItem>
                            )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="equipment_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'équipement</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type d'équipement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formData.data?.map((type) => (
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

            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Entrez le nombre"
                      min="1"
                      max="500" // Limiter le nombre d'étiquettes
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(isNaN(value) ? 1 : Math.min(value, 500)); // Limite de 500 étiquettes
                      }}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                  {field.value > 100 && (
                    <p className="text-xs text-amber-600">
                      Générer beaucoup de plaquettes peut prendre du temps. Soyez
                      patient.
                    </p>
                  )}
                </FormItem>
              )}
            />

            {isSubmitting && progress && (
              <div className="text-sm text-center p-2 rounded bg-blue-50 text-blue-700">
                {progress}
              </div>
            )}

            {error && (
              <div className="text-sm text-center p-2 rounded bg-red-50 text-red-700">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </div>
                ) : (
                  "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StickerFormDialog;
