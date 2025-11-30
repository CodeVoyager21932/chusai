'use client';

import { useState, useEffect } from 'react';
import { Swords, Trophy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useLearningStore } from '@/stores/learningStore';
import { useUserStore } from '@/stores/userStore';
import { dataManager } from '@/services/dataManager';
import { QuizQuestion } from '@/types/models';
import { cn } from '@/lib/utils';

export function BattleArena() {
  const { battleState, startBattle, updateBattleScore, endBattle } = useLearningStore();
  const { userInfo } = useUserStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (battleState?.status === 'playing') {
      setQuestions(dataManager.getRandomQuestions(5));
      setCurrentIndex(0);
    }
  }, [battleState?.status]);

  // 倒计时
  useEffect(() => {
    if (battleState?.status !== 'playing' || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleState?.status, selectedAnswer, currentIndex]);

  const handleTimeout = () => {
    // 超时，对手得分
    if (battleState) {
      const opponentScore = battleState.opponentScore + 1;
      updateBattleScore(battleState.userScore, opponentScore);
    }
    goToNext();
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    const currentQuestion = questions[currentIndex];
    if (currentQuestion && battleState) {
      const isCorrect = index === currentQuestion.correct_index;
      const userScore = isCorrect ? battleState.userScore + 1 : battleState.userScore;
      // 模拟对手答题（60% 正确率）
      const opponentCorrect = Math.random() < 0.6;
      const opponentScore = opponentCorrect ? battleState.opponentScore + 1 : battleState.opponentScore;
      
      updateBattleScore(userScore, opponentScore);
    }

    setTimeout(goToNext, 1500);
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      endBattle();
    }
  };

  // 匹配中
  if (!battleState || battleState.status === 'matching') {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse">
          <Swords className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            {battleState ? '正在匹配对手...' : '准备开始对战'}
          </h3>
          <p className="text-neutral-500 mb-6">
            {battleState ? '请稍候' : '点击下方按钮开始匹配'}
          </p>
        </div>
        {!battleState && (
          <Button onClick={startBattle} size="lg">
            <Swords className="w-5 h-5 mr-2" />
            开始匹配
          </Button>
        )}
      </Card>
    );
  }

  // 对战结束
  if (battleState.status === 'finished') {
    const isWin = battleState.userScore > battleState.opponentScore;
    const isDraw = battleState.userScore === battleState.opponentScore;

    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">
          {isWin ? '🏆' : isDraw ? '🤝' : '💪'}
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">
          {isWin ? '恭喜获胜！' : isDraw ? '势均力敌！' : '再接再厉！'}
        </h3>
        
        <div className="flex items-center justify-center gap-8 my-6">
          <div className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-2">
              <AvatarFallback className="bg-red-100 text-red-600 text-xl">
                {userInfo.nickName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-neutral-500">你</p>
            <p className="text-3xl font-bold text-red-600">{battleState.userScore}</p>
          </div>
          
          <div className="text-2xl font-bold text-neutral-300">VS</div>
          
          <div className="text-center">
            <Avatar className="w-16 h-16 mx-auto mb-2">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                {battleState.opponent.nickName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-neutral-500">{battleState.opponent.nickName}</p>
            <p className="text-3xl font-bold text-blue-600">{battleState.opponentScore}</p>
          </div>
        </div>

        <Button onClick={startBattle} size="lg">
          <Swords className="w-5 h-5 mr-2" />
          再来一局
        </Button>
      </Card>
    );
  }

  // 对战中
  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-4">
      {/* 对战信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-red-100 text-red-600">
              {userInfo.nickName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">你</p>
            <p className="text-xl font-bold text-red-600">{battleState.userScore}</p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center gap-1 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-xl font-bold">{timeLeft}</span>
          </div>
          <p className="text-xs text-neutral-500">第 {currentIndex + 1}/5 题</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">{battleState.opponent.nickName}</p>
            <p className="text-xl font-bold text-blue-600">{battleState.opponentScore}</p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {battleState.opponent.nickName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* 时间进度条 */}
      <Progress value={(timeLeft / 10) * 100} className="h-2" />

      {/* 题目 */}
      {currentQuestion && (
        <Card className="p-5">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct_index;
              const showResult = selectedAnswer !== null;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm transition-all',
                    !showResult && 'hover:border-red-200 hover:bg-red-50',
                    showResult && isCorrect && 'border-green-500 bg-green-50',
                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50'
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export default BattleArena;
