import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-slate-200 dark:border-navy-800 bg-white/50 dark:bg-navy-900/40 backdrop-blur-xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-gold-500/10 dark:bg-navy-800 border border-gold-500/20 flex items-center justify-center text-gold-500 dark:text-gold-400 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-slate-900 bg-gold-400 hover:bg-gold-300 dark:text-navy-950 dark:bg-gold-400 dark:hover:bg-gold-300 transition-all shadow-sm active:scale-98"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
