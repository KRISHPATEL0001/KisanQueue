import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface NoticeBannerProps {
  title?: string;
  message: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  onClose?: () => void;
  className?: string;
  actionText?: string;
  onAction?: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  className = '',
  actionText,
  onAction,
}) => {
  const styles = {
    warning: {
      bg: 'bg-[#FFF9DB]',
      border: 'border-[#B7791F]',
      text: 'text-[#8C5815]',
      icon: <AlertTriangle className="w-5 h-5 text-[#B7791F] shrink-0" />,
    },
    error: {
      bg: 'bg-[#FEE4E2]',
      border: 'border-[#B42318]',
      text: 'text-[#912018]',
      icon: <AlertCircle className="w-5 h-5 text-[#B42318] shrink-0" />,
    },
    info: {
      bg: 'bg-[#EBF5FB]',
      border: 'border-[#123B5D]',
      text: 'text-[#123B5D]',
      icon: <Info className="w-5 h-5 text-[#123B5D] shrink-0" />,
    },
    success: {
      bg: 'bg-[#EAF4EA]',
      border: 'border-[#18794E]',
      text: 'text-[#18794E]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#18794E] shrink-0" />,
    },
  }[type];

  return (
    <div 
      className={`border-l-4 ${styles.border} ${styles.bg} p-3.5 rounded-r-sm shadow-2xs ${className}`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          {styles.icon}
          <div>
            {title && (
              <h3 className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>
                {title}
              </h3>
            )}
            <p className={`text-xs ${styles.text} leading-relaxed mt-0.5`}>
              {message}
            </p>
            {actionText && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="mt-2 text-xs font-bold underline underline-offset-2 hover:opacity-80 block"
              >
                {actionText} →
              </button>
            )}
          </div>
        </div>
        {onClose && (
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 p-1"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
