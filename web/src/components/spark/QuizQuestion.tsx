'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dataManager } from '@/services/dataManager';
import { useLearningStore } from '@/stores/learningStore';
import { QuizQuestion as QuizQuestionType } from '@/types/models';
import { cn } from '@/lib/utils';

export function QuizQuestion() {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { quizScore, quizTotal, answerQuestion, resetQuiz } = useLearningStore();

  useEffect(() => {
    // 获取随机 5 道题
    setQuestions(dataManager.getRandomQuestions(5));
    resetQuiz();
  }, []);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isFinished = currentIndex >= questions.length && questions.length > 0;

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (currentQuestion) {
      answerQuestion(index, currentQuestion.correct_index);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex(currentIndex + 1);
  };

  const handleRestart = () => {
    setQuestions(dataManager.getRandomQuestions(5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    resetQuiz();
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">加载题目中...</p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((quizScore / quizTotal) * 100);
    
    return (
      <Card className="p-6 text-center">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">练习完成！</h3>
        <p className="text-neutral-600 mb-4">
          你答对了 {quizScore} / {quizTotal} 道题
        </p>
        <div className="text-4xl font-bold text-red-600 mb-6">
          {percentage}%
        </div>
        <Button onClick={handleRestart}>
          <RotateCcw className="w-4 h-4 mr-2" />
          再练一次
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 进度和分数 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-neutral-500">
          <span>第 {currentIndex + 1} / {questions.length} 题</span>
          <span>得分: {quizScore}</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* 题目 */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-neutral-900 mb-6">
          {currentQuestion?.question}
        </h3>

        {/* 选项 */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correct_index;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={showResult}
                className={cn(
                  'w-full p-4 rounded-xl border-2 text-left transition-all',
                  'hover:border-red-200 hover:bg-red-50',
                  !showResult && 'cursor-pointer',
                  showResult && 'cursor-default',
                  showCorrect && 'border-green-500 bg-green-50',
                  showWrong && 'border-red-500 bg-red-50',
                  !showResult && isSelected && 'border-red-500 bg-red-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    showCorrect ? 'bg-green-500 text-white' : 
                    showWrong ? 'bg-red-500 text-white' :
                    'bg-neutral-100 text-neutral-600'
                  )}>
                    {showCorrect ? <CheckCircle className="w-5 h-5" /> :
                     showWrong ? <XCircle className="w-5 h-5" /> :
                     String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 解析 */}
        {showResult && currentQuestion && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm font-medium text-blue-800 mb-1">解析</p>
            <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
          </div>
        )}
      </Card>

      {/* 下一题按钮 */}
      {showResult && (
        <Button onClick={handleNext} className="w-full">
          {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
        </Button>
      )}
    </div>
  );
}

export default QuizQuestion;
