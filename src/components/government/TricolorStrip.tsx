import React from 'react';

export const TricolorStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex h-1.5 shadow-2xs ${className}`} aria-hidden="true">
      <div className="flex-1 bg-[#E87524]" />
      <div className="flex-1 bg-white border-y border-gray-200" />
      <div className="flex-1 bg-[#2E7D32]" />
    </div>
  );
};
