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
    items: [{ name: "Maps", href: "/maps", iconName: "map" }],
  },
  {
    items: [{ name: "Comptes", href: "/companies", iconName: "account" }],
  },
  // {
  //   items: [{ name: "Utilisateurs", href: "/users", iconName: "users" }],
  // },
  // {
  //   items: [
  //     { name: "Permissions", href: "/permissions", iconName: "permissions" },
  //   ],
  // },
  // {
  //   items: [
  //     {
  //       name: "Notifications",
  //       href: "/notifications",
  //       iconName: "notifications",
  //     },
  //   ],
  // },
  {
    items: [{ name: "Anomalies", href: "/anomalies", iconName: "anomalies" }],
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
    items: [{ name: "Cartographie", href: "/carte", iconName: "carte" }],
  },
  {
    items: [
      { name: "Historiques", href: "/historiques", iconName: "settings" },
    ],
  },
];
