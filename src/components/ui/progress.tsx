import * as React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: 'gold' | 'default' | 'success';
}

function Progress({
  className,
  value = 0,
  max = 100,
  variant = 'gold',
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const fillVariants = {
    gold: 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-sm shadow-amber-500/30',
    default: 'bg-slate-900 dark:bg-slate-100',
    success: 'bg-emerald-500',
  };

  return (
    <div
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50',
        className
      )}
      {...props}
    >
      <div
        className={cn('h-full w-full flex-1 transition-all duration-500 ease-out', fillVariants[variant])}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}

export { Progress };
