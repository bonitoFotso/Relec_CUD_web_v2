import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { navigationGroups } from "./navigationData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Importer les icônes de Lucide React
import {
  Home,
  Map,
  Users,
  Briefcase,
  LayoutDashboard,
  ScrollText,
  Bell,
  ServerCrash,
} from "lucide-react";

// Mapping des icônes Lucide
const iconMapping: Record<string, JSX.Element> = {
  home: <LayoutDashboard className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  map: <Map className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  permissions: <ScrollText className="w-5 h-5" />,
  notifications: <Bell className="w-5 h-5" />,
  anomalies: <ServerCrash className="w-5 h-5" />,
};

interface SidebarProps {
  onItemClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed w-60 py-0 h-full overflow-y-auto bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-950  relative h-full">
        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
        <div className="w-full">
          <div className="flex justify-center items-center">
            <img
              width={300}
              height={200}
              className="w-60 h-56"
              src="/2rc_logo.png"
              alt="Logo"
            />
          </div>

          <div className="">
            <AnimatePresence>
              {mounted &&
                navigationGroups.map((group, groupIndex) => (
                  <motion.div
                    key={groupIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: groupIndex * 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="px-4 my-1"
                  >
                    <nav className="space-y-1">
                      {group.items.map((item) => {
                        const isActive =
                          location.pathname === item.href ||
                          (item.href !== "/" &&
                            location.pathname.startsWith(item.href));
                        const isHovered = hoveredItem === item.name;

                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                              "group relative flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-300",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              isActive
                                ? "bg-blue-800 text-white font-medium shadow-sm"
                                : "text-blue-600 hover:text-white"
                            )}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={onItemClick}
                          >
                            {/* Indicateur actif */}
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-2 w-1.5 h-4/5 bg-white rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}

                            {/* Effet de fond au survol */}
                            <AnimatePresence>
                              {!isActive && isHovered && (
                                <motion.div
                                  className="absolute inset-0 bg-blue-800 rounded-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                />
                              )}
                            </AnimatePresence>

                            {/* Icône dynamique */}
                            <span className="mr-3 flex items-center justify-center w-5 h-5 relative z-10">
                              {item.iconName && iconMapping[item.iconName]}
                            </span>

                            {/* Texte de l'élément */}
                            <span className="relative z-10">{item.name}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
