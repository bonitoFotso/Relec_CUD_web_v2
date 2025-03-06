// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationGroups } from './navigationData';

interface SidebarProps {
  onItemClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();

  return (
    <div className="py-2 h-full overflow-y-auto">
      {navigationGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            {group.title}
          </h2>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'hover:bg-accent hover:text-accent-foreground'}`}
                  onClick={onItemClick}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
};