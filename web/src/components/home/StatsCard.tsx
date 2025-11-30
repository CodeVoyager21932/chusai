'use client';

import { Calendar, BookOpen, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useUserStore } from '@/stores/userStore';

export function StatsCard() {
  const { stats } = useUserStore();

  const statItems = [
    {
      icon: Calendar,
      label: '连续打卡',
      value: stats.continuous_days,
      unit: '天',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: BookOpen,
      label: '掌握卡片',
      value: stats.mastered_cards,
      unit: '张',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: MessageCircle,
      label: 'AI 对话',
      value: stats.ai_chat_count,
      unit: '次',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center mx-auto mb-2`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-xl font-bold text-neutral-900">
              {item.value}
              <span className="text-sm font-normal text-neutral-500 ml-0.5">
                {item.unit}
              </span>
            </div>
            <p className="text-xs text-neutral-500">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default StatsCard;
