import React from 'react';

interface StatCardProps {
  label: string;
  labelHi?: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'success';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  labelHi,
  value,
  subtext,
  icon,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-white border-[#D6DDE5] text-[#1F2933]',
    highlight: 'bg-[#FFF3E8] border-[#E87524]/40 text-[#123B5D]',
    warning: 'bg-[#FFF9DB] border-[#B7791F]/40 text-[#8C5815]',
    success: 'bg-[#EAF4EA] border-[#18794E]/40 text-[#18794E]',
  }[variant];

  return (
    <div className={`border rounded-sm p-4 shadow-2xs ${variantStyles} ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {label}
            {labelHi && <span className="block text-[11px] text-gray-500 font-normal">{labelHi}</span>}
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#123B5D]">
            {value}
          </div>
          {subtext && (
            <div className="text-xs text-gray-600">
              {subtext}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-sm bg-white/60 border border-black/5 text-[#123B5D]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
