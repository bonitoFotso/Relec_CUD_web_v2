import ConsommationProvider from "@/contexts/consommation/consommationProvider";
import { useState } from "react";
import ConsommationContent from "./ConsommationContent";

export default function ConsommationsPrimaires() {
  const [activeTab, setActiveTab] = useState<"All" | "LED" | "Decharges">(
    "All"
  );

  return (
    <ConsommationProvider>
      <ConsommationContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </ConsommationProvider>
  );
}
