'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { HeroDetail } from '@/components/hero/HeroDetail';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/services/dataManager';

export default function HeroDetailPage() {
  const params = useParams();
  const heroId = params.id as string;
  const hero = dataManager.getHeroById(heroId);

  if (!hero) {
    return (
      <>
        <Header title="英雄详情" />
        <div className="px-4 py-12 text-center">
          <p className="text-neutral-500 mb-4">未找到该英雄</p>
          <Link href="/hero-gallery">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回英雄长廊
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={hero.name} />
      
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/hero-gallery" className="inline-block mb-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
        </Link>
        
        {/* 英雄详情 */}
        <HeroDetail hero={hero} />
      </div>
    </>
  );
}
