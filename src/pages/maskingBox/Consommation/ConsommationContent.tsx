/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import CategoryDisplay from "./CategoryDisplay";
import TableComparatif from "./TableComparatif";

const ConsommationContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "All" | "LED" | "Decharges";
  setActiveTab: (tab: "All" | "LED" | "Decharges") => void;
}) => {
  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="All"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="bg-white p-3 rounded-lg shadow-md dark:bg-gray-950"
      >
        <TabsList className="mb-3 flex items-center justify-center gap-2">
          <TabsTrigger
            value="All"
            className={`w-36 border rounded-lg p-2 text-sm ${
              activeTab === "All"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Tous les types
          </TabsTrigger>
          <TabsTrigger
            value="LED"
            className={`w-36 border rounded-lg p-2 text-sm ${
              activeTab === "LED"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            LED
          </TabsTrigger>
          <TabsTrigger
            value="Decharges"
            className={`w-36 border rounded-lg p-2 text-sm ${
              activeTab === "Decharges"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Décharges
          </TabsTrigger>
        </TabsList>
        <TabsContent value="All" className="mt-6">
          <CategoryDisplay category="All" />
        </TabsContent>
        <TabsContent value="LED" className="mt-6">
          <CategoryDisplay category="LED" />
        </TabsContent>
        <TabsContent value="Decharges" className="mt-6">
          <CategoryDisplay category="Decharges" />
        </TabsContent>
      </Tabs>

      {/* Tableau technique comparatif */}
      <div className="bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Spécifications Techniques</h2>
        <TableComparatif />
      </div>
    </div>
  );
};
export default ConsommationContent;
