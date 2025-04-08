/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StreetlightType } from "@/pages/maskingBox/Consommation/types";
import { useEffect, useState } from "react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ConsommationContext } from "./ConsommationContext";

// Provider pour gérer les données globales
const ConsommationProvider = ({ children }: { children: React.ReactNode }) => {
  // Données fictives des types de lampadaires
  const streetlightTypes: StreetlightType[] = [
    {
      id: 1,
      name: "Type LED 1",
      category: "LED",
      puissanceLumineuse: 130,
      puissanceConsommee: 45,
      dureeUtilisation: 6,
      quantite: 2,
      couleur: "#10B722",
    },
    {
      id: 2,
      name: "Type LED 2",
      category: "LED",
      puissanceLumineuse: 180,
      puissanceConsommee: 60,
      dureeUtilisation: 12,
      quantite: 1,
      couleur: "#059FFF",
    },
    {
      id: 3,
      name: "Décharges avec ballast",
      category: "Decharges",
      puissanceLumineuse: 120,
      puissanceConsommee: 120,
      dureeUtilisation: 12,
      quantite: 3,
      couleur: "#F59E00",
    },
    {
      id: 4,
      name: "Décharges sans ballast",
      category: "Decharges",
      puissanceLumineuse: 110,
      puissanceConsommee: 150,
      dureeUtilisation: 12,
      quantite: 2,
      couleur: "#EF4444",
    },
  ];

  const [currentPeriod, setCurrentPeriod] = useState<string>("Hebdomadaire");
  const [data, setData] = useState<any[]>([]);

  // Fonction pour générer les données
  const generateData = (period: string) => {
    // Définir la longueur et les étiquettes de temps en fonction de la période
    let timeLabels: string[] = [];
    let fluctuationFactor = 0.2; // Facteur de fluctuation pour rendre les données plus réalistes

    if (period === "Journaliere") {
      timeLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);
      fluctuationFactor = 0.4; // Plus de variation pour les données horaires
    } else if (period === "Hebdomadaire") {
      timeLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      fluctuationFactor = 0.3;
    } else if (period === "Mensuelle") {
      timeLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
      fluctuationFactor = 0.25;
    } else if (period === "Annuelle") {
      timeLabels = [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Juin",
        "Juil",
        "Août",
        "Sep",
        "Oct",
        "Nov",
        "Déc",
      ];
      fluctuationFactor = 0.15;
    }

    // Calculer le tarif par kWh
    const tarifKWh = 65.85;

    // Générer les données pour chaque point temporel
    return timeLabels.map((label) => {
      // Créer un objet pour stocker les données de ce point temporel
      const dataPoint: any = { temps: label };

      // Calculer la consommation pour chaque type de lampadaire
      streetlightTypes.forEach((type) => {
        // Calculer la consommation de base en kWh
        let baseConsommation;

        if (period === "Journaliere") {
          // Pour les données journalières, on répartit la consommation sur les heures
          // avec plus de consommation la nuit
          const hour = parseInt(label);
          if (hour >= 18 || hour <= 6) {
            baseConsommation = (type.puissanceConsommee * type.quantite) / 1000; // kWh pour une heure
          } else {
            baseConsommation = 0; // Pas de consommation pendant la journée
          }
        } else if (period === "Hebdomadaire") {
          baseConsommation =
            (type.puissanceConsommee *
              type.dureeUtilisation *
              type.quantite *
              1) /
            1000; // kWh pour un jour
        } else if (period === "Mensuelle") {
          baseConsommation =
            (type.puissanceConsommee *
              type.dureeUtilisation *
              type.quantite *
              1) /
            1000; // kWh pour un jour
        } else if (period === "Annuelle") {
          // La consommation varie selon les saisons (plus élevée en hiver)
          const monthIndex = [
            "Jan",
            "Fév",
            "Mar",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Août",
            "Sep",
            "Oct",
            "Nov",
            "Déc",
          ].indexOf(label);
          const seasonalFactor = monthIndex >= 9 || monthIndex <= 2 ? 1.2 : 1.0;
          baseConsommation =
            (type.puissanceConsommee *
              type.dureeUtilisation *
              type.quantite *
              30 *
              seasonalFactor) /
            1000; // kWh pour un mois
        }

        // Ajouter une fluctuation aléatoire pour rendre les données plus réalistes
        const randomFactor = 1 + (Math.random() * 2 - 1) * fluctuationFactor;
        const consommation = Math.round((baseConsommation || 0) * randomFactor);

        // Calculer le coût correspondant
        const cout = Math.round(consommation * tarifKWh);

        // Ajouter au point de données avec un identifiant unique pour chaque type
        dataPoint[`consommation_${type.id}`] = consommation;
        dataPoint[`cout_${type.id}`] = cout;

        // Ajouter des totaux par catégorie
        if (!dataPoint[`consommation_${type.category}`]) {
          dataPoint[`consommation_${type.category}`] = 0;
          dataPoint[`cout_${type.category}`] = 0;
        }
        dataPoint[`consommation_${type.category}`] += consommation;
        dataPoint[`cout_${type.category}`] += cout;
      });

      return dataPoint;
    });
  };

  // Mettre à jour les données lorsque la période change
  useEffect(() => {
    setData(generateData(currentPeriod));
  }, [currentPeriod]);

  // Calculer les totaux pour chaque type de lampadaire
  const calculateTotals = () => {
    const totals: Record<string, number> = {};

    // Calculer les totaux par type de lampadaire
    streetlightTypes.forEach((type) => {
      totals[`totalConsommation_${type.id}`] = data.reduce(
        (sum, item) => sum + (item[`consommation_${type.id}`] || 0),
        0
      );
      totals[`totalCout_${type.id}`] = data.reduce(
        (sum, item) => sum + (item[`cout_${type.id}`] || 0),
        0
      );
    });

    // Calculer les totaux par catégorie
    ["LED", "Decharges"].forEach((category) => {
      totals[`totalConsommation_${category}`] = data.reduce(
        (sum, item) => sum + (item[`consommation_${category}`] || 0),
        0
      );
      totals[`totalCout_${category}`] = data.reduce(
        (sum, item) => sum + (item[`cout_${category}`] || 0),
        0
      );
    });

    return totals;
  };

  const totals = calculateTotals();

  // Formatter les montants en XAF
  const formatXAF = (value: ValueType) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " XAF";
  };

  // Calculer la consommation moyenne par nuit pour chaque type de lampadaire
  const calculerConsommationMoyenne = (type: StreetlightType) => {
    return (type.puissanceConsommee * type.dureeUtilisation) / 1000; // kWh par nuit
  };

  // Calculer le rendement (lumens par watt)
  const calculerRendement = (type: StreetlightType) => {
    return (type.puissanceLumineuse / type.puissanceConsommee).toFixed(2);
  };

  // Filtrer les données par catégorie
  const filterByCategory = (category: "LED" | "Decharges" | "All") => {
    if (category === "All") return data;

    // Créer une copie des données avec seulement les types de la catégorie spécifiée
    return data.map((item) => {
      const filteredItem: any = { temps: item.temps };

      streetlightTypes
        .filter((type) => type.category === category)
        .forEach((type) => {
          filteredItem[`consommation_${type.id}`] =
            item[`consommation_${type.id}`];
          filteredItem[`cout_${type.id}`] = item[`cout_${type.id}`];
        });

      // Ajouter le total de la catégorie
      filteredItem[`consommation_${category}`] =
        item[`consommation_${category}`];
      filteredItem[`cout_${category}`] = item[`cout_${category}`];

      return filteredItem;
    });
  };

  // Filtrer les totaux par catégorie
  const filterTotalsByCategory = (category: "LED" | "Decharges" | "All") => {
    if (category === "All") return totals;

    const filteredTotals: Record<string, number> = {};

    streetlightTypes
      .filter((type) => type.category === category)
      .forEach((type) => {
        filteredTotals[`totalConsommation_${type.id}`] =
          totals[`totalConsommation_${type.id}`];
        filteredTotals[`totalCout_${type.id}`] = totals[`totalCout_${type.id}`];
      });

    // Ajouter le total de la catégorie
    filteredTotals[`totalConsommation_${category}`] =
      totals[`totalConsommation_${category}`];
    filteredTotals[`totalCout_${category}`] = totals[`totalCout_${category}`];

    return filteredTotals;
  };

  return (
    <ConsommationContext.Provider
      value={{
        streetlightTypes,
        currentPeriod,
        setCurrentPeriod,
        data,
        totals,
        formatXAF,
        calculerConsommationMoyenne,
        calculerRendement,
        filterByCategory,
        filterTotalsByCategory,
      }}
    >
      {children}
    </ConsommationContext.Provider>
  );
};
export default ConsommationProvider;
