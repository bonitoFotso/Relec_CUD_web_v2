import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  Zap,
  Sun,
  Leaf,
  Lightbulb,
  Moon,
  Battery,
  ArrowDownRight,
  Settings,
} from "lucide-react";

export default function TableauBordEclairage() {
  // États pour les données et les filtres
  const [periode, setPeriode] = useState("mois");
  const [vue, setVue] = useState("tous");
  const [donnees, setDonnees] = useState({});
  const [loading, setLoading] = useState(true);

  // Simulation de chargement de données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDonnees(genererDonnees(periode));
      setLoading(false);
    }, 800);
  }, [periode]);

  // Fonction pour générer des données cohérentes et liées
  const genererDonnees = (periode) => {
    // Valeurs de base qui déterminent les autres valeurs (pour cohérence)
    const tauxLED = {
      semaine: 78,
      mois: 81,
      annee: 85,
    }[periode];

    const eclairageAdaptatif = {
      semaine: 68,
      mois: 72,
      annee: 75,
    }[periode];

    // Calcul des valeurs interdépendantes
    const efficaciteEnergetique = Math.round(
      tauxLED * 0.9 + eclairageAdaptatif * 0.2
    );
    const pollutionLumineuse = Math.round(100 - eclairageAdaptatif * 0.6);
    const reductionCarbone = Math.round(
      tauxLED * 0.4 + eclairageAdaptatif * 0.2
    );
    const dureeEclairage =
      Math.round((8 - eclairageAdaptatif * 0.02) * 10) / 10;
    const intensiteLumineuse = Math.round(1000 + eclairageAdaptatif * 5);
    const facteurPuissance = Math.round((0.85 + tauxLED * 0.001) * 100) / 100;

    // Génération des données historiques
    let historique = [];
    const nombrePoints =
      periode === "semaine" ? 7 : periode === "mois" ? 4 : 12;
    const labels = {
      semaine: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      mois: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
      annee: [
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
      ],
    }[periode];

    // Création d'une progression logique dans le temps
    const ecAdaptatifFinal = eclairageAdaptatif;
    const pollutionFinal = pollutionLumineuse;
    const tauxLEDFinal = tauxLED;

    for (let i = 0; i < nombrePoints; i++) {
      const progression = i / (nombrePoints - 1);
      const ecAdaptatifDebut = ecAdaptatifFinal - 10;
      const pollutionDebut = pollutionFinal + 10;
      const tauxLEDDebut = tauxLEDFinal - 7;

      historique.push({
        date: labels[i],
        eclairageAdaptatif: Math.round(ecAdaptatifDebut + progression * 10),
        pollutionLumineuse: Math.round(pollutionDebut - progression * 10),
        lampadairesLED: Math.round(tauxLEDDebut + progression * 7),
        efficaciteEnergetique: Math.round(
          60 + progression * (efficaciteEnergetique - 60)
        ),
        intensiteLumineuse: Math.round(
          900 + progression * (intensiteLumineuse - 900)
        ),
      });
    }

    return {
      eclairageAdaptatif,
      pollutionLumineuse,
      lampadairesLED: tauxLED,
      facteurPuissance,
      dureeEclairage,
      efficaciteEnergetique,
      intensiteLumineuse,
      reductionCarbone,
      historique,
    };
  };

  // Données pour le diagramme circulaire des lampadaires
  const donneesLampadaires = !loading
    ? [
        { name: "LED", value: donnees.lampadairesLED },
        { name: "Traditionnel", value: 100 - donnees.lampadairesLED },
      ]
    : [];

  // Couleurs pour les graphiques
  const COLORS = ["#10b981", "#94a3b8"];

  // Données pour le graphique de facteur de puissance
  const donneesPuissance = !loading
    ? [
        {
          name: "Facteur",
          value: donnees.facteurPuissance * 100,
          fill:
            donnees.facteurPuissance >= 0.9
              ? "#10b981"
              : donnees.facteurPuissance >= 0.8
              ? "#eab308"
              : "#ef4444",
        },
      ]
    : [];

  // Fonction pour filtrer les indicateurs selon la vue sélectionnée
  const filtrerIndicateurs = (indicateurs) => {
    if (vue === "tous") return indicateurs;
    return indicateurs.filter((ind) => ind.categorie === vue);
  };

  // Définition de tous les indicateurs disponibles
  const tousIndicateurs = [
    {
      id: "eclairageAdaptatif",
      nom: "Éclairage adaptatif",
      valeur: !loading ? donnees.eclairageAdaptatif : 0,
      unite: "%",
      icone: <Lightbulb />,
      couleur: "green",
      categorie: "optimisation",
      render: "jauge",
    },
    {
      id: "pollutionLumineuse",
      nom: "Pollution lumineuse",
      valeur: !loading ? donnees.pollutionLumineuse : 0,
      unite: "%",
      icone: <Moon />,
      couleur: "blue",
      categorie: "optimisation",
      render: "jauge",
    },
    {
      id: "lampadairesLED",
      nom: "Lampadaires LED",
      valeur: !loading ? donnees.lampadairesLED : 0,
      unite: "%",
      icone: <Zap />,
      couleur: "purple",
      categorie: "optimisation",
      render: "pie",
    },
    {
      id: "facteurPuissance",
      nom: "Facteur de puissance",
      valeur: !loading ? donnees.facteurPuissance : 0,
      unite: "",
      icone: <Battery />,
      couleur: "amber",
      categorie: "optimisation",
      render: "radial",
    },
    {
      id: "dureeEclairage",
      nom: "Durée d'éclairage",
      valeur: !loading ? donnees.dureeEclairage : 0,
      unite: "h",
      icone: <Clock />,
      couleur: "blue",
      categorie: "performance",
      render: "valeur",
    },
    {
      id: "efficaciteEnergetique",
      nom: "Efficacité énergétique",
      valeur: !loading ? donnees.efficaciteEnergetique : 0,
      unite: "%",
      icone: <Zap />,
      couleur: "green",
      categorie: "performance",
      render: "valeur",
    },
    {
      id: "intensiteLumineuse",
      nom: "Intensité lumineuse",
      valeur: !loading ? donnees.intensiteLumineuse : 0,
      unite: "lm",
      icone: <Sun />,
      couleur: "yellow",
      categorie: "performance",
      render: "valeur",
    },
    {
      id: "reductionCarbone",
      nom: "Réduction carbone",
      valeur: !loading ? donnees.reductionCarbone : 0,
      unite: "%",
      icone: <Leaf />,
      couleur: "emerald",
      categorie: "performance",
      render: "valeur",
    },
  ];

  const indicateursFiltres = filtrerIndicateurs(tousIndicateurs);

  // Fonction pour convertir couleur en classe Tailwind
  const couleurToClass = (couleur, type = "bg") => {
    return `${type}-${couleur}-${
      type === "bg" ? "50" : type === "text" ? "600" : "300"
    } dark:${type}-${couleur}-${
      type === "bg" ? "900" : type === "text" ? "300" : "600"
    }`;
  };

  return (
    <div className="h-full bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Tableau de bord d'éclairage</h2>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setVue("tous")}
              className={`px-3 py-1 rounded-md text-sm ${
                vue === "tous" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setVue("optimisation")}
              className={`px-3 py-1 rounded-md text-sm ${
                vue === "optimisation" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Optimisation
            </button>
            <button
              onClick={() => setVue("performance")}
              className={`px-3 py-1 rounded-md text-sm ${
                vue === "performance" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Performance
            </button>
          </div>

          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
            <button
              onClick={() => setPeriode("semaine")}
              className={`px-3 py-1 rounded-md text-sm ${
                periode === "semaine" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setPeriode("mois")}
              className={`px-3 py-1 rounded-md text-sm ${
                periode === "mois" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setPeriode("annee")}
              className={`px-3 py-1 rounded-md text-sm ${
                periode === "annee" ? "bg-blue-600 text-white" : ""
              }`}
            >
              Année
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Grille d'indicateurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {indicateursFiltres.map((indicateur) => (
              <div
                key={indicateur.id}
                className={`${couleurToClass(
                  indicateur.couleur
                )} p-4 rounded-lg shadow`}
              >
                {indicateur.render === "valeur" ? (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-2">
                      <div
                        className={`${couleurToClass(
                          indicateur.couleur,
                          "text"
                        )} mr-2`}
                      >
                        {indicateur.icone}
                      </div>
                      <h3 className="font-semibold">{indicateur.nom}</h3>
                    </div>
                    <p className="text-3xl font-bold mt-auto">
                      {indicateur.valeur}
                      {indicateur.unite}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {indicateur.id === "dureeEclairage" &&
                        "Moyenne quotidienne"}
                      {indicateur.id === "efficaciteEnergetique" &&
                        "vs éclairage traditionnel"}
                      {indicateur.id === "intensiteLumineuse" &&
                        "Lumens moyens"}
                      {indicateur.id === "reductionCarbone" && "Économie CO₂"}
                    </p>
                  </div>
                ) : indicateur.render === "jauge" ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div
                      className={`${couleurToClass(
                        indicateur.couleur,
                        "text"
                      )} mb-2`}
                    >
                      {indicateur.icone}
                    </div>
                    <h3 className="font-semibold text-center">
                      {indicateur.nom}
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {indicateur.valeur}
                      {indicateur.unite}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className={`${couleurToClass(indicateur.couleur, "bg")
                          .replace("50", "500")
                          .replace("900", "600")} h-2 rounded-full`}
                        style={{
                          width: `${
                            indicateur.id === "pollutionLumineuse"
                              ? 100 - indicateur.valeur
                              : indicateur.valeur
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) : indicateur.render === "pie" ? (
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold mb-2 text-center">
                      {indicateur.nom}
                    </h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donneesLampadaires}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ percent }) =>
                              `${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {donneesLampadaires.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-center font-semibold mt-2">
                      {indicateur.valeur}% convertis
                    </p>
                  </div>
                ) : indicateur.render === "radial" ? (
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold mb-2 text-center">
                      {indicateur.nom}
                    </h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="100%"
                          barSize={10}
                          data={donneesPuissance}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar
                            background
                            clockWise
                            dataKey="value"
                            cornerRadius={30}
                            fill="#82ca9d"
                          />
                          <Tooltip
                            formatter={(value) => [
                              (value / 100).toFixed(2),
                              "Facteur de puissance",
                            ]}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center">
                      <Battery
                        className={`${couleurToClass(
                          indicateur.couleur,
                          "text"
                        )} mr-2`}
                        size={20}
                      />
                      <p className="font-semibold">
                        {indicateur.valeur.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Graphique d'évolution */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Évolution des indicateurs
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={donnees.historique}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="eclairageAdaptatif"
                    name="Éclairage adaptatif (%)"
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pollutionLumineuse"
                    name="Pollution lumineuse (%)"
                    stroke="#94a3b8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lampadairesLED"
                    name="Lampadaires LED (%)"
                    stroke="#a855f7"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficaciteEnergetique"
                    name="Efficacité énergétique (%)"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Analyse et recommandations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statistiques de synthèse */}
            <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">
                Analyse comparative
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Comparaison performance */}
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Performance vs Objectifs</h4>
                    {donnees.efficaciteEnergetique > 70 ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-md text-xs font-semibold">
                        Objectif atteint
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-100 rounded-md text-xs font-semibold">
                        En progression
                      </span>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Efficacité énergétique</span>
                      <span className="text-sm font-semibold">
                        {donnees.efficaciteEnergetique}% / 80%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (donnees.efficaciteEnergetique / 80) * 100
                          }%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Réduction carbone</span>
                      <span className="text-sm font-semibold">
                        {donnees.reductionCarbone}% / 40%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{
                          width: `${(donnees.reductionCarbone / 40) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Économies réalisées */}
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium">Économies réalisées</h4>
                  <div className="flex items-end mt-2">
                    <span className="text-3xl font-bold">
                      {Math.round(
                        donnees.lampadairesLED * 120 +
                          donnees.eclairageAdaptatif * 60
                      )}
                      €
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mb-1">
                      / mois
                    </span>
                  </div>

                  <div className="flex items-center text-green-600 dark:text-green-400 mt-2">
                    <ArrowDownRight size={16} />
                    <span className="text-sm font-semibold ml-1">
                      -
                      {Math.round(
                        donnees.eclairageAdaptatif * 0.4 +
                          donnees.reductionCarbone * 0.2
                      )}
                      % de consommation
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Économies sur l'année
                    </div>
                    <div className="text-lg font-semibold mt-1">
                      {Math.round(
                        donnees.lampadairesLED * 120 +
                          donnees.eclairageAdaptatif * 60
                      ) * 12}
                      €
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <Settings
                  className="text-blue-600 dark:text-blue-400 mr-2"
                  size={20}
                />
                <h3 className="text-lg font-semibold">Recommandations</h3>
              </div>

              <div className="space-y-3">
                <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-amber-500">
                  <h4 className="font-medium">Maintenance préventive</h4>
                  <p className="text-sm mt-1">
                    Planifier le remplacement des lampadaires du secteur Est
                    (efficacité &lt; 60%)
                  </p>
                </div>

                <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-green-500">
                  <h4 className="font-medium">Optimisation énergétique</h4>
                  <p className="text-sm mt-1">
                    Ajuster la sensibilité des capteurs d'éclairage adaptatif
                    pour gagner 5% d'économie
                  </p>
                </div>

                <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-blue-500">
                  <h4 className="font-medium">Réduction pollution</h4>
                  <p className="text-sm mt-1">
                    Réduire l'intensité lumineuse de 10% dans les zones
                    résidentielles après 23h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
