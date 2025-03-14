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
    <div className="py-4 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {navigationGroups.map((group, groupIndex) => (
        <div 
          key={groupIndex} 
          className="px-3 py-3 mb-2"
        >
          <h2 className="mb-3 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
            {group.title}
          </h2>
          <nav className="space-y-1.5">
            {group.items.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 font-medium
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'}`}
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