'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroFilter } from '@/components/hero/HeroFilter';
import { HeroCard } from '@/components/home/HeroCard';
import { dataManager, filterHeroesByEra } from '@/services/dataManager';
import { Era } from '@/types/models';

type FilterValue = Era | '全部';

export default function HeroGalleryPage() {
  const [selectedEra, setSelectedEra] = useState<FilterValue>('全部');
  
  const filteredHeroes = useMemo(() => {
    return filterHeroesByEra(selectedEra);
  }, [selectedEra]);

  return (
    <>
      <Header title="英雄长廊" />
      
      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* 时代筛选 */}
        <HeroFilter 
          selectedEra={selectedEra} 
          onEraChange={setSelectedEra} 
        />
        
        {/* 英雄列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredHeroes.map((hero, index) => (
            <div 
              key={hero.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <HeroCard hero={hero} variant="gallery" />
            </div>
          ))}
        </div>
        
        {/* 空状态 */}
        {filteredHeroes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">暂无该时期的英雄人物</p>
          </div>
        )}
      </div>
    </>
  );
}
