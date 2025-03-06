// src/components/layout/LogoCustom.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const LogoCustom: React.FC<LogoProps> = ({
  className = '',
  title = 'CRM System',
  showTitle = true,
  variant = 'default',
  size = 'md'
}) => {
  // Classes pour les différentes tailles du conteneur
  const containerSizeClasses = {
    sm: 'w-20 h-12',
    md: 'w-10 h-10',
    lg: 'w-32 h-20'
  };
  
  // Classes pour les différentes variantes
  const variantClasses = {
    default: '',
    light: 'bg-white',
    dark: 'bg-gray-800'
  };
  
  // Taille du texte selon la taille du logo
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  // Espacement entre le logo et le texte
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4'
  };

  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center', 
        spacingClasses[size],
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-center overflow-hidden',
        containerSizeClasses[size],
        variantClasses[variant]
      )}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-full h-full " 
        />
      </div>
      {showTitle && (
        <span className={cn('font-bold', textSizeClasses[size])}>
          {title}
        </span>
      )}
    </Link>
  );
};

export default LogoCustom;