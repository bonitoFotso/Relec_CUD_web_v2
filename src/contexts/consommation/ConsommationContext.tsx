import { ConsommationContextType } from "@/pages/maskingBox/Consommation/types";
import { createContext } from "react";

// Création du contexte
export const ConsommationContext = createContext<
  ConsommationContextType | undefined
>(undefined);
