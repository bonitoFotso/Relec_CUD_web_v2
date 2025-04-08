export const generateData = (period: string) => {
  if (period === "Journaliere") {
    return Array.from({ length: 24 }, (_, i) => {
      const consommationLED = Math.round(Math.random() * 15 + 5);
      const consommationDecharges = Math.round(Math.random() * 30 + 10);
      return {
        temps: `${i}h`,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Hebdomadaire") {
    return [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ].map((jour) => {
      const consommationLED = Math.round(Math.random() * 50 + 20);
      const consommationDecharges = Math.round(Math.random() * 100 + 50);
      return {
        temps: jour.substring(0, 3),
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Mensuelle") {
    return Array.from({ length: 30 }, (_, i) => {
      const consommationLED = Math.round(Math.random() * 100 + 50);
      const consommationDecharges = Math.round(Math.random() * 200 + 100);
      return {
        temps: `${i + 1}`,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Annuelle") {
    const mois = [
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
    return mois.map((mois) => {
      const consommationLED = Math.round(Math.random() * 800 + 400);
      const consommationDecharges = Math.round(Math.random() * 1500 + 800);
      return {
        temps: mois,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  }
};
