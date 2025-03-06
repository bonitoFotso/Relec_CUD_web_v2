// src/components/layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Bell, Search, ChevronDown } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import LogoCustom from './Logo';

interface HeaderProps {
  mobileMenuTrigger: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuTrigger }) => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <div className="mr-2 lg:hidden">
          {mobileMenuTrigger}
        </div>

        {/* Logo standard pour écrans larges */}
        <div className="hidden md:block">
          <LogoCustom
            showTitle={false}
            size="lg"
            variant="light"
          />
        </div>

        {/* Logo compact pour mobile */}
        <div className="md:hidden">
          <LogoCustom
            showTitle={false}
            size="sm"
            variant="light"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Search button */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={currentUser?.name || "User avatar"} />
                <AvatarFallback>{(currentUser?.name || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{currentUser?.name || "Utilisateur"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};