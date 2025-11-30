'use client';

import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dataManager } from '@/services/dataManager';
import { useUserStore } from '@/stores/userStore';
import { Relic } from '@/types/models';
import { cn } from '@/lib/utils';

const rarityVariant = {
  SSR: 'ssr',
  SR: 'sr',
  R: 'r',
} as const;

export function GachaDrawer() {
  const { collectRelic, hasCollectedRelic } = useUserStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnRelic, setDrawnRelic] = useState<Relic | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    setShowResult(false);
    setDrawnRelic(null);

    // 模拟抽卡动画
    await new Promise(resolve => setTimeout(resolve, 2000));

    const relic = dataManager.drawRelic();
    setDrawnRelic(relic);
    setIsDrawing(false);
    setShowResult(true);

    // 收集信物
    if (!hasCollectedRelic(relic.id)) {
      collectRelic(relic.id);
    }
  };

  const handleClose = () => {
    setShowResult(false);
    setDrawnRelic(null);
  };

  return (
    <div className="space-y-6">
      {/* 抽卡区域 */}
      <Card className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50">
        {!showResult ? (
          <>
            <div className={cn(
              'w-32 h-32 mx-auto mb-6 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br from-red-500 to-orange-500 shadow-lg',
              isDrawing && 'animate-bounce'
            )}>
              {isDrawing ? (
                <Sparkles className="w-16 h-16 text-white animate-spin" />
              ) : (
                <Gift className="w-16 h-16 text-white" />
              )}
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-2">
              {isDrawing ? '正在抽取...' : '神秘信物'}
            </h3>
            <p className="text-neutral-500 mb-6">
              {isDrawing ? '请稍候' : '点击下方按钮抽取红色信物'}
            </p>

            <Button 
              onClick={handleDraw} 
              disabled={isDrawing}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            >
              <Gift className="w-5 h-5 mr-2" />
              {isDrawing ? '抽取中...' : '抽取信物'}
            </Button>

            {/* 概率说明 */}
            <div className="mt-6 flex justify-center gap-4 text-xs text-neutral-500">
              <span>SSR: 5%</span>
              <span>SR: 25%</span>
              <span>R: 70%</span>
            </div>
          </>
        ) : drawnRelic && (
          <>
            {/* 抽卡结果 */}
            <div className={cn(
              'animate-fade-in',
              drawnRelic.rarity === 'SSR' && 'animate-bounce'
            )}>
              {/* 稀有度特效 */}
              {drawnRelic.rarity === 'SSR' && (
                <div className="text-6xl mb-4">🎉✨🎉</div>
              )}
              {drawnRelic.rarity === 'SR' && (
                <div className="text-5xl mb-4">✨</div>
              )}

              <Badge 
                variant={rarityVariant[drawnRelic.rarity]} 
                className="mb-4 text-lg px-4 py-1"
              >
                {drawnRelic.rarity}
              </Badge>

              <div className={cn(
                'w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center',
                drawnRelic.rarity === 'SSR' && 'bg-gradient-to-br from-red-100 to-orange-100 shadow-lg shadow-orange-200',
                drawnRelic.rarity === 'SR' && 'bg-gradient-to-br from-purple-100 to-pink-100 shadow-lg shadow-purple-200',
                drawnRelic.rarity === 'R' && 'bg-gradient-to-br from-blue-100 to-cyan-100',
              )}>
                <span className="text-4xl">🏺</span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                {drawnRelic.name}
              </h3>
              <p className="text-neutral-500 mb-2">{drawnRelic.year}年</p>
              <p className="text-sm text-neutral-600 mb-6 max-w-sm mx-auto">
                {drawnRelic.story}
              </p>

              <Button onClick={handleClose} variant="outline">
                继续抽取
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* 抽卡说明 */}
      <Card className="p-4">
        <h4 className="font-medium text-neutral-900 mb-2">抽卡说明</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• 每次抽取可获得一件红色信物</li>
          <li>• 信物分为 SSR、SR、R 三个稀有度</li>
          <li>• 重复获得的信物不会重复计入收藏</li>
          <li>• 收集所有信物可获得特殊成就</li>
        </ul>
      </Card>
    </div>
  );
}

export default GachaDrawer;
