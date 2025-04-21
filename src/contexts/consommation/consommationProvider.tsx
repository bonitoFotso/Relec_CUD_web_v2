/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StreetlightType } from "@/pages/maskingBox/Consommation/types";
import { useEffect, useState } from "react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { ConsommationContext } from "./ConsommationContext";
import { useEquipements } from "../EquipementContext";

// Provider pour gérer les données globales
const ConsommationProvider = ({
  children,
  filteredStreetlights,
}: {
  children: React.ReactNode;
  filteredStreetlights: any[];
}) => {
  const { streetlights: allStreetlights, error } = useEquipements();
  const [streetlightTypes, setStreetlightTypes] = useState<StreetlightType[]>(
    []
  );
  const streetlights = filteredStreetlights || allStreetlights;

  const [currentPeriod, setCurrentPeriod] = useState<string>("Hebdomadaire");
  const [data, setData] = useState<any[]>([]);

  // Convertir les données des lampadaires de l'API en StreetlightType

  useEffect(() => {
    if (streetlights && streetlights.length > 0) {
      // Regrouper les lampadaires par type et catégorie
      const streetlightsByType = streetlights.reduce((acc, streetlight) => {
        const typeKey = `${streetlight.lamps[0].lamp_type}_${streetlight.lamps[0].with_balast}`;
        if (!acc[typeKey]) {
          acc[typeKey] = {
            id: streetlight.lamps[0].streetlight_id,
            name: streetlight.lamps[0].lamp_type,
            category: streetlight.lamps[0].lamp_type.includes("LED")
              ? "LED"
              : "Decharges",
            puissanceLumineuse: 0,
            puissanceConsommee: streetlight.power || 0,
            dureeUtilisation: calculateUsageDuration(
              streetlight.on_time,
              streetlight.off_time
            ),
            quantite: 1,
            // couleur: getColorForType(typeKey),
            couleur: getColorForType(
              streetlight.lamps[0].lamp_type.includes("LED")
            ),
            with_balast: Boolean(streetlight.lamps[0]?.with_balast),
          };
        } else {
          // Incrémenter la quantité pour ce type
          acc[typeKey].quantite += 1;
          // Mettre à jour la puissance moyenne si nécessaire
          if (streetlight.power) {
            acc[typeKey].puissanceConsommee =
              (acc[typeKey].puissanceConsommee * (acc[typeKey].quantite - 1) +
                streetlight.power) /
              acc[typeKey].quantite;
          }
        }

        return acc;
      }, {} as Record<string, StreetlightType & { with_balast: boolean }>);

      // Transformer l'objet en tableau
      const typesArray = Object.values(streetlightsByType).map(
        (type, index) => {
          const streetlightType = type as StreetlightType; // Explicitly cast to StreetlightType
          return {
            ...streetlightType,
            id: index + 1, // Assurer un ID unique
            // Estimation de la puissance lumineuse basée sur le type
            puissanceLumineuse:
              streetlightType.category === "LED"
                ? streetlightType.puissanceConsommee * 2.5 // Les LEDs ont généralement un meilleur rendement
                : streetlightType.puissanceConsommee * 1.1,
          };
        }
      );

      setStreetlightTypes(typesArray);
    }
  }, [streetlights]);

  // Fonction pour calculer la durée d'utilisation à partir des heures de démarrage et d'arrêt
  const calculateUsageDuration = (onTime: string, offTime: string): number => {
    if (!onTime || !offTime) return 12; // Valeur par défaut

    try {
      const [onHour, onMinute] = onTime.split(":").map(Number);
      const [offHour, offMinute] = offTime.split(":").map(Number);

      let duration;
      if (offHour < onHour) {
        // Si l'heure d'arrêt est inférieure à l'heure de démarrage, alors on suppose que c'est le jour suivant
        duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
      } else {
        duration = offHour - onHour + (offMinute - onMinute) / 60;
      }

      return Math.round(duration);
    } catch (e) {
      console.error("Erreur de calcul de la durée d'utilisation:", e);
      return 12; // Valeur par défaut en cas d'erreur
    }
  };

  // Attribuer une couleur à chaque type de lampadaire
  // const getColorForType = (typeKey: string): string => {
  //   const colorMap: Record<string, string> = {
  //     LED_true: "#10B722",
  //     LED_false: "#059FFF",
  //     HPS_true: "#F59E00", // High Pressure Sodium
  //     HPS_false: "#EF4444",
  //     MH_true: "#9333EA", // Metal Halide
  //     MH_false: "#8B5CF6",
  //     Mercury_true: "#FBBF24",
  //     Mercury_false: "#F87171",
  //   };

  //   return (
  //     colorMap[typeKey] ||
  //     `#${Math.floor(Math.random() * 16777215).toString(16)}`
  //   );
  // };
  const getColorForType = (isLED: boolean): string => {
    return isLED ? "#4CAF50" : "#FF9800"; // Vert pour LED, Orange pour autres
  };
  // Fonction pour générer les données
  const generateData = (period: string) => {
    if (streetlightTypes.length === 0) return [];

    // Définir la longueur et les étiquettes de temps en fonction de la période
    let timeLabels: string[] = [];
    // let fluctuationFactor = 0.2; // Facteur de fluctuation pour rendre les données plus réalistes

    // if (period === "Journaliere") {
    //   timeLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    //   fluctuationFactor = 0.4; // Plus de variation pour les données horaires
    // } else if (period === "Hebdomadaire") {
    //   timeLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    //   fluctuationFactor = 0.3;
    // } else if (period === "Mensuelle") {
    //   timeLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    //   fluctuationFactor = 0.25;
    // } else if (period === "Annuelle") {
    //   timeLabels = [
    //     "Jan",
    //     "Fév",
    //     "Mar",
    //     "Avr",
    //     "Mai",
    //     "Juin",
    //     "Juil",
    //     "Août",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Déc",
    //   ];
    //   fluctuationFactor = 0.15;
    // }

    // // Calculer le tarif par kWh
    // const tarifKWh = 50;

    if (period === "Journaliere") {
      timeLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    } else if (period === "Hebdomadaire") {
      timeLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    } else if (period === "Mensuelle") {
      timeLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
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
    }

    // Calculer le tarif par kWh (tarif actuel au Cameroun - 94 FCFA/kWh)
    const tarifKWh = 94;

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

        const consommation = Math.round(baseConsommation || 0);

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

      //   const randomFactor = 1 + (Math.random() * 2 - 1) * fluctuationFactor;
      //   const consommation = Math.round((baseConsommation || 0) * randomFactor);

      //   // Calculer le coût correspondant
      //   const cout = Math.round(consommation * tarifKWh);

      //   // Ajouter au point de données avec un identifiant unique pour chaque type
      //   dataPoint[`consommation_${type.id}`] = consommation;
      //   dataPoint[`cout_${type.id}`] = cout;

      //   // Ajouter des totaux par catégorie
      //   if (!dataPoint[`consommation_${type.category}`]) {
      //     dataPoint[`consommation_${type.category}`] = 0;
      //     dataPoint[`cout_${type.category}`] = 0;
      //   }
      //   dataPoint[`consommation_${type.category}`] += consommation;
      //   dataPoint[`cout_${type.category}`] += cout;
      // });

      return dataPoint;
    });
  };

  // Mettre à jour les données lorsque la période ou les types de lampadaires changent
  useEffect(() => {
    if (streetlightTypes.length > 0) {
      setData(generateData(currentPeriod));
    }
  }, [currentPeriod, streetlightTypes]);

  // Calculer les totaux pour chaque type de lampadaire
  const calculateTotals = () => {
    const totals: Record<string, number> = {};

    if (data.length === 0 || streetlightTypes.length === 0) return totals;

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

        error,
        loading: streetlights === undefined,
      }}
    >
      {children}
    </ConsommationContext.Provider>
  );
};

export default ConsommationProvider;
