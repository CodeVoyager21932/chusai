'use client';

import Link from 'next/link';
import { MessageCircle, Quote } from 'lucide-react';
import { Hero } from '@/types/models';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HeroDetailProps {
  hero: Hero;
}

const eraBadgeVariant = {
  '革命时期': 'revolution',
  '建设时期': 'construction',
  '改革时期': 'reform',
  '新时代': 'newEra',
} as const;

export function HeroDetail({ hero }: HeroDetailProps) {
  return (
    <div className="space-y-6">
      {/* 头部信息 */}
      <div className="flex items-start gap-4">
        {/* 头像 */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-4xl font-bold text-red-600">{hero.name[0]}</span>
        </div>
        
        {/* 基本信息 */}
        <div className="flex-1">
          <Badge variant={eraBadgeVariant[hero.era]} className="mb-2">
            {hero.era}
          </Badge>
          <h1 className="text-2xl font-bold text-neutral-900">{hero.name}</h1>
          <p className="text-neutral-600">{hero.title}</p>
          <p className="text-sm text-neutral-500 mt-1">
            {hero.birth_year} - {hero.death_year}
          </p>
        </div>
      </div>

      {/* AI 对话按钮 */}
      <Link href={`/ai-chat?heroId=${hero.id}`}>
        <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
          <MessageCircle className="w-4 h-4 mr-2" />
          与 {hero.name} 对话
        </Button>
      </Link>

      {/* 生平简介 */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">生平简介</h2>
        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
          {hero.biography}
        </p>
      </Card>

      {/* 主要事迹 */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">主要事迹</h2>
        <div className="flex flex-wrap gap-2">
          {hero.main_deeds.map((deed, index) => (
            <span 
              key={index}
              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm"
            >
              {deed}
            </span>
          ))}
        </div>
      </Card>

      {/* 名言警句 */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <Quote className="w-5 h-5 text-red-600" />
          名言警句
        </h2>
        <div className="space-y-4">
          {hero.famous_quotes.map((quote, index) => (
            <blockquote 
              key={index}
              className="pl-4 border-l-4 border-red-200 text-neutral-700 italic"
            >
              "{quote}"
            </blockquote>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default HeroDetail;
