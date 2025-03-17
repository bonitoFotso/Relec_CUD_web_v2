// src/components/layout/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationGroups } from './navigationData';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  onItemClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Add mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="py-6 h-full overflow-y-auto bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
      <AnimatePresence>
        {mounted && navigationGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: groupIndex * 0.1,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="px-4 mb-8"
          >
            <h2 className="mb-4 px-2 text-xs font-bold text-muted-foreground/80 tracking-wider uppercase flex items-center">
              <span className="inline-block w-6 h-0.5 bg-gradient-to-r from-primary/40 to-transparent mr-2 rounded-full"></span>
              {group.title}
            </h2>
            <nav className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                const isHovered = hoveredItem === item.name;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group relative flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isActive
                        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary font-medium shadow-sm"
                        : "text-foreground/90 hover:text-foreground"
                    )}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={onItemClick}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1.5 h-4/5 bg-gradient-to-b from-primary to-primary/70 rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Hover background effect */}
                    <AnimatePresence>
                      {(!isActive && isHovered) && (
                        <motion.div
                          className="absolute inset-0 bg-muted/60 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Icon */}
                    {item.icon && (
                      <span className={cn(
                        "mr-3 flex items-center justify-center w-5 h-5 relative z-10",
                        isActive 
                          ? "text-primary" 
                          : "text-muted-foreground/80 group-hover:text-primary/80 transition-colors duration-300"
                      )}>
                        {item.icon}
                      </span>
                    )}
                    
                    {/* Item text */}
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className={cn(
                        "ml-auto px-2 py-0.5 text-xs font-medium rounded-full relative z-10",
                        isActive 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/80 text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary/80 transition-colors duration-300"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};