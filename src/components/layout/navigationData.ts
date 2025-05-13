export interface NavigationItem {
  name: string;
  href: string;
  iconName?: string; //  Le nom de l'icône au lieu d'un composant JSX
  badge?: string;
}

export interface NavigationGroup {
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    items: [{ name: "Tableau de bord", href: "/", iconName: "home" }],
  },
  {
    items: [{ name: "Missions", href: "/missions", iconName: "briefcase" }],
  },
  {
    items: [{ name: "Cartes", href: "/maps", iconName: "map" }],
  },
  {
    items: [{ name: "Comptes", href: "/companies", iconName: "account" }],
  },

  // {
  //   items: [{ name: "Anomalies", href: "/anomalies", iconName: "anomalies" }],
  // },
  {
    items: [{ name: "Parametres", href: "/parametres", iconName: "settings" }],
  },
];

export const maskingbox: NavigationGroup[] = [
  {
    items: [
      {
        name: "Panneau de contrôle",
        href: "/panneau_de_controle",
        iconName: "box",
      },
    ],
  },
  {
    items: [{ name: "Carte Temps-reel", href: "/carte", iconName: "carte" }],
  },
  {
    items: [
      {
        name: "État & Historique",
        href: "/historiques",
        iconName: "historique",
      },
    ],
  },
  {
    items: [
      { name: "Aide et Support", href: "/help&center", iconName: "aide" },
    ],
  },
];
