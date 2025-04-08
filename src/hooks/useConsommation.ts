import { ConsommationContext } from "@/contexts/consommation/ConsommationContext";
import { useContext } from "react";

export const useConsommation = () => {
  const context = useContext(ConsommationContext);
  if (context === undefined) {
    throw new Error(
      "useConsommation doit être utilisé à l'intérieur d'un ConsommationProvider"
    );
  }
  return context;
};
