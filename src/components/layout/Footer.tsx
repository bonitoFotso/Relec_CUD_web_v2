// src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t py-3 px-6 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} KES AFRICA - Tous droits réservés.
        </p>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Support
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
            Confidentialité
          </a>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
            CGU
          </a>
        </div>
      </div>
    </footer>
  );
};