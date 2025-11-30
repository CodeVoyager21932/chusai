'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SignInCalendarProps {
  signedDates: string[]; // 格式: 'YYYY-MM-DD'
}

export function SignInCalendar({ signedDates }: SignInCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // 获取当月第一天是星期几
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 生成日历格子
  const calendarDays = [];
  
  // 填充空白格子
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // 填充日期
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  const isSignedIn = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return signedDates.includes(dateStr);
  };
  
  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-4">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-medium">
          {year}年{month + 1}月
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-neutral-500 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              'aspect-square flex items-center justify-center rounded-lg text-sm relative',
              day === null && 'invisible',
              day && isToday(day) && 'ring-2 ring-red-500',
              day && isSignedIn(day) && 'bg-red-100 text-red-600'
            )}
          >
            {day}
            {day && isSignedIn(day) && (
              <Check className="w-3 h-3 absolute bottom-0.5 right-0.5 text-red-500" />
            )}
          </div>
        ))}
      </div>
      
      {/* 统计 */}
      <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
        <p className="text-sm text-neutral-500">
          本月已签到 <span className="font-medium text-red-600">
            {signedDates.filter(d => {
              const date = new Date(d);
              return date.getFullYear() === year && date.getMonth() === month;
            }).length}
          </span> 天
        </p>
      </div>
    </div>
  );
}
