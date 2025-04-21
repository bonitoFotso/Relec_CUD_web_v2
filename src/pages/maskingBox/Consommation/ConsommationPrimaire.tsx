/* eslint-disable @typescript-eslint/no-explicit-any */
import ConsommationProvider from "@/contexts/consommation/consommationProvider";
import { useState } from "react";
import ConsommationContent from "./ConsommationContent";

export default function ConsommationsPrimaires({
  filteredStreetlights,
}: {
  filteredStreetlights: any;
}) {
  const [activeTab, setActiveTab] = useState<"All" | "LED" | "Decharges">(
    "All"
  );

  return (
    <ConsommationProvider filteredStreetlights={filteredStreetlights}>
      <ConsommationContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </ConsommationProvider>
  );
}
