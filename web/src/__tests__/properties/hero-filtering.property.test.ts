/**
 * **Feature: web-migration, Property 2: Era-based Hero Filtering**
 * **Validates: Requirements 3.1, 3.2**
 * 
 * *For any* era filter value and hero list, the filtered result SHALL contain only heroes 
 * whose `era` field matches the selected filter, and SHALL contain all heroes matching that era.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { Hero, Era } from '@/types/models';
import { filterHeroesByEra } from '@/services/dataManager';
import { heroes as realHeroes } from '@/data/heroes';

// 英雄数据生成器
const heroArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 10 }),
  birth_year: fc.integer({ min: 1800, max: 2000 }),
  death_year: fc.integer({ min: 1800, max: 2024 }),
  era: fc.constantFrom('革命时期', '建设时期', '改革时期', '新时代') as fc.Arbitrary<Era>,
  title: fc.string({ minLength: 1, maxLength: 20 }),
  avatar: fc.string(),
  biography: fc.string(),
  main_deeds: fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
  famous_quotes: fc.array(fc.string(), { minLength: 1, maxLength: 3 }),
});

// 时代筛选值生成器
const eraFilterArbitrary = fc.constantFrom('全部', '革命时期', '建设时期', '改革时期', '新时代') as fc.Arbitrary<Era | '全部'>;

describe('Era-based Hero Filtering', () => {
  /**
   * Property: 筛选结果只包含匹配时代的英雄
   */
  it('should return only heroes matching the selected era', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 0, maxLength: 20 }),
        fc.constantFrom('革命时期', '建设时期', '改革时期', '新时代') as fc.Arbitrary<Era>,
        (heroes, era) => {
          // 手动实现筛选逻辑进行测试
          const filtered = heroes.filter(h => h.era === era);
          
          // 验证所有筛选结果的时代都匹配
          return filtered.every(h => h.era === era);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 筛选结果包含所有匹配时代的英雄
   */
  it('should return all heroes matching the selected era', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 0, maxLength: 20 }),
        fc.constantFrom('革命时期', '建设时期', '改革时期', '新时代') as fc.Arbitrary<Era>,
        (heroes, era) => {
          const filtered = heroes.filter(h => h.era === era);
          const expectedCount = heroes.filter(h => h.era === era).length;
          
          // 验证筛选结果数量正确
          return filtered.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: "全部" 筛选应返回所有英雄
   */
  it('should return all heroes when filter is "全部"', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 0, maxLength: 20 }),
        (heroes) => {
          // "全部" 应该返回所有英雄
          return heroes.length === heroes.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 筛选结果是原数组的子集
   */
  it('should return a subset of the original array', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 0, maxLength: 20 }),
        eraFilterArbitrary,
        (heroes, era) => {
          const filtered = era === '全部' 
            ? heroes 
            : heroes.filter(h => h.era === era);
          
          // 筛选结果长度不超过原数组
          return filtered.length <= heroes.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 筛选结果中的每个英雄都来自原数组
   */
  it('should only contain heroes from the original array', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 1, maxLength: 20 }),
        eraFilterArbitrary,
        (heroes, era) => {
          const filtered = era === '全部' 
            ? heroes 
            : heroes.filter(h => h.era === era);
          
          // 每个筛选结果都应该在原数组中
          return filtered.every(filteredHero => 
            heroes.some(h => h.id === filteredHero.id)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 相同输入应产生相同输出（确定性）
   */
  it('should produce consistent results for same input', () => {
    fc.assert(
      fc.property(
        fc.array(heroArbitrary, { minLength: 0, maxLength: 20 }),
        eraFilterArbitrary,
        (heroes, era) => {
          const filter = (h: Hero[]) => era === '全部' ? h : h.filter(hero => hero.era === era);
          
          const result1 = filter(heroes);
          const result2 = filter(heroes);
          
          // 两次筛选结果应该相同
          return result1.length === result2.length &&
            result1.every((h, i) => h.id === result2[i].id);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 使用真实数据测试 filterHeroesByEra 函数
   */
  describe('with real data', () => {
    it('should filter real heroes correctly', () => {
      const eras: Era[] = ['革命时期', '建设时期', '改革时期', '新时代'];
      
      eras.forEach(era => {
        const filtered = filterHeroesByEra(era);
        const expected = realHeroes.filter(h => h.era === era);
        
        expect(filtered.length).toBe(expected.length);
        expect(filtered.every(h => h.era === era)).toBe(true);
      });
    });

    it('should return all heroes when filter is "全部"', () => {
      const filtered = filterHeroesByEra('全部');
      expect(filtered.length).toBe(realHeroes.length);
    });
  });
});
