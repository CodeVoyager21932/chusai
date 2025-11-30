'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { dataManager } from '@/services/dataManager';
import { useUserStore } from '@/stores/userStore';
import { ChatMessage, Hero } from '@/types/models';
import { cn } from '@/lib/utils';

const CHAT_STORAGE_KEY = 'xinhuo_chat_history';

export default function AIChatPage() {
  const searchParams = useSearchParams();
  const heroId = searchParams.get('heroId');
  const { incrementAiChatCount } = useUserStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载聊天历史和英雄信息
  useEffect(() => {
    // 加载聊天历史
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load chat history');
      }
    }

    // 如果有 heroId，加载英雄信息
    if (heroId) {
      const hero = dataManager.getHeroById(heroId);
      if (hero) {
        setSelectedHero(hero);
      }
    }
  }, [heroId]);

  // 保存聊天历史
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      heroId: selectedHero?.id,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, selectedHero);
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
        heroId: selectedHero?.id,
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      incrementAiChatCount();
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  return (
    <>
      <Header 
        title={selectedHero ? `与${selectedHero.name}对话` : 'AI 对话'} 
        showSearch={false}
      />
      
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-2xl mx-auto">
        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                {selectedHero ? (
                  <span className="text-2xl font-bold text-red-600">{selectedHero.name[0]}</span>
                ) : (
                  <Bot className="w-8 h-8 text-red-600" />
                )}
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                {selectedHero ? `你好，我是${selectedHero.name}` : '你好，我是星火同志'}
              </h3>
              <p className="text-neutral-500 text-sm">
                {selectedHero 
                  ? `我可以和你分享我的故事和经历` 
                  : '我可以帮你了解党史知识，有什么想问的吗？'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse'
              )}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className={cn(
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-red-100 text-red-600'
                )}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : 
                   selectedHero ? selectedHero.name[0] : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2',
                message.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-sm' 
                  : 'bg-white border border-neutral-100 rounded-tl-sm'
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={cn(
                  'text-xs mt-1',
                  message.role === 'user' ? 'text-blue-200' : 'text-neutral-400'
                )}>
                  {new Date(message.timestamp).toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-red-100 text-red-600">
                  {selectedHero ? selectedHero.name[0] : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t border-neutral-100 bg-white p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedHero ? `向${selectedHero.name}提问...` : '输入你的问题...'}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {messages.length > 0 && (
            <button 
              onClick={clearHistory}
              className="text-xs text-neutral-400 hover:text-neutral-600 mt-2"
            >
              清空聊天记录
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// 模拟 AI 响应生成
function generateAIResponse(question: string, hero: Hero | null): string {
  const responses = hero ? [
    `作为${hero.title}，我想告诉你：${hero.famous_quotes[0] || '我们要为人民服务。'}`,
    `这是个好问题。在我的经历中，${hero.main_deeds[0]}是我最难忘的事情。`,
    `我是${hero.name}，生于${hero.birth_year}年。${hero.biography.slice(0, 100)}...`,
    `关于这个问题，我认为最重要的是坚持信念，就像我在${hero.era}所做的那样。`,
  ] : [
    '这是一个很好的问题！让我来为你解答。党史学习是非常重要的，它能帮助我们了解中国共产党的光辉历程。',
    '你问得很好！在党的历史上，有很多值得我们学习的英雄人物和重要事件。',
    '作为星火同志，我很高兴能和你一起学习党史。你可以问我关于任何英雄人物或历史事件的问题。',
    '学习党史，传承红色基因，这是我们每个人的责任。让我们一起探索这段光辉的历史吧！',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
