// src/data/navigationData.ts

export interface NavigationItem {
    name: string;
    href: string;
    icon?: string;
  }
  
  export interface NavigationGroup {
    title: string;
    items: NavigationItem[];
  }
  
  export const navigationGroups: NavigationGroup[] = [
    {
      title: "Tableau de bord",
      items: [
        { name: 'Dashboard', href: '/' }
      ]
    },
    
    {
      title: "Missions",
      items: [
        { name: 'Missions', href: '/missions' }
      ]
    },
    {
      title: "Maps",
      items: [
        { name: 'Maps', href: '/maps' }
      ]
    },
    {
      title: "Utilisateurs",
      items: [
        { name: 'Utilisateurs', href: '/users' }
      ]
    },
    
  ];