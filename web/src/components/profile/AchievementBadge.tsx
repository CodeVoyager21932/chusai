'use client';

import { Lock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  onClick?: () => void;
}

export function AchievementBadge({ achievement, onClick }: AchievementBadgeProps) {
  const { name, description, unlocked, progress, maxProgress } = achievement;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center p-4 rounded-xl border transition-all',
        unlocked 
          ? 'bg-amber-50 border-amber-200 hover:border-amber-300' 
          : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
      )}
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center mb-2',
        unlocked ? 'bg-amber-100' : 'bg-neutral-200'
      )}>
        {unlocked ? (
          <Award className="w-6 h-6 text-amber-600" />
        ) : (
          <Lock className="w-5 h-5 text-neutral-400" />
        )}
      </div>
      
      <p className={cn(
        'text-sm font-medium text-center',
        unlocked ? 'text-amber-900' : 'text-neutral-500'
      )}>
        {name}
      </p>
      
      {!unlocked && progress !== undefined && maxProgress !== undefined && (
        <div className="w-full mt-2">
          <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${(progress / maxProgress) * 100}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1 text-center">
            {progress}/{maxProgress}
          </p>
        </div>
      )}
    </button>
  );
}
