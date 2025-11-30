'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { audioManager } from '@/services/audioManager';
import { RadioProgram } from '@/types/models';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const [currentProgram, setCurrentProgram] = useState<RadioProgram | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const program = audioManager.getCurrentProgram();
      setCurrentProgram(program);
      setIsPlaying(audioManager.isPlaying());
      setProgress(audioManager.getProgress());
      setIsVisible(!!program);
    };

    // 初始状态
    updateState();

    // 订阅状态变化
    const unsubscribe = audioManager.subscribe(updateState);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isVisible || !currentProgram) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn(
      'fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80',
      'bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-neutral-100',
      'p-3 z-40 transition-transform duration-300',
      isVisible ? 'translate-y-0' : 'translate-y-full'
    )}>
      {/* 进度条 */}
      <Progress value={progress} className="h-1 mb-3" />
      
      <div className="flex items-center gap-3">
        {/* 封面图标 */}
        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5 text-red-600" />
        </div>
        
        {/* 节目信息 */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{currentProgram.title}</p>
          <p className="text-xs text-neutral-500 truncate">
            {formatTime(audioManager.getCurrentTime())} / {formatTime(audioManager.getDuration() || currentProgram.duration)}
          </p>
        </div>
        
        {/* 控制按钮 */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => audioManager.playPrevious()}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => audioManager.toggle()}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => audioManager.playNext()}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-neutral-400"
            onClick={() => audioManager.stop()}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
