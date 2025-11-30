'use client';

import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { dataManager } from '@/services/dataManager';
import { useUIStore } from '@/stores/uiStore';
import { RadioProgram } from '@/types/models';
import { cn } from '@/lib/utils';

type Category = RadioProgram['category'] | '全部';

export default function RedRadioPage() {
  const playlist = dataManager.getRadioPlaylist();
  const { currentAudio, audioPlaying, setAudio, setAudioPlaying } = useUIStore();
  const [category, setCategory] = useState<Category>('全部');

  const filteredPlaylist = category === '全部' 
    ? playlist 
    : playlist.filter(p => p.category === category);

  const handlePlay = (program: RadioProgram) => {
    if (currentAudio?.id === program.id) {
      setAudioPlaying(!audioPlaying);
    } else {
      setAudio(program);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Header title="红色电台" />
      
      <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* 当前播放 */}
        {currentAudio && (
          <Card className="p-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                <Volume2 className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{currentAudio.title}</h3>
                <p className="text-white/80 text-sm">{currentAudio.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  className="bg-white text-red-600 hover:bg-white/90"
                  onClick={() => setAudioPlaying(!audioPlaying)}
                >
                  {audioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 分类筛选 */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
          <TabsList className="w-full flex overflow-x-auto hide-scrollbar">
            <TabsTrigger value="全部" className="flex-1">全部</TabsTrigger>
            <TabsTrigger value="英雄原声" className="flex-1">英雄原声</TabsTrigger>
            <TabsTrigger value="历史实况" className="flex-1">历史实况</TabsTrigger>
            <TabsTrigger value="党史故事" className="flex-1">党史故事</TabsTrigger>
            <TabsTrigger value="英雄故事" className="flex-1">英雄故事</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 播放列表 */}
        <div className="space-y-3">
          {filteredPlaylist.map((program, index) => {
            const isPlaying = currentAudio?.id === program.id && audioPlaying;
            
            return (
              <Card 
                key={program.id}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:shadow-md animate-fade-in',
                  isPlaying && 'border-red-200 bg-red-50'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePlay(program)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    isPlaying ? 'bg-red-500 text-white' : 'bg-neutral-100'
                  )}>
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 text-neutral-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">{program.title}</h4>
                    <p className="text-sm text-neutral-500">{program.artist}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                      {program.category}
                    </span>
                    <p className="text-sm text-neutral-500 mt-1">
                      {formatDuration(program.duration)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
