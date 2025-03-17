// src/components/layout/Logo.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  className?: string;
}

const LogoCustom: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showTitle = true,
  className,
}) => {
  // Determine which logo image to use based on variant
  const logoSrc = variant === 'dark' 
    ? '/images/logo.png' // Assuming you have a white version
    : '/logo.png';  // Path relative to the public folder

  // Size mapping for the logo
  const sizeClasses = {
    sm: 'h-18',
    md: 'h-10',
    lg: 'h-16',
  };

  return (
    <div className={cn('flex items-center', className)}>
      {/* Logo Image */}
      <img 
        src={logoSrc} 
        alt="Relec-cud Logo" 
        className={cn(sizeClasses[size], 'w-auto object-contain')}
      />
      
      {/* Logo Title Text */}
      {showTitle && (
        <span 
          className={cn(
            'ml-2 font-serif text-3xl font-bold',
            size === 'sm' && 'text-xl',
            size === 'lg' && 'text-4xl',
            variant === 'light' ? 'text-primary' : 'text-white'
          )}
        >
          Rélec-cud
        </span>
      )}
    </div>
  );
};

export default LogoCustom;