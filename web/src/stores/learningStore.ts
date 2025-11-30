import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BattleState, CardProgress, CardStatus } from '@/types/models';

type LearningMode = 'learn' | 'practice' | 'battle';

interface LearningStore {
  // State
  currentMode: LearningMode;
  currentCardIndex: number;
  quizScore: number;
  quizTotal: number;
  battleState: BattleState | null;
  cardProgress: Record<string, CardProgress>;
  needsReviewCards: string[]; // 需要复习的卡片 ID
  
  // Actions
  setMode: (mode: LearningMode) => void;
  nextCard: () => void;
  prevCard: () => void;
  setCardIndex: (index: number) => void;
  resetCardIndex: () => void;
  
  // Quiz Actions
  answerQuestion: (selectedIndex: number, correctIndex: number) => boolean;
  resetQuiz: () => void;
  
  // Card Progress Actions
  markCardStatus: (cardId: string, status: CardStatus) => void;
  getCardStatus: (cardId: string) => CardStatus;
  addToReview: (cardId: string) => void;
  removeFromReview: (cardId: string) => void;
  
  // Battle Actions
  startBattle: () => void;
  updateBattleScore: (userScore: number, opponentScore: number) => void;
  endBattle: () => void;
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentMode: 'learn',
      currentCardIndex: 0,
      quizScore: 0,
      quizTotal: 0,
      battleState: null,
      cardProgress: {},
      needsReviewCards: [],
      
      // Actions
      setMode: (mode) => set({ currentMode: mode, currentCardIndex: 0 }),
      
      nextCard: () => set((state) => ({ 
        currentCardIndex: state.currentCardIndex + 1 
      })),
      
      prevCard: () => set((state) => ({ 
        currentCardIndex: Math.max(0, state.currentCardIndex - 1) 
      })),
      
      setCardIndex: (index) => set({ currentCardIndex: index }),
      
      resetCardIndex: () => set({ currentCardIndex: 0 }),
      
      // Quiz Actions
      answerQuestion: (selectedIndex, correctIndex) => {
        const isCorrect = selectedIndex === correctIndex;
        set((state) => ({
          quizScore: isCorrect ? state.quizScore + 1 : state.quizScore,
          quizTotal: state.quizTotal + 1,
        }));
        return isCorrect;
      },
      
      resetQuiz: () => set({ quizScore: 0, quizTotal: 0 }),
      
      // Card Progress Actions
      markCardStatus: (cardId, status) => {
        const now = new Date().toISOString().split('T')[0];
        set((state) => ({
          cardProgress: {
            ...state.cardProgress,
            [cardId]: {
              cardId,
              status,
              lastReviewDate: now,
              reviewCount: (state.cardProgress[cardId]?.reviewCount || 0) + 1,
            }
          }
        }));
      },
      
      getCardStatus: (cardId) => {
        const progress = get().cardProgress[cardId];
        return progress?.status || 'new';
      },
      
      addToReview: (cardId) => {
        const state = get();
        if (!state.needsReviewCards.includes(cardId)) {
          set({ needsReviewCards: [...state.needsReviewCards, cardId] });
        }
        // 同时更新卡片状态
        get().markCardStatus(cardId, 'needs_review');
      },
      
      removeFromReview: (cardId) => {
        set((state) => ({
          needsReviewCards: state.needsReviewCards.filter(id => id !== cardId)
        }));
      },
      
      // Battle Actions
      startBattle: () => {
        const opponents = [
          { nickName: '红色学霸', avatarUrl: '/images/avatars/opponent1.png' },
          { nickName: '党史达人', avatarUrl: '/images/avatars/opponent2.png' },
          { nickName: '知识先锋', avatarUrl: '/images/avatars/opponent3.png' },
        ];
        const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
        
        set({
          battleState: {
            id: `battle_${Date.now()}`,
            opponent: randomOpponent,
            userScore: 0,
            opponentScore: 0,
            currentRound: 1,
            totalRounds: 5,
            timeLeft: 30,
            status: 'matching',
          }
        });
        
        // 模拟匹配延迟
        setTimeout(() => {
          set((state) => ({
            battleState: state.battleState 
              ? { ...state.battleState, status: 'playing' }
              : null
          }));
        }, 2000);
      },
      
      updateBattleScore: (userScore, opponentScore) => {
        set((state) => ({
          battleState: state.battleState
            ? { ...state.battleState, userScore, opponentScore }
            : null
        }));
      },
      
      endBattle: () => {
        set((state) => ({
          battleState: state.battleState
            ? { ...state.battleState, status: 'finished' }
            : null
        }));
      },
    }),
    {
      name: 'xinhuo-learning-storage',
      partialize: (state) => ({
        cardProgress: state.cardProgress,
        needsReviewCards: state.needsReviewCards,
      }),
    }
  )
);

export default useLearningStore;
