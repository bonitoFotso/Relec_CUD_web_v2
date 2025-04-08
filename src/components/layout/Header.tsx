// src/components/layout/Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bell, Search, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LogoCustom from "./Logo";
import { ModeToggle } from "../mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  mobileMenuTrigger: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuTrigger }) => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials from user name
  const getInitials = (name: string = "Utilisateur") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const userInitials = currentUser?.name ? getInitials(currentUser.name) : "U";

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm  py-2.5 border-b shadow-sm">
      <div className="mx-auto flex items-center justify-between">
        <div id="dynamic-header"></div>

        
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">{mobileMenuTrigger}</div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "transition-all duration-300 ease-in-out",
              showSearch ? "md:scale-90 md:opacity-70" : "scale-100 opacity-100"
            )}
          >
            <div className="h-[60px]"></div>
            <div className="md:hidden">
              <LogoCustom showTitle={false} size="sm" variant="light" />
            </div>
          </motion.div>
        </div>
        {/* Center section with search bar for larger screens */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1/3 hidden md:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative mr-6">
                <X className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9 py-5 h-9 bg-background/50 border-muted focus:ring-1 focus:ring-primary/30"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Right section */}
        <div className="flex justify-end items-center gap-1.5 md:gap-3">
          {/* Search button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex hover:bg-primary/10 rounded-full"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4.5 w-4.5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 rounded-full relative"
              >
                <Bell className="h-4.5 w-4.5" />
                <Badge className="absolute rounded-full -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center text-xs bg-blue-500 text-primary-foreground">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  Marquer comme lu
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Notification items would go here */}
              <div className="max-h-80 overflow-y-auto py-1">
                {[1, 2, 3].map((_, i) => (
                  <DropdownMenuItem
                    key={i}
                    className="flex flex-col items-start py-3 px-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex w-full">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          U{i + 1}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Nouveau message de support
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Il y a {10 * (i + 1)} minutes
                        </p>
                      </div>
                      <div className="ml-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <Link to={"/notifications"}>
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-center justify-center"
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <ModeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 flex items-center gap-2 pl-1.5 pr-0.5 md:pl-2 md:pr-1 hover:bg-primary/10 rounded-full"
              >
                <Avatar className="h-7 w-7 md:h-8 md:w-8 border border-primary/10">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={currentUser?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium max-w-32 truncate">
                  {currentUser?.name || "Utilisateur"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="h-10 w-10 border border-primary/10">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={currentUser?.name || "User avatar"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {currentUser?.name || "Utilisateur"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentUser?.email || "user@example.com"}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2.5 cursor-pointer hover:bg-primary/5 focus:bg-primary/5"
                onClick={() => navigate("/profile")}
              >
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="py-2.5 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-950/30 dark:focus:bg-red-950/30"
                onClick={handleLogout}
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
