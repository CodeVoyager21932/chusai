'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { dataManager } from '@/services/dataManager';

export default function KnowledgeGraphPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'graph'>('timeline');
  const cards = dataManager.getCards();

  // 按年份分组事件
  const timelineEvents = cards.map(card => ({
    id: card.id,
    title: card.front_title,
    content: card.back_content,
    keywords: card.back_keywords,
    era: card.category,
  }));

  return (
    <>
      <Header title="知识图谱" />
      
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'timeline' | 'graph')}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="timeline">时间线</TabsTrigger>
            <TabsTrigger value="graph">关系图</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-0">
            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-200" />
              
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="relative pl-10 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* 时间点 */}
                    <div className="absolute left-2 w-5 h-5 rounded-full bg-red-500 border-4 border-white shadow" />
                    
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-neutral-900">{event.title}</h3>
                        <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {event.era}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 line-clamp-3">
                        {event.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.keywords.slice(0, 3).map((keyword, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                关系图谱
              </h3>
              <p className="text-neutral-500 text-sm">
                交互式知识图谱功能正在开发中...
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
