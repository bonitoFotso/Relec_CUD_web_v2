import React, { useEffect, useState } from "react";
import { useCompanies } from "@/contexts/CompagnieContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Companie } from "@/services/companieService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CompanieFormDialog from "@/components/CompanieFormDialog";
import { useNavigate } from "react-router-dom";

// Schéma de validation pour le formulaire
const companieFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  logo: z
    .instanceof(File, { message: "Le logo doit être une image." })
    .or(z.string().url({ message: "Le logo doit être une URL valide." })),
});
export type CompanieFormValues = z.infer<typeof companieFormSchema>;

const Companies: React.FC = () => {
  const navigate = useNavigate();
  const { companies, loading, error, fetchCompanies, createCompanie,deleteCompanie } =
    useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CompanieFormValues>({
    resolver: zodResolver(companieFormSchema),
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  // Ouverture du formulaire pour créer un nouvel utilisateur
  const handleAddClick = () => {
    form.reset({
      name: "",
      logo: "",
    });
    setIsDialogOpen(true);
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (values: CompanieFormValues) => {
    try {
      await createCompanie(values as Companie);
      toast.success("Companie créé");

      await fetchCompanies();

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Opération échouée :", err);
      toast.error("Opération échouée");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

    const handleDetailsClick = (companie: Companie) => {
      navigate(`/companies/${companie.id}`);
    };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Skeleton className="h-[30vh] w-[95%]" />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="m-2">
      <div className="flex  flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Companies</h1>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter une companie
        </Button>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  p-4 rounded-md gap-2">
        {companies.map((companie) => (
          <li key={companie.id} className="flex items-center bg-white p-4 rounded-md">
            {companie.logo && (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">{companie.name[0]}</span>
              </div>
            )}
            {!companie.logo && (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">{companie.name[0]}</span>
              </div>
            )}
             
              <span 
              onClick={() => handleDetailsClick(companie)}
              className="cursor-pointer">{companie.name}
              </span>
            
            <button
              className="ml-auto text-red-600"
              onClick={() => {
                if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${companie.name} ?`)) {
                  if (companie.id !== undefined) {
                    deleteCompanie(companie.id).then(() => {
                    toast.success("Companie supprimée");
                  }).catch((err) => {
                    console.error("Erreur lors de la suppression :", err);
                    toast.error("Erreur lors de la suppression");
                  });
                }
              }}}
            >
              Supprimer
            </button>
          </li>
        ))}

      </ul>
      {/* Formulaire de création */}
      <CompanieFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        onCancel={handleDialogClose}
      />
    </div>
  );
};

export default Companies;
