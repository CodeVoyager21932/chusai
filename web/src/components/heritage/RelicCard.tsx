'use client';

import { Lock } from 'lucide-react';
import { Relic } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RelicCardProps {
  relic: Relic;
  isCollected: boolean;
  onClick?: () => void;
}

const rarityVariant = {
  SSR: 'ssr',
  SR: 'sr',
  R: 'r',
} as const;

export function RelicCard({ relic, isCollected, onClick }: RelicCardProps) {
  return (
    <div 
      className={cn(
        'relative rounded-xl overflow-hidden cursor-pointer transition-all',
        'hover:shadow-lg hover:scale-105',
        !isCollected && 'opacity-60'
      )}
      onClick={onClick}
    >
      {/* 背景 */}
      <div className={cn(
        'aspect-square flex items-center justify-center',
        relic.rarity === 'SSR' && 'bg-gradient-to-br from-red-100 to-orange-100',
        relic.rarity === 'SR' && 'bg-gradient-to-br from-purple-100 to-pink-100',
        relic.rarity === 'R' && 'bg-gradient-to-br from-blue-100 to-cyan-100',
      )}>
        {isCollected ? (
          <span className="text-4xl">🏺</span>
        ) : (
          <Lock className="w-8 h-8 text-neutral-400" />
        )}
      </div>

      {/* 信息 */}
      <div className="p-3 bg-white">
        <Badge variant={rarityVariant[relic.rarity]} className="mb-1 text-xs">
          {relic.rarity}
        </Badge>
        <h4 className={cn(
          'font-medium text-sm truncate',
          isCollected ? 'text-neutral-900' : 'text-neutral-400'
        )}>
          {isCollected ? relic.name : '???'}
        </h4>
        <p className="text-xs text-neutral-500">{relic.year}年</p>
      </div>

      {/* 稀有度光效 */}
      {isCollected && relic.rarity === 'SSR' && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

export default RelicCard;
