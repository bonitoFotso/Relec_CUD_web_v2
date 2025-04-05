// src/components/Dashboard/AlertsSection.tsx
import React from "react";
import { AlertCircle, Clock } from "lucide-react";
import { AlertsSectionProps, AlertProps } from "./types";
import { getAlertStyles } from "./utils";

// Composant individuel d'alerte
const Alert: React.FC<AlertProps> = ({
  type,
  icon: IconComponent,
  message,
}) => {
  const style = getAlertStyles(type);

  return (
    <div className={`p-3 ${style.bg} border-l-4 ${style.border} rounded`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${style.icon}`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm ${style.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

// Composant principal pour la section d'alertes
const AlertsSection: React.FC<AlertsSectionProps> = ({ alerts }) => {
  // Mapping des noms d'icônes aux composants
  const iconMapping: Record<string, React.ElementType> = {
    AlertCircle: AlertCircle,
    Clock: Clock,
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-4 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
        <h2 className="text-lg font-semibold ">Anomalies récentes</h2>
      </div>

      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const IconComponent = iconMapping[alert.icon] || AlertCircle;

            return (
              <Alert
                key={index}
                type={alert.type}
                icon={IconComponent}
                message={alert.message}
              />
            );
          })
        ) : (
          <p className="text-sm py-2">Aucune alerte active pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default AlertsSection;
