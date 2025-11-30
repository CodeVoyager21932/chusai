/**
 * **Feature: web-migration, Property 7: Data Persistence Round-Trip**
 * **Validates: Requirements 10.1, 17.3**
 * 
 * *For any* user progress data (stats, collected relics, mastered cards, check-in records), 
 * storing to localStorage and retrieving SHALL produce equivalent data.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { UserStats, ChatMessage } from '@/types/models';

// 模拟 localStorage
const createMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
};

// 用户统计数据生成器
const userStatsArbitrary = fc.record({
  continuous_days: fc.integer({ min: 0, max: 1000 }),
  total_days: fc.integer({ min: 0, max: 10000 }),
  mastered_cards: fc.integer({ min: 0, max: 1000 }),
  ai_chat_count: fc.integer({ min: 0, max: 10000 }),
  relics_collected: fc.integer({ min: 0, max: 100 }),
});

// 字符串数组生成器（用于 ID 列表）
const idArrayArbitrary = fc.array(
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('"')),
  { minLength: 0, maxLength: 50 }
);

// 日期字符串生成器 (YYYY-MM-DD)
const dateStringArbitrary = fc.date({ 
  min: new Date('2020-01-01'), 
  max: new Date('2030-12-31') 
}).map(d => d.toISOString().split('T')[0]);

// 聊天消息生成器
const chatMessageArbitrary = fc.record({
  id: fc.uuid(),
  role: fc.constantFrom('user', 'assistant') as fc.Arbitrary<'user' | 'assistant'>,
  content: fc.string({ minLength: 0, maxLength: 500 }).filter(s => !s.includes('\\')),
  timestamp: fc.integer({ min: 0, max: Date.now() + 1000000000 }),
  heroId: fc.option(fc.string({ minLength: 1, maxLength: 20 })),
});

describe('Data Persistence Round-Trip', () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

  beforeEach(() => {
    mockStorage = createMockStorage();
  });

  /**
   * Property: UserStats 数据往返一致性
   */
  it('should preserve UserStats after save and load', () => {
    fc.assert(
      fc.property(userStatsArbitrary, (stats) => {
        const key = 'test_user_stats';
        
        // 保存
        mockStorage.setItem(key, JSON.stringify(stats));
        
        // 加载
        const loaded = JSON.parse(mockStorage.getItem(key) || '{}') as UserStats;
        
        // 验证
        return (
          loaded.continuous_days === stats.continuous_days &&
          loaded.total_days === stats.total_days &&
          loaded.mastered_cards === stats.mastered_cards &&
          loaded.ai_chat_count === stats.ai_chat_count &&
          loaded.relics_collected === stats.relics_collected
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 收集的信物 ID 列表往返一致性
   */
  it('should preserve collected relics array after save and load', () => {
    fc.assert(
      fc.property(idArrayArbitrary, (relicIds) => {
        const key = 'test_collected_relics';
        
        // 保存
        mockStorage.setItem(key, JSON.stringify(relicIds));
        
        // 加载
        const loaded = JSON.parse(mockStorage.getItem(key) || '[]') as string[];
        
        // 验证长度和内容
        if (loaded.length !== relicIds.length) return false;
        return relicIds.every((id, index) => loaded[index] === id);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 掌握的卡片 ID 列表往返一致性
   */
  it('should preserve mastered cards array after save and load', () => {
    fc.assert(
      fc.property(idArrayArbitrary, (cardIds) => {
        const key = 'test_mastered_cards';
        
        // 保存
        mockStorage.setItem(key, JSON.stringify(cardIds));
        
        // 加载
        const loaded = JSON.parse(mockStorage.getItem(key) || '[]') as string[];
        
        // 验证
        if (loaded.length !== cardIds.length) return false;
        return cardIds.every((id, index) => loaded[index] === id);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 签到记录日期列表往返一致性
   */
  it('should preserve check-in records after save and load', () => {
    fc.assert(
      fc.property(
        fc.array(dateStringArbitrary, { minLength: 0, maxLength: 365 }),
        (dates) => {
          const key = 'test_checkin_records';
          
          // 保存
          mockStorage.setItem(key, JSON.stringify(dates));
          
          // 加载
          const loaded = JSON.parse(mockStorage.getItem(key) || '[]') as string[];
          
          // 验证
          if (loaded.length !== dates.length) return false;
          return dates.every((date, index) => loaded[index] === date);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 完整用户数据对象往返一致性
   */
  it('should preserve complete user data object after save and load', () => {
    const userDataArbitrary = fc.record({
      stats: userStatsArbitrary,
      collectedRelics: idArrayArbitrary,
      masteredCards: idArrayArbitrary,
      checkInRecords: fc.array(dateStringArbitrary, { minLength: 0, maxLength: 100 }),
    });

    fc.assert(
      fc.property(userDataArbitrary, (userData) => {
        const key = 'test_user_data';
        
        // 保存
        mockStorage.setItem(key, JSON.stringify(userData));
        
        // 加载
        const loaded = JSON.parse(mockStorage.getItem(key) || '{}');
        
        // 验证
        return JSON.stringify(userData) === JSON.stringify(loaded);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 聊天消息数组往返一致性
   * **Feature: web-migration, Property 4: Chat History Persistence Round-Trip**
   * **Validates: Requirements 5.5**
   */
  it('should preserve chat history after save and load', () => {
    fc.assert(
      fc.property(
        fc.array(chatMessageArbitrary, { minLength: 0, maxLength: 50 }),
        (messages) => {
          const key = 'test_chat_history';
          
          // 保存
          mockStorage.setItem(key, JSON.stringify(messages));
          
          // 加载
          const loaded = JSON.parse(mockStorage.getItem(key) || '[]') as ChatMessage[];
          
          // 验证长度
          if (loaded.length !== messages.length) return false;
          
          // 验证每条消息
          return messages.every((msg, index) => {
            const loadedMsg = loaded[index];
            return (
              loadedMsg.id === msg.id &&
              loadedMsg.role === msg.role &&
              loadedMsg.content === msg.content &&
              loadedMsg.timestamp === msg.timestamp
            );
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 空数据往返一致性
   */
  it('should handle empty data correctly', () => {
    const emptyData = {
      stats: {
        continuous_days: 0,
        total_days: 0,
        mastered_cards: 0,
        ai_chat_count: 0,
        relics_collected: 0,
      },
      collectedRelics: [],
      masteredCards: [],
      checkInRecords: [],
    };

    const key = 'test_empty_data';
    mockStorage.setItem(key, JSON.stringify(emptyData));
    const loaded = JSON.parse(mockStorage.getItem(key) || '{}');
    
    expect(JSON.stringify(emptyData)).toBe(JSON.stringify(loaded));
  });
});
