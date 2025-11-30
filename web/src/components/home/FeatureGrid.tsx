'use client';

import Link from 'next/link';
import { MessageCircle, Network, Flame, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    href: '/ai-chat',
    icon: MessageCircle,
    title: 'AI 对话',
    description: '与星火同志聊天',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    href: '/knowledge-graph',
    icon: Network,
    title: '知识图谱',
    description: '探索党史脉络',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    href: '/spark-prairie',
    icon: Flame,
    title: '星火燎原',
    description: '学习练习对战',
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    href: '/red-heritage',
    icon: Gift,
    title: '红色珍藏',
    description: '收集红色信物',
    gradient: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {features.map((feature) => (
        <Link key={feature.href} href={feature.href}>
          <div className={cn(
            'group relative overflow-hidden rounded-xl p-4 transition-all hover:shadow-md cursor-pointer',
            feature.bgColor
          )}>
            {/* 背景装饰 */}
            <div className={cn(
              'absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-20 blur-xl transition-transform group-hover:scale-150',
              `bg-gradient-to-br ${feature.gradient}`
            )} />
            
            {/* 图标 */}
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
              'bg-white shadow-sm'
            )}>
              <feature.icon className={cn('w-5 h-5', feature.iconColor)} />
            </div>
            
            {/* 文字 */}
            <h4 className="font-semibold text-neutral-900">{feature.title}</h4>
            <p className="text-xs text-neutral-500 mt-0.5">{feature.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default FeatureGrid;
