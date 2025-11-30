/**
 * 数据管理服务
 * 提供统一的数据访问接口，支持缓存
 */

import { heroes } from '@/data/heroes';
import { cards } from '@/data/cards';
import { relics, rarityConfig } from '@/data/relics';
import { dailyQuotes } from '@/data/daily-quotes';
import { quizQuestions } from '@/data/quiz-questions';
import { radioPlaylist } from '@/data/radio-playlist';
import { Hero, Flashcard, Relic, DailyQuote, QuizQuestion, RadioProgram, Era } from '@/types/models';
import { getGreeting as getGreetingUtil, getDayOfYear, getTodayHero as getTodayHeroUtil, getDailyQuote as getDailyQuoteUtil } from '@/lib/utils';

// 缓存键
const CACHE_KEYS = {
  HEROES: 'xinhuo_heroes',
  CARDS: 'xinhuo_cards',
  RELICS: 'xinhuo_relics',
  QUOTES: 'xinhuo_quotes',
  QUESTIONS: 'xinhuo_questions',
  RADIO: 'xinhuo_radio',
} as const;

class DataManager {
  private static instance: DataManager;
  
  private constructor() {
    // 初始化时将数据缓存到 localStorage
    this.initCache();
  }
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }
  
  /**
   * 初始化缓存
   */
  private initCache(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 检查是否需要更新缓存
      const cacheVersion = localStorage.getItem('xinhuo_cache_version');
      const currentVersion = '1.0.0';
      
      if (cacheVersion !== currentVersion) {
        localStorage.setItem(CACHE_KEYS.HEROES, JSON.stringify(heroes));
        localStorage.setItem(CACHE_KEYS.CARDS, JSON.stringify(cards));
        localStorage.setItem(CACHE_KEYS.RELICS, JSON.stringify(relics));
        localStorage.setItem(CACHE_KEYS.QUOTES, JSON.stringify(dailyQuotes));
        localStorage.setItem(CACHE_KEYS.QUESTIONS, JSON.stringify(quizQuestions));
        localStorage.setItem(CACHE_KEYS.RADIO, JSON.stringify(radioPlaylist));
        localStorage.setItem('xinhuo_cache_version', currentVersion);
      }
    } catch (error) {
      console.warn('[DataManager] 缓存初始化失败:', error);
    }
  }
  
  /**
   * 获取所有英雄
   */
  getHeroes(): Hero[] {
    return heroes;
  }
  
  /**
   * 根据 ID 获取英雄
   */
  getHeroById(id: string): Hero | undefined {
    return heroes.find(hero => hero.id === id);
  }
  
  /**
   * 根据时代筛选英雄
   */
  filterHeroesByEra(era: Era | '全部'): Hero[] {
    if (era === '全部') {
      return heroes;
    }
    return heroes.filter(hero => hero.era === era);
  }
  
  /**
   * 搜索英雄（按名称或头衔）
   */
  searchHeroes(query: string): Hero[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return heroes.filter(hero => 
      hero.name.toLowerCase().includes(lowerQuery) ||
      hero.title.toLowerCase().includes(lowerQuery)
    );
  }
  
  /**
   * 获取所有学习卡片
   */
  getCards(): Flashcard[] {
    return cards;
  }
  
  /**
   * 根据 ID 获取卡片
   */
  getCardById(id: string): Flashcard | undefined {
    return cards.find(card => card.id === id);
  }
  
  /**
   * 获取所有信物
   */
  getRelics(): Relic[] {
    return relics;
  }
  
  /**
   * 根据 ID 获取信物
   */
  getRelicById(id: string): Relic | undefined {
    return relics.find(relic => relic.id === id);
  }
  
  /**
   * 获取稀有度配置
   */
  getRarityConfig() {
    return rarityConfig;
  }
  
  /**
   * 随机抽取信物（基于概率）
   */
  drawRelic(): Relic {
    const random = Math.random();
    let rarity: 'SSR' | 'SR' | 'R';
    
    if (random < rarityConfig.SSR.probability) {
      rarity = 'SSR';
    } else if (random < rarityConfig.SSR.probability + rarityConfig.SR.probability) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }
    
    const relicsOfRarity = relics.filter(r => r.rarity === rarity);
    return relicsOfRarity[Math.floor(Math.random() * relicsOfRarity.length)];
  }
  
  /**
   * 获取所有每日名言
   */
  getDailyQuotes(): DailyQuote[] {
    return dailyQuotes;
  }
  
  /**
   * 获取所有答题问题
   */
  getQuizQuestions(): QuizQuestion[] {
    return quizQuestions;
  }
  
  /**
   * 随机获取指定数量的问题
   */
  getRandomQuestions(count: number): QuizQuestion[] {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  /**
   * 获取电台播放列表
   */
  getRadioPlaylist(): RadioProgram[] {
    return radioPlaylist;
  }
  
  /**
   * 根据分类筛选电台节目
   */
  filterRadioByCategory(category: RadioProgram['category'] | '全部'): RadioProgram[] {
    if (category === '全部') {
      return radioPlaylist;
    }
    return radioPlaylist.filter(program => program.category === category);
  }
  
  // ========== 日期相关内容选择函数 ==========
  
  /**
   * 根据小时获取问候语
   */
  getGreeting(hour?: number): string {
    const h = hour ?? new Date().getHours();
    return getGreetingUtil(h);
  }
  
  /**
   * 获取今日英雄
   */
  getTodayHero(date?: Date): Hero {
    const dayOfYear = getDayOfYear(date);
    return getTodayHeroUtil(dayOfYear, heroes);
  }
  
  /**
   * 获取今日名言
   */
  getDailyQuote(date?: Date): DailyQuote {
    const dayOfYear = getDayOfYear(date);
    return getDailyQuoteUtil(dayOfYear, dailyQuotes);
  }
}

// 导出单例实例
export const dataManager = DataManager.getInstance();
export default dataManager;

// 导出便捷函数
export const getGreeting = (hour?: number) => dataManager.getGreeting(hour);
export const getTodayHero = (date?: Date) => dataManager.getTodayHero(date);
export const getDailyQuote = (date?: Date) => dataManager.getDailyQuote(date);
export const filterHeroesByEra = (era: Era | '全部') => dataManager.filterHeroesByEra(era);
export const searchHeroes = (query: string) => dataManager.searchHeroes(query);
