'use client';

import { useEffect, useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { dataManager } from '@/services/dataManager';
import { DailyQuote } from '@/types/models';
import { formatDate } from '@/lib/utils';

export function DailySignModal() {
  const { showDailySign, setShowDailySign } = useUIStore();
  const { checkIn, hasCheckedIn, stats } = useUserStore();
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = formatDate(new Date());

  useEffect(() => {
    setQuote(dataManager.getDailyQuote());
    setIsCheckedIn(hasCheckedIn(today));
  }, [today, hasCheckedIn]);

  const handleCheckIn = () => {
    if (isCheckedIn) return;
    
    checkIn(today);
    setIsCheckedIn(true);
    setShowSuccess(true);
    
    // 3秒后关闭成功动画
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <Dialog open={showDailySign} onOpenChange={setShowDailySign}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            每日签到
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 签到状态 */}
          <div className="text-center">
            {showSuccess ? (
              <div className="animate-bounce">
                <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                <p className="text-lg font-bold text-neutral-900">签到成功！</p>
                <p className="text-sm text-neutral-500">
                  连续打卡 {stats.continuous_days} 天
                </p>
              </div>
            ) : isCheckedIn ? (
              <div>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-lg font-bold text-neutral-900">今日已签到</p>
                <p className="text-sm text-neutral-500">
                  连续打卡 {stats.continuous_days} 天
                </p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-lg font-bold text-neutral-900">今日未签到</p>
                <p className="text-sm text-neutral-500">
                  点击下方按钮完成签到
                </p>
              </div>
            )}
          </div>

          {/* 今日名言 */}
          {quote && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4">
              <p className="text-neutral-800 font-medium text-center leading-relaxed">
                "{quote.quote_content}"
              </p>
              <p className="text-sm text-neutral-500 text-center mt-2">
                —— {quote.author}
              </p>
              {quote.lucky_tips && (
                <p className="text-xs text-red-600 text-center mt-3 bg-white/50 rounded-lg py-1.5">
                  💡 {quote.lucky_tips}
                </p>
              )}
            </div>
          )}

          {/* 签到按钮 */}
          {!isCheckedIn && !showSuccess && (
            <Button 
              onClick={handleCheckIn}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              立即签到
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DailySignModal;
