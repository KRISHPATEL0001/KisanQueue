import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral' 
  | 'saffron';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  className = '',
  size = 'md'
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#EAF4EA] text-[#18794E] border-[#18794E]/40',
    warning: 'bg-[#FFF9DB] text-[#B7791F] border-[#B7791F]/40',
    error: 'bg-[#FEE4E2] text-[#B42318] border-[#B42318]/40',
    info: 'bg-[#E0F2FE] text-[#0369A1] border-[#0369A1]/40',
    neutral: 'bg-[#F5F7F9] text-[#1F2933] border-[#D6DDE5]',
    saffron: 'bg-[#FFF3E8] text-[#E87524] border-[#E87524]/40',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2 py-0.5 font-semibold',
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 border rounded-xs whitespace-nowrap uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
