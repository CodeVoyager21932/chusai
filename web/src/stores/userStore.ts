import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo, UserStats } from '@/types/models';

interface UserStore {
  // State
  userInfo: UserInfo;
  stats: UserStats;
  checkInRecords: string[]; // 日期字符串数组 YYYY-MM-DD
  collectedRelics: string[]; // 已收集的信物 ID
  masteredCards: string[]; // 已掌握的卡片 ID
  
  // Actions
  setUserInfo: (info: Partial<UserInfo>) => void;
  checkIn: (date: string) => void;
  hasCheckedIn: (date: string) => boolean;
  updateStats: (stats: Partial<UserStats>) => void;
  collectRelic: (relicId: string) => void;
  hasCollectedRelic: (relicId: string) => boolean;
  masterCard: (cardId: string) => void;
  hasMasteredCard: (cardId: string) => boolean;
  incrementAiChatCount: () => void;
  reset: () => void;
}

const initialStats: UserStats = {
  continuous_days: 0,
  total_days: 0,
  mastered_cards: 0,
  ai_chat_count: 0,
  relics_collected: 0,
};

const initialUserInfo: UserInfo = {
  nickName: '星火学员',
  avatarUrl: '/images/default-avatar.png',
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial State
      userInfo: initialUserInfo,
      stats: initialStats,
      checkInRecords: [],
      collectedRelics: [],
      masteredCards: [],
      
      // Actions
      setUserInfo: (info) => set((state) => ({
        userInfo: { ...state.userInfo, ...info }
      })),
      
      checkIn: (date) => {
        const state = get();
        if (state.checkInRecords.includes(date)) return;
        
        // 计算连续天数
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const wasCheckedInYesterday = state.checkInRecords.includes(yesterdayStr);
        const newContinuousDays = wasCheckedInYesterday 
          ? state.stats.continuous_days + 1 
          : 1;
        
        set((state) => ({
          checkInRecords: [...state.checkInRecords, date],
          stats: {
            ...state.stats,
            continuous_days: newContinuousDays,
            total_days: state.stats.total_days + 1,
          }
        }));
      },
      
      hasCheckedIn: (date) => get().checkInRecords.includes(date),
      
      updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats }
      })),
      
      collectRelic: (relicId) => {
        const state = get();
        if (state.collectedRelics.includes(relicId)) return;
        
        set((state) => ({
          collectedRelics: [...state.collectedRelics, relicId],
          stats: {
            ...state.stats,
            relics_collected: state.stats.relics_collected + 1,
          }
        }));
      },
      
      hasCollectedRelic: (relicId) => get().collectedRelics.includes(relicId),
      
      masterCard: (cardId) => {
        const state = get();
        if (state.masteredCards.includes(cardId)) return;
        
        set((state) => ({
          masteredCards: [...state.masteredCards, cardId],
          stats: {
            ...state.stats,
            mastered_cards: state.stats.mastered_cards + 1,
          }
        }));
      },
      
      hasMasteredCard: (cardId) => get().masteredCards.includes(cardId),
      
      incrementAiChatCount: () => set((state) => ({
        stats: {
          ...state.stats,
          ai_chat_count: state.stats.ai_chat_count + 1,
        }
      })),
      
      reset: () => set({
        userInfo: initialUserInfo,
        stats: initialStats,
        checkInRecords: [],
        collectedRelics: [],
        masteredCards: [],
      }),
    }),
    {
      name: 'xinhuo-user-storage',
    }
  )
);

export default useUserStore;
