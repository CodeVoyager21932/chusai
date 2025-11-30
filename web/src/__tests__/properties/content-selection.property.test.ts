/**
 * **Feature: web-migration, Property 1: Date-based Content Selection Consistency**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.8**
 * 
 * *For any* given date, the content selection functions (greeting, today's hero, daily task, daily quote) 
 * SHALL return deterministic results based on the day of year calculation.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getGreeting, getDayOfYear, getTodayHero, getDailyQuote } from '@/lib/utils';
import { Hero, DailyQuote } from '@/types/models';

// 测试用的英雄数据生成器
const heroArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 10 }),
  birth_year: fc.integer({ min: 1800, max: 2000 }),
  death_year: fc.integer({ min: 1800, max: 2024 }),
  era: fc.constantFrom('革命时期', '建设时期', '改革时期', '新时代') as fc.Arbitrary<'革命时期' | '建设时期' | '改革时期' | '新时代'>,
  title: fc.string({ minLength: 1, maxLength: 20 }),
  avatar: fc.string(),
  biography: fc.string(),
  main_deeds: fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
  famous_quotes: fc.array(fc.string(), { minLength: 1, maxLength: 3 }),
});

// 测试用的名言数据生成器
const quoteArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  quote_content: fc.string({ minLength: 1, maxLength: 100 }),
  author: fc.string({ minLength: 1, maxLength: 20 }),
  date: fc.option(fc.string()),
  image_url: fc.option(fc.string()),
  lucky_tips: fc.option(fc.string()),
});

describe('Date-based Content Selection Consistency', () => {
  /**
   * Property: 相同小时应返回相同的问候语
   */
  it('should return consistent greeting for same hour', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const greeting1 = getGreeting(hour);
        const greeting2 = getGreeting(hour);
        return greeting1 === greeting2;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 问候语应该是预定义的四种之一
   */
  it('should return one of the predefined greetings', () => {
    const validGreetings = ['早上好', '中午好', '下午好', '晚上好'];
    
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const greeting = getGreeting(hour);
        return validGreetings.includes(greeting);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 问候语应该根据时间段正确分类
   */
  it('should return correct greeting based on time period', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const greeting = getGreeting(hour);
        
        if (hour >= 5 && hour < 12) {
          return greeting === '早上好';
        } else if (hour >= 12 && hour < 14) {
          return greeting === '中午好';
        } else if (hour >= 14 && hour < 18) {
          return greeting === '下午好';
        } else {
          return greeting === '晚上好';
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 相同的日期应返回相同的今日英雄
   */
  it('should return consistent hero for same day of year', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 366 }),
        fc.array(heroArbitrary, { minLength: 1, maxLength: 10 }),
        (dayOfYear, heroes) => {
          const hero1 = getTodayHero(dayOfYear, heroes as Hero[]);
          const hero2 = getTodayHero(dayOfYear, heroes as Hero[]);
          return hero1.id === hero2.id;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 返回的英雄应该来自输入数组
   */
  it('should return a hero from the input array', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 366 }),
        fc.array(heroArbitrary, { minLength: 1, maxLength: 10 }),
        (dayOfYear, heroes) => {
          const selectedHero = getTodayHero(dayOfYear, heroes as Hero[]);
          return heroes.some(h => h.id === selectedHero.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 相同的日期应返回相同的每日名言
   */
  it('should return consistent quote for same day of year', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 366 }),
        fc.array(quoteArbitrary, { minLength: 1, maxLength: 10 }),
        (dayOfYear, quotes) => {
          const quote1 = getDailyQuote(dayOfYear, quotes as DailyQuote[]);
          const quote2 = getDailyQuote(dayOfYear, quotes as DailyQuote[]);
          return quote1.id === quote2.id;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: getDayOfYear 应该返回 1-366 之间的值
   */
  it('should return day of year between 1 and 366', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
        (date) => {
          const dayOfYear = getDayOfYear(date);
          return dayOfYear >= 1 && dayOfYear <= 366;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 相同日期的 getDayOfYear 应该返回相同值
   */
  it('should return consistent day of year for same date', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
        (date) => {
          const day1 = getDayOfYear(date);
          const day2 = getDayOfYear(new Date(date));
          return day1 === day2;
        }
      ),
      { numRuns: 100 }
    );
  });
});
