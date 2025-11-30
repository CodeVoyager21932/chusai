'use client';

import { dataManager } from '@/services/dataManager';
import { useUserStore } from '@/stores/userStore';
import { RelicCard } from './RelicCard';
import { Progress } from '@/components/ui/progress';

export function CollectionGrid() {
  const relics = dataManager.getRelics();
  const { collectedRelics, hasCollectedRelic } = useUserStore();
  
  const collectedCount = collectedRelics.length;
  const totalCount = relics.length;
  const progress = (collectedCount / totalCount) * 100;

  // 按稀有度分组
  const ssrRelics = relics.filter(r => r.rarity === 'SSR');
  const srRelics = relics.filter(r => r.rarity === 'SR');
  const rRelics = relics.filter(r => r.rarity === 'R');

  return (
    <div className="space-y-6">
      {/* 收藏进度 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-neutral-600">收藏进度</span>
          <span className="font-medium text-red-600">
            {collectedCount} / {totalCount}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* SSR 信物 */}
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
          传说 (SSR)
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {ssrRelics.map((relic) => (
            <RelicCard 
              key={relic.id} 
              relic={relic} 
              isCollected={hasCollectedRelic(relic.id)}
            />
          ))}
        </div>
      </div>

      {/* SR 信物 */}
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
          稀有 (SR)
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {srRelics.map((relic) => (
            <RelicCard 
              key={relic.id} 
              relic={relic} 
              isCollected={hasCollectedRelic(relic.id)}
            />
          ))}
        </div>
      </div>

      {/* R 信物 */}
      <div>
        <h3 className="text-sm font-medium text-neutral-500 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
          普通 (R)
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {rRelics.map((relic) => (
            <RelicCard 
              key={relic.id} 
              relic={relic} 
              isCollected={hasCollectedRelic(relic.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectionGrid;
