'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dataManager } from '@/services/dataManager';
import { useLearningStore } from '@/stores/learningStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

export function FlashCard() {
  const cards = dataManager.getCards();
  const { currentCardIndex, setCardIndex, addToReview, markCardStatus } = useLearningStore();
  const { masterCard } = useUserStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipeLeft = () => {
    // 需要复习
    if (currentCard) {
      addToReview(currentCard.id);
    }
    goToNext();
  };

  const handleSwipeRight = () => {
    // 已掌握
    if (currentCard) {
      markCardStatus(currentCard.id, 'mastered');
      masterCard(currentCard.id);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
    goToNext();
  };

  const goToNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCardIndex(currentCardIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentCardIndex > 0) {
      setCardIndex(currentCardIndex - 1);
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">暂无学习卡片</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-neutral-500">
          <span>学习进度</span>
          <span>{currentCardIndex + 1} / {cards.length}</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* 卡片 */}
      <div 
        className="relative h-80 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        {/* 火花效果 */}
        {showSparkle && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-6xl animate-ping">✨</div>
          </div>
        )}

        <div 
          className={cn(
            'relative w-full h-full transition-transform duration-500 transform-style-preserve-3d',
            isFlipped && 'rotate-y-180'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* 正面 */}
          <Card 
            className="absolute inset-0 p-6 flex flex-col items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h3 className="text-2xl font-bold text-neutral-900 text-center">
              {currentCard.front_title}
            </h3>
            <p className="text-sm text-neutral-500 mt-4">点击翻转查看答案</p>
          </Card>

          {/* 背面 */}
          <Card 
            className="absolute inset-0 p-6 flex flex-col backface-hidden bg-gradient-to-br from-red-50 to-orange-50"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-neutral-700 leading-relaxed flex-1 overflow-auto">
              {currentCard.back_content}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {currentCard.back_keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/70 text-red-600 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrev}
          disabled={currentCardIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleSwipeLeft}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <X className="w-5 h-5 mr-2" />
          需要复习
        </Button>

        <Button
          size="lg"
          onClick={handleSwipeRight}
          className="bg-green-600 hover:bg-green-700"
        >
          <Check className="w-5 h-5 mr-2" />
          已掌握
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          disabled={currentCardIndex === cards.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* 重置按钮 */}
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCardIndex(0)}
          className="text-neutral-500"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          重新开始
        </Button>
      </div>
    </div>
  );
}

export default FlashCard;
