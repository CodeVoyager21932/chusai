'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackClassName?: string;
}

export function LazyImage({ 
  className, 
  fallbackClassName,
  alt,
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-neutral-100',
          fallbackClassName || className
        )}
      >
        <ImageOff className="w-8 h-8 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
