import { AlertTriangle, ChevronRight, FileText } from "lucide-react";

export default function Alertes() {
  return (
    <div className=" h-[100%] bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Alertes et Notifications</h2>
      <div className="space-y-3  overflow-y-auto">
        <div className="flex items-start p-3 bg-red-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Lampadaire LP004 défectueux</p>
            <p className="text-sm text-gray-600">Rue 5N 488, Residence Kotto</p>
            <p className="text-xs text-gray-500">Il y a 2 heures</p>
          </div>
        </div>

        <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Consommation anormale détectée</p>
            <p className="text-sm text-gray-600">Secteur Est</p>
            <p className="text-xs text-gray-500">Hier, 22:15</p>
          </div>
        </div>

        <div className="flex items-start p-3 bg-blue-50 rounded-lg">
          <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <p className="font-medium">Maintenance programmée</p>
            <p className="text-sm text-gray-600">
              10 lampadaires - Quartier Nord
            </p>
            <p className="text-xs text-gray-500">15 avril 2025</p>
          </div>
        </div>
      </div>

      <div className=" mt-2 px-4 py-3 border-t border-gray-200 flex justify-end">
        <a
          href="/panneau_de_controle/alertes"
          className="text-sm font-medium text-black hover:text-orange-500 flex items-end"
        >
          Voir tous les notifications <ChevronRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
