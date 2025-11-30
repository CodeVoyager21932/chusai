'use client';

import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage, Hero } from '@/types/models';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
  hero?: Hero | null;
}

export function ChatBubble({ message, hero }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={cn(
          isUser ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : hero ? (
            hero.name[0]
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        'max-w-[80%] rounded-2xl px-4 py-2',
        isUser 
          ? 'bg-blue-500 text-white rounded-tr-sm' 
          : 'bg-white border border-neutral-100 rounded-tl-sm'
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={cn(
          'text-xs mt-1',
          isUser ? 'text-blue-200' : 'text-neutral-400'
        )}>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}
