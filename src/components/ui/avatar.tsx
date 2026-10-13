import * as React from 'react';
import { cn } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  withRing?: boolean;
}

function Avatar({ className, size = 'default', withRing = false, ...props }: AvatarProps) {
  const sizeStyles = {
    sm: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full font-semibold select-none',
        sizeStyles[size],
        withRing && 'ring-2 ring-amber-400/50 ring-offset-2 ring-offset-slate-900',
        className
      )}
      {...props}
    />
  );
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

function AvatarImage({ className, alt = '', ...props }: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) return null;

  return (
    <img
      className={cn('aspect-square h-full w-full object-cover', className)}
      alt={alt}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-amber-300 font-serif border border-amber-400/20',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
