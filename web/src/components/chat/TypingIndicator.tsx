'use client';

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Hero } from '@/types/models';

interface TypingIndicatorProps {
  hero?: Hero | null;
}

export function TypingIndicator({ hero }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-red-100 text-red-600">
          {hero ? hero.name[0] : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
