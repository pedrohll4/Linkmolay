import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'gold'
    | 'goldOutline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer';

    const variantStyles = {
      default:
        'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 shadow-sm',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 dark:bg-red-900/90 dark:text-red-100 dark:hover:bg-red-800 shadow-sm',
      outline:
        'border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      ghost:
        'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
      link: 'text-amber-600 underline-offset-4 hover:underline dark:text-amber-400 p-0 h-auto',
      gold:
        'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-md shadow-amber-500/20 border border-amber-300/40',
      goldOutline:
        'border border-amber-500/50 text-amber-600 dark:text-amber-300 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-400 dark:border-amber-400/40',
    };

    const sizeStyles = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-lg px-6 text-base font-semibold',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
