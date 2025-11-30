'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { dataManager } from '@/services/dataManager';
import { cn } from '@/lib/utils';

export function HeroGalleryScroll() {
  const heroes = dataManager.getHeroes();

  return (
    <div className="space-y-3">
      {/* 横向滚动容器 */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
        {heroes.map((hero, index) => (
          <Link 
            key={hero.id} 
            href={`/hero/${hero.id}`}
            className="flex-shrink-0 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn(
              'w-28 group cursor-pointer'
            )}>
              {/* 头像 */}
              <div className="aspect-square rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-2 overflow-hidden group-hover:shadow-md transition-shadow">
                <span className="text-2xl font-bold text-red-600 group-hover:scale-110 transition-transform">
                  {hero.name[0]}
                </span>
              </div>
              
              {/* 名字 */}
              <h4 className="font-medium text-sm text-neutral-900 text-center truncate">
                {hero.name}
              </h4>
              <p className="text-xs text-neutral-500 text-center truncate">
                {hero.era}
              </p>
            </div>
          </Link>
        ))}
        
        {/* 查看更多 */}
        <Link href="/hero-gallery" className="flex-shrink-0">
          <div className="w-28 h-full flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2 hover:bg-neutral-200 transition-colors">
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </div>
            <span className="text-xs text-neutral-500">查看全部</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HeroGalleryScroll;
