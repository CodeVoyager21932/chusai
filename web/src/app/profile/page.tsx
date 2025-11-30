'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/stores/userStore';
import { Calendar, BookOpen, MessageCircle, Gift, Trophy } from 'lucide-react';

export default function ProfilePage() {
  const { userInfo, stats, checkInRecords } = useUserStore();

  const statItems = [
    { icon: Calendar, label: '连续打卡', value: stats.continuous_days, unit: '天', color: 'text-red-600', bg: 'bg-red-50' },
    { icon: Calendar, label: '累计打卡', value: stats.total_days, unit: '天', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: BookOpen, label: '掌握卡片', value: stats.mastered_cards, unit: '张', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: MessageCircle, label: 'AI对话', value: stats.ai_chat_count, unit: '次', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Gift, label: '收集信物', value: stats.relics_collected, unit: '件', color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  // 生成当月日历
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      day: i,
      isCheckedIn: checkInRecords.includes(dateStr),
      isToday: i === today.getDate(),
    });
  }

  return (
    <>
      <Header title="个人中心" showSearch={false} />
      
      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* 用户信息 */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-red-100">
              <AvatarImage src={userInfo.avatarUrl} />
              <AvatarFallback className="bg-red-100 text-red-600 text-2xl">
                {userInfo.nickName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{userInfo.nickName}</h2>
              <p className="text-neutral-500">红色学习者</p>
              <div className="flex items-center gap-1 mt-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-neutral-600">Lv.{Math.floor(stats.total_days / 7) + 1}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 学习统计 */}
        <Card className="p-4">
          <h3 className="font-semibold text-neutral-900 mb-4">学习统计</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {statItems.map((item) => (
              <div key={item.label} className="text-center">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-lg font-bold text-neutral-900">
                  {item.value}
                  <span className="text-xs font-normal text-neutral-500 ml-0.5">{item.unit}</span>
                </div>
                <p className="text-xs text-neutral-500">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 签到日历 */}
        <Card className="p-4">
          <h3 className="font-semibold text-neutral-900 mb-4">
            {year}年{month + 1}月签到
          </h3>
          
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-xs text-neutral-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* 日期 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => (
              <div 
                key={index}
                className={`
                  aspect-square flex items-center justify-center rounded-lg text-sm
                  ${!item ? '' : item.isCheckedIn 
                    ? 'bg-red-500 text-white font-medium' 
                    : item.isToday 
                      ? 'bg-red-100 text-red-600 font-medium'
                      : 'text-neutral-600'
                  }
                `}
              >
                {item?.day}
              </div>
            ))}
          </div>
        </Card>

        {/* 成就系统 */}
        <Card className="p-4">
          <h3 className="font-semibold text-neutral-900 mb-4">成就徽章</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: '🔥', name: '初学者', unlocked: true },
              { icon: '⭐', name: '坚持7天', unlocked: stats.continuous_days >= 7 },
              { icon: '🏆', name: '知识达人', unlocked: stats.mastered_cards >= 10 },
              { icon: '💎', name: '收藏家', unlocked: stats.relics_collected >= 5 },
            ].map((badge) => (
              <div 
                key={badge.name}
                className={`text-center ${!badge.unlocked && 'opacity-40'}`}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs text-neutral-600">{badge.name}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
