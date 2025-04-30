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

  const [currentPeriod, setCurrentPeriod] = useState<string>("Journaliere");
  const [data, setData] = useState<any[]>([]);

  // Ajouter un état pour stocker la commune sélectionnée
  const [selectedMunicipality] = useState<string>("Toutes les communes");

  // Modifier la fonction useEffect qui traite les lampadaires
  useEffect(() => {
    if (streetlights && streetlights.length > 0) {
      // Modification de la logique de regroupement en fonction de la commune sélectionnée
      const streetlightsByType = streetlights.reduce((acc, streetlight) => {
        // Vérifier si ce lampadaire appartient à la commune sélectionnée
        // Si "Toutes les communes" est sélectionné, tous les lampadaires sont inclus
        // Définir la clé de regroupement - simplifiée pour "Toutes les communes"
        let typeKey;
        if (selectedMunicipality === "Toutes les communes") {
          // Pour "Toutes les communes", regrouper uniquement par catégorie principale (LED ou Décharges)
          typeKey = streetlight.lamps[0].lamp_type.includes("LED")
            ? "LED"
            : "Decharges";
        } else {
          // Pour une commune spécifique, conserver le regroupement détaillé actuel
          typeKey = `${streetlight.lamps[0].lamp_type}_${streetlight.lamps[0].with_balast}`;
        }

        if (!acc[typeKey]) {
          acc[typeKey] = {
            id: streetlight.lamps[0].streelight_id,
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

      // Transformer l'objet en tableau comme avant
      const typesArray = Object.values(streetlightsByType).map(
        (type, index) => {
          const streetlightType = type as StreetlightType;
          return {
            ...streetlightType,
            id: index + 1,
            puissanceLumineuse:
              streetlightType.category === "LED"
                ? streetlightType.puissanceConsommee * 2.5
                : streetlightType.puissanceConsommee * 1.1,
          };
        }
      );

      setStreetlightTypes(typesArray);
    }
  }, [streetlights, selectedMunicipality]);

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

  const getColorForType = (isLED: boolean): string => {
    return isLED ? "#E91f67" : "#1F9800";
  };

  // Fonction pour générer les données
  const generateData = (period: string) => {
    if (streetlightTypes.length === 0) return [];

    // Définir la longueur et les étiquettes de temps en fonction de la période
    let timeLabels: string[] = [];
    // let fluctuationFactor = 0.2; // Facteur de fluctuation pour rendre les données plus réalistes

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
