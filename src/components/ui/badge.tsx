import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'gold'
    | 'virtue'
    | 'verified'
    | 'chapter'
    | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantStyles = {
    default:
      'border-transparent bg-slate-900 text-slate-50 dark:bg-slate-100 dark:text-slate-900',
    secondary:
      'border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
    destructive:
      'border-transparent bg-red-500 text-slate-50 dark:bg-red-900 dark:text-red-100',
    outline: 'text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800',
    gold:
      'border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold shadow-xs',
    virtue:
      'border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent text-amber-800 dark:text-amber-200 font-medium px-2.5 py-1',
    verified:
      'border-amber-400/50 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold shadow-sm',
    chapter:
      'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium',
    success:
      'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
