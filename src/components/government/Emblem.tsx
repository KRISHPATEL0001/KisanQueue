import React from 'react';

interface EmblemProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const GovEmblem: React.FC<EmblemProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-12 h-12 text-xs',
    lg: 'w-16 h-16 text-sm',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official placeholder emblem */}
      <div 
        className={`${sizeClasses[size]} rounded-full border-2 border-[#123B5D] bg-white flex flex-col items-center justify-center text-[#123B5D] shadow-xs relative overflow-hidden shrink-0`}
        title="Official Government Portal Emblem Placeholder"
      >
        <div className="absolute inset-0 bg-[#123B5D]/5 pointer-events-none" />
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-3/5 h-3/5 text-[#123B5D]"
          aria-hidden="true"
        >
          {/* Stylized Pillar / Emblem Capital representation */}
          <path d="M12 2L15 6H9L12 2Z" />
          <path d="M7 7H17V9H7V7Z" />
          <path d="M8 10H16V17H8V10Z" />
          <path d="M6 18H18V20H6V18Z" />
          <path d="M4 21H20V22H4V21Z" />
          <circle cx="12" cy="13.5" r="1.5" fill="#E87524" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#123B5D]">
            Government Portal
          </span>
          <span className="text-[10px] text-gray-600 font-medium">
            भारत सरकार | Govt. of India
          </span>
        </div>
      )}
    </div>
  );
};
