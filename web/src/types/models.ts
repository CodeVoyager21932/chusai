/**
 * 核心数据模型类型定义
 */

// 时代类型
export type Era = '革命时期' | '建设时期' | '改革时期' | '新时代';
export type EraKey = 'revolution' | 'construction' | 'reform' | 'new_era';

// 英雄人物模型
export interface Hero {
  id: string;
  name: string;
  birth_year: number;
  death_year: number;
  era: Era;
  title: string;
  avatar: string;
  biography: string;
  main_deeds: string[];
  famous_quotes: string[];
}

// 学习卡片模型
export interface Flashcard {
  id: string;
  front_title: string;
  front_image: string;
  back_content: string;
  back_keywords: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  era: EraKey;
}

// 红色信物模型
export interface Relic {
  id: string;
  name: string;
  rarity: 'SSR' | 'SR' | 'R';
  image: string;
  related_hero_id: string;
  story: string;
  year: number;
}

// 稀有度配置
export interface RarityConfig {
  name: string;
  probability: number;
  color: string;
  gradient: string;
  glow: string;
}

// 答题问题模型
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 每日名言模型
export interface DailyQuote {
  id: string;
  date?: string;
  image_url?: string;
  quote_content: string;
  author: string;
  lucky_tips?: string;
}

// 电台节目模型
export interface RadioProgram {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  description: string;
  category: '英雄原声' | '历史实况' | '党史故事' | '英雄故事';
}

// 用户统计数据
export interface UserStats {
  continuous_days: number;
  total_days: number;
  mastered_cards: number;
  ai_chat_count: number;
  relics_collected: number;
}

// 聊天消息模型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  heroId?: string;
}

// 签到记录
export interface CheckInRecord {
  date: string;
  quote: DailyQuote;
}

// 徽章/成就模型
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlock_time?: Date;
}

// 对战状态
export interface BattleState {
  id: string;
  opponent: {
    nickName: string;
    avatarUrl: string;
  };
  userScore: number;
  opponentScore: number;
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  status: 'matching' | 'playing' | 'finished';
}

// 用户信息
export interface UserInfo {
  nickName: string;
  avatarUrl: string;
}

// 卡片学习状态
export type CardStatus = 'new' | 'learning' | 'mastered' | 'needs_review';

// 学习进度
export interface CardProgress {
  cardId: string;
  status: CardStatus;
  lastReviewDate?: string;
  reviewCount: number;
}
