import { useEffect, useState } from "react";
import { useCompanies } from "@/contexts/CompagnieContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Companie } from "@/services/companieService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Building2,
  PlusCircle,
  Search,
  Trash2,
  ChevronRight,
  SortAsc,
  SortDesc,
  Info,
} from "lucide-react";
import CompanieFormDialog from "@/components/CompanieFormDialog";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Schéma de validation pour le formulaire
const companieFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Le nom doit contenir au moins 3 caractères." }),
  logo: z
    .union([z.instanceof(File), z.string().url(), z.literal(""), z.undefined()])
    .optional(),
});

export type CompanieFormValues = z.infer<typeof companieFormSchema>;

const Companies = () => {
  const navigate = useNavigate();
  const {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompanie,
    deleteCompanie,
  } = useCompanies();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [displayMode, setDisplayMode] = useState("grid"); // "grid" ou "list"

  const form = useForm<CompanieFormValues>({
    resolver: zodResolver(companieFormSchema),
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  // Filtrer les entreprises selon le terme de recherche
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier les entreprises
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Ouverture du formulaire pour créer une nouvelle entreprise
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
      toast.success("Entreprise créée avec succès");
      await fetchCompanies();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Échec de l'opération :", err);
      toast.error("Échec de la création de l'entreprise");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDetailsClick = (companie: Companie) => {
    navigate(`/companies/${companie.id}`);
  };

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      await deleteCompanie(id);
      toast.success("Entreprise supprimée avec succès");
      await fetchCompanies();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      toast.error("Échec de la suppression de l'entreprise");
    }
  };

  // Fonction pour générer un avatar coloré basé sur le nom
  const generateAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-amber-100 text-amber-800",
      "bg-purple-100 text-purple-800",
      "bg-rose-100 text-rose-800",
      "bg-indigo-100 text-indigo-800",
    ];

    // Simple hash pour obtenir un index basé sur le nom
    const index: number =
      name
        .split("")
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Info className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          Erreur de chargement
        </h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => fetchCompanies()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-800">Entreprises</h1>
          <Badge variant="outline" className="ml-2">
            {companies.length}{" "}
            {companies.length > 1 ? "entreprises" : "entreprise"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={sortOrder === "asc" ? "Tri ascendant" : "Tri descendant"}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDisplayMode(displayMode === "grid" ? "list" : "grid")
            }
            title={displayMode === "grid" ? "Vue en liste" : "Vue en grille"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {displayMode === "grid" ? (
                <>
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M3 9h18"></path>
                  <path d="M3 15h18"></path>
                  <path d="M9 3v18"></path>
                  <path d="M15 3v18"></path>
                </>
              ) : (
                <>
                  <path d="M3 6h18"></path>
                  <path d="M3 12h18"></path>
                  <path d="M3 18h18"></path>
                </>
              )}
            </svg>
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-64"
            />
          </div>
          <Button onClick={handleAddClick} className="whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une entreprise
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {companies.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-12 border border-dashed border-gray-300">
          <Building2 className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Aucune entreprise
          </h2>
          <p className="text-gray-600 mt-2 mb-6 text-center">
            Commencez par ajouter votre première entreprise
          </p>
          <Button onClick={handleAddClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une entreprise
          </Button>
        </div>
      )}

      {/* No results */}
      {companies.length > 0 && filteredCompanies.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-12 border border-dashed border-gray-300">
          <Search className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Aucun résultat
          </h2>
          <p className="text-gray-600 mt-2 mb-6">
            Aucune entreprise ne correspond à votre recherche "{searchTerm}"
          </p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Effacer la recherche
          </Button>
        </div>
      )}

      {/* Grid View */}
      {companies.length > 0 &&
        filteredCompanies.length > 0 &&
        displayMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedCompanies.map((company) => (
              <Card
                key={company.id}
                className="overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${generateAvatarColor(
                        company.name
                      )}`}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-medium text-lg truncate flex-1">
                      {company.name}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDetailsClick(company)}
                        >
                          Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Êtes-vous sûr de vouloir supprimer ${company.name} ?`
                              )
                            ) {
                              handleDelete(company.id);
                            }
                          }}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-500 text-sm">ID: {company.id}</p>
                  {/* afficher le nombres d'agent de l'entreprise */}
                  <p className="text-gray-500 text-sm">
                    Nombre d'agents: {company.users?.length || 0}
                  </p>
                  {/* Autres détails de l'entreprise peuvent être ajoutés ici */}
                </CardContent>
                <CardFooter className="bg-gray-50 p-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDetailsClick(company)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Voir les détails
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

      {/* List View */}
      {companies.length > 0 &&
        filteredCompanies.length > 0 &&
        displayMode === "list" && (
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {sortedCompanies.map((company) => (
                <li
                  key={company.id}
                  className="flex items-center py-4 px-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 ${generateAvatarColor(
                      company.name
                    )}`}
                  >
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      ID: {company.id}
                    </p>
                  </div>
                  <div className="flex items-center ml-4 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetailsClick(company)}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Êtes-vous sûr de vouloir supprimer ${company.name} ?`
                          )
                        ) {
                          handleDelete(company.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
