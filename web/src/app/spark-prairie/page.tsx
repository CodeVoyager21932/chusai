'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FlashCard } from '@/components/spark/FlashCard';
import { QuizQuestion } from '@/components/spark/QuizQuestion';
import { BattleArena } from '@/components/spark/BattleArena';
import { useLearningStore } from '@/stores/learningStore';

type Mode = 'learn' | 'practice' | 'battle';

export default function SparkPrairiePage() {
  const { currentMode, setMode } = useLearningStore();

  return (
    <>
      <Header title="星火燎原" />
      
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* 模式切换 */}
        <Tabs value={currentMode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="learn">学习</TabsTrigger>
            <TabsTrigger value="practice">练习</TabsTrigger>
            <TabsTrigger value="battle">对战</TabsTrigger>
          </TabsList>

          <TabsContent value="learn" className="mt-0">
            <FlashCard />
          </TabsContent>

          <TabsContent value="practice" className="mt-0">
            <QuizQuestion />
          </TabsContent>

          <TabsContent value="battle" className="mt-0">
            <BattleArena />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
