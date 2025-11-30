'use client';

import { useState } from 'react';
import { X, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { dataManager } from '@/services/dataManager';
import { Hero } from '@/types/models';
import { cn } from '@/lib/utils';

interface HeroSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (hero: Hero | null) => void;
  selectedHero?: Hero | null;
}

export function HeroSelector({ open, onOpenChange, onSelect, selectedHero }: HeroSelectorProps) {
  const heroes = dataManager.getHeroes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>选择对话角色</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 默认模式 */}
          <button
            onClick={() => {
              onSelect(null);
              onOpenChange(false);
            }}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors',
              !selectedHero 
                ? 'border-red-500 bg-red-50' 
                : 'border-neutral-200 hover:border-neutral-300'
            )}
          >
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-red-100 text-red-600">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-medium">星火同志</p>
              <p className="text-sm text-neutral-500">默认 AI 助手模式</p>
            </div>
          </button>

          {/* 英雄角色列表 */}
          <div className="space-y-2">
            <p className="text-sm text-neutral-500 font-medium">角色扮演模式</p>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {heroes.map((hero) => (
                <button
                  key={hero.id}
                  onClick={() => {
                    onSelect(hero);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border transition-colors text-left',
                    selectedHero?.id === hero.id 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">
                      {hero.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{hero.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{hero.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
