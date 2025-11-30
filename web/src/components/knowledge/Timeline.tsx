'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'revolution' | 'construction' | 'reform' | 'new-era';
  imageUrl?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const categoryColors = {
  'revolution': 'bg-red-100 text-red-700 border-red-200',
  'construction': 'bg-blue-100 text-blue-700 border-blue-200',
  'reform': 'bg-green-100 text-green-700 border-green-200',
  'new-era': 'bg-amber-100 text-amber-700 border-amber-200',
};

const categoryNames = {
  'revolution': '革命时期',
  'construction': '建设时期',
  'reform': '改革时期',
  'new-era': '新时代',
};

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.year - b.year);
  
  return (
    <div className="relative">
      {/* 时间线 */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-200 transform md:-translate-x-1/2" />
      
      <div className="space-y-8">
        {sortedEvents.map((event, index) => (
          <div
            key={event.id}
            className={cn(
              'relative flex items-start gap-4',
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            )}
          >
            {/* 时间点 */}
            <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 mt-6 z-10" />
            
            {/* 年份标签 */}
            <div className={cn(
              'hidden md:block w-1/2 text-right pr-8',
              index % 2 !== 0 && 'text-left pl-8 pr-0'
            )}>
              <span className="text-2xl font-bold text-red-600">{event.year}</span>
            </div>
            
            {/* 事件卡片 */}
            <Card className={cn(
              'ml-10 md:ml-0 md:w-1/2 hover:shadow-md transition-shadow',
              index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="md:hidden text-lg font-bold text-red-600">{event.year}</span>
                  <Badge variant="outline" className={categoryColors[event.category]}>
                    {categoryNames[event.category]}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-neutral-600">{event.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
