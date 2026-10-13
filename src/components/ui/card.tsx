import * as React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'gold' | 'glass' | 'subtle' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default:
      'bg-white dark:bg-[#0E162E]/90 border border-slate-200/80 dark:border-amber-400/15 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]',
    gold:
      'bg-gradient-to-br from-white via-amber-50/30 to-white dark:from-[#0E162E] dark:via-[#131D3B] dark:to-[#0A1124] border border-amber-500/30 dark:border-amber-400/30 shadow-md shadow-amber-500/5',
    glass:
      'bg-white/80 dark:bg-[#0E162E]/75 backdrop-blur-md border border-slate-200/60 dark:border-amber-400/20 shadow-lg',
    subtle:
      'bg-slate-50/70 dark:bg-[#0A1124]/60 border border-slate-200/60 dark:border-slate-800/80',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl text-slate-900 dark:text-slate-100 transition-all duration-200',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-serif text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-white',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
