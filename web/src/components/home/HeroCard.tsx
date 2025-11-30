'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Hero } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeroCardProps {
  hero: Hero;
  variant?: 'featured' | 'gallery' | 'compact';
  className?: string;
}

const eraBadgeVariant = {
  '革命时期': 'revolution',
  '建设时期': 'construction',
  '改革时期': 'reform',
  '新时代': 'newEra',
} as const;

export function HeroCard({ hero, variant = 'gallery', className }: HeroCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || variant !== 'featured') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  if (variant === 'featured') {
    return (
      <Link href={`/hero/${hero.id}`}>
        <div
          ref={cardRef}
          className={cn(
            'relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-6 text-white cursor-pointer transition-all duration-300',
            'hover:shadow-xl',
            className
          )}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          {/* 光晕效果 */}
          {isHovering && (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
              style={{
                transform: `translateX(${tilt.y * 5}px) translateY(${tilt.x * 5}px)`,
              }}
            />
          )}
          
          <div className="flex items-start gap-4">
            {/* 头像 */}
            <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-3xl font-bold">{hero.name[0]}</span>
            </div>
            
            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <Badge variant={eraBadgeVariant[hero.era]} className="mb-2">
                {hero.era}
              </Badge>
              <h3 className="text-xl font-bold truncate">{hero.name}</h3>
              <p className="text-white/80 text-sm">{hero.title}</p>
              <p className="text-white/60 text-xs mt-1">
                {hero.birth_year} - {hero.death_year}
              </p>
            </div>
          </div>
          
          {/* 名言 */}
          {hero.famous_quotes[0] && (
            <p className="mt-4 text-sm text-white/80 line-clamp-2 italic">
              "{hero.famous_quotes[0]}"
            </p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/hero/${hero.id}`}>
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-100 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer',
          className
        )}>
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-red-600">{hero.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-neutral-900 truncate">{hero.name}</h4>
            <p className="text-xs text-neutral-500 truncate">{hero.title}</p>
          </div>
        </div>
      </Link>
    );
  }

  // Gallery variant
  return (
    <Link href={`/hero/${hero.id}`}>
      <div className={cn(
        'group relative overflow-hidden rounded-xl bg-white border border-neutral-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer',
        className
      )}>
        {/* 头像区域 */}
        <div className="aspect-square bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <span className="text-4xl font-bold text-red-600 group-hover:scale-110 transition-transform">
            {hero.name[0]}
          </span>
        </div>
        
        {/* 信息区域 */}
        <div className="p-4">
          <Badge variant={eraBadgeVariant[hero.era]} className="mb-2 text-xs">
            {hero.era}
          </Badge>
          <h4 className="font-semibold text-neutral-900">{hero.name}</h4>
          <p className="text-sm text-neutral-500 truncate">{hero.title}</p>
          <p className="text-xs text-neutral-400 mt-1">
            {hero.birth_year} - {hero.death_year}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default HeroCard;
