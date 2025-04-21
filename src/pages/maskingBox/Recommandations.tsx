import { Settings } from "lucide-react";

export default function Recommandations() {
  return (
    <div className="p-3">
      <div className="flex items-center mb-4">
        <Settings className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
        <h2 className="text-xl font-bold ">Recommandations</h2>
      </div>
      <div className="space-y-3">
        <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-amber-500">
          <h4 className="font-medium">Maintenance préventive</h4>
          <p className="text-sm mt-1">
            Planifier le remplacement des lampadaires du secteur Est (efficacité
            &lt; 60%)
          </p>
        </div>

        <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-green-500">
          <h4 className="font-medium">Optimisation énergétique</h4>
          <p className="text-sm mt-1">
            Ajuster la sensibilité des capteurs d'éclairage adaptatif pour
            gagner 5% d'économie
          </p>
        </div>

        <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-blue-500">
          <h4 className="font-medium">Réduction pollution</h4>
          <p className="text-sm mt-1">
            Réduire l'intensité lumineuse de 10% dans les zones résidentielles
            après 23h
          </p>
        </div>
        <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-blue-500">
          <h4 className="font-medium">Réduction pollution</h4>
          <p className="text-sm mt-1">
            Réduire l'intensité lumineuse de 10% dans les zones résidentielles
            après 23h
          </p>
        </div>
      </div>
    </div>
  );
}
