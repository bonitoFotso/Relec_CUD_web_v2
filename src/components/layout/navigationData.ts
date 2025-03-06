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
      title: "Utilisateurs",
      items: [
        { name: 'Utilisateurs', href: '/users' }
      ]
    }
    
  ];