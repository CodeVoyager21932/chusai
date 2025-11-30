'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroCard } from '@/components/home/HeroCard';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { HeroGalleryScroll } from '@/components/home/HeroGalleryScroll';
import { StatsCard } from '@/components/home/StatsCard';
import { DailySignModal } from '@/components/shared/DailySignModal';
import { dataManager } from '@/services/dataManager';
import { Hero } from '@/types/models';

export default function HomePage() {
  const [greeting, setGreeting] = useState('');
  const [todayHero, setTodayHero] = useState<Hero | null>(null);

  useEffect(() => {
    setGreeting(dataManager.getGreeting());
    setTodayHero(dataManager.getTodayHero());
  }, []);

  return (
    <>
      <Header title="星火" />
      
      <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* 问候语 */}
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold text-neutral-900">
            {greeting}，同志
          </h2>
          <p className="text-neutral-500 mt-1">
            今天也要继续学习党史知识哦
          </p>
        </section>

        {/* 今日英雄卡片 */}
        {todayHero && (
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-sm font-medium text-neutral-500 mb-3">今日英雄</h3>
            <HeroCard hero={todayHero} variant="featured" />
          </section>
        )}

        {/* 功能网格 */}
        <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">探索功能</h3>
          <FeatureGrid />
        </section>

        {/* 英雄画廊横向滚动 */}
        <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">英雄人物</h3>
          <HeroGalleryScroll />
        </section>

        {/* 学习统计 */}
        <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">学习统计</h3>
          <StatsCard />
        </section>
      </div>

      {/* 每日签到模态框 */}
      <DailySignModal />
    </>
  );
}
