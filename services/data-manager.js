/**
 * 数据管理器 - 统一数据获取层
 * 
 * 职责：
 * 1. 从云数据库获取数据
 * 2. 实现本地缓存机制（降低云调用次数）
 * 3. 网络失败时降级到旧缓存
 * 4. 单例模式，全局唯一实例
 * 
 * @class DataManager
 */

// 导入类型定义
/// <reference path="../types/models.js" />

/**
 * @typedef {import('../types/models.js').Hero} Hero
 * @typedef {import('../types/models.js').Relic} Relic
 * @typedef {import('../types/models.js').TimelineEvent} TimelineEvent
 * @typedef {import('../types/models.js').Flashcard} Flashcard
 * @typedef {import('../types/models.js').DailyQuote} DailyQuote
 * @typedef {import('../types/models.js').RadioProgram} RadioProgram
 * @typedef {import('../types/models.js').CacheData} CacheData
 */

class DataManager {
  constructor() {
    if (DataManager.instance) {
      return DataManager.instance;
    }
    
    this.db = null;
    this._initDatabase();
    
    DataManager.instance = this;
  }

  /**
   * 初始化云数据库连接
   * @private
   */
  _initDatabase() {
    try {
      if (!wx.cloud) {
        console.error('[DataManager] 云开发未初始化');
        return;
      }
      this.db = wx.cloud.database();
    } catch (error) {
      console.error('[DataManager] 数据库初始化失败:', error);
    }
  }

  /**
   * 通用数据获取方法（带缓存）
   * 
   * 策略：
   * 1. 优先读取本地缓存（未过期）
   * 2. 缓存过期或不存在时，请求云端数据
   * 3. 云端请求失败时，降级使用旧缓存（即使已过期）
   * 4. 如果云端和缓存都失败，尝试加载本地 JSON 文件（开发阶段）
   * 
   * @private
   * @param {string} collectionName - 云数据库集合名称
   * @param {string} cacheKey - 本地缓存键名
   * @param {number} ttl - 缓存有效期（毫秒），默认 24 小时
   * @returns {Promise<Array>} 数据数组
   */
  async _fetchWithCache(collectionName, cacheKey, ttl = 24 * 60 * 60 * 1000) {
    const now = Date.now();

    try {
      // Step 1: 检查本地缓存
      const cachedData = wx.getStorageSync(cacheKey);
      
      if (cachedData && cachedData.timestamp) {
        const age = now - cachedData.timestamp;
        
        // 缓存未过期，直接返回
        if (age < ttl) {
          console.log(`[DataManager] 使用缓存数据: ${cacheKey}, 剩余有效期: ${Math.floor((ttl - age) / 1000 / 60)}分钟`);
          return cachedData.data || [];
        }
        
        console.log(`[DataManager] 缓存已过期: ${cacheKey}, 尝试更新...`);
      }

      // Step 2: 缓存不存在或已过期，请求云端数据
      if (!this.db) {
        console.warn('[DataManager] 云数据库未初始化，尝试加载本地数据');
        return await this._loadLocalData(collectionName);
      }

      const res = await this.db.collection(collectionName).get();
      const freshData = res.data || [];

      console.log(`[DataManager] 云端获取成功: ${collectionName}, 数据量: ${freshData.length}`);

      // Step 3: 更新缓存
      const cachePayload = {
        data: freshData,
        timestamp: now
      };

      wx.setStorageSync(cacheKey, cachePayload);

      return freshData;

    } catch (error) {
      console.error(`[DataManager] 云端获取失败: ${collectionName}`, error);

      // Step 4: 降级策略 - 使用旧缓存（即使已过期）
      try {
        const oldCache = wx.getStorageSync(cacheKey);
        
        if (oldCache && oldCache.data && oldCache.data.length > 0) {
          const cacheAge = now - (oldCache.timestamp || 0);
          console.warn(`[DataManager] ⚠️ 降级使用旧缓存: ${cacheKey}, 缓存年龄: ${Math.floor(cacheAge / 1000 / 60)}分钟`);
          return oldCache.data;
        }
      } catch (storageError) {
        console.error(`[DataManager] 读取旧缓存失败: ${cacheKey}`, storageError);
      }

      // Step 5: 尝试加载本地数据（开发阶段降级）
      console.warn(`[DataManager] ⚠️ 尝试加载本地数据: ${collectionName}`);
      return await this._loadLocalData(collectionName);
    }
  }

  /**
   * 加载本地 JSON 数据（开发阶段降级方案）
   * @private
   * @param {string} collectionName - 集合名称
   * @returns {Promise<Array>} 数据数组
   */
  async _loadLocalData(collectionName) {
    try {
      let data = [];
      
      // 根据集合名称加载对应的本地数据
      switch (collectionName) {
        case 'heroes':
          data = require('../data/heroes.js');
          break;
        case 'relics':
          const relicsModule = require('../data/relics.js');
          data = relicsModule.relics || relicsModule;
          break;
        case 'daily_quotes':
          data = require('../data/daily-quotes.js');
          break;
        default:
          console.warn(`[DataManager] 未找到本地数据: ${collectionName}`);
          return [];
      }
      
      console.log(`[DataManager] 📦 使用本地数据: ${collectionName}, 数据量: ${Array.isArray(data) ? data.length : 0}`);
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error(`[DataManager] 加载本地数据失败: ${collectionName}`, error);
      return [];
    }
  }

  /**
   * 获取英雄数据
   * @returns {Promise<Hero[]>} 英雄列表
   */
  async getHeroes() {
    return this._fetchWithCache('heroes', 'CACHE_HEROES');
  }

  /**
   * 获取红色文物数据
   * @returns {Promise<Relic[]>} 文物列表
   */
  async getRelics() {
    return this._fetchWithCache('relics', 'CACHE_RELICS');
  }

  /**
   * 获取历史时间轴数据
   * @returns {Promise<TimelineEvent[]>} 时间轴事件列表
   */
  async getTimeline() {
    return this._fetchWithCache('timeline', 'CACHE_TIMELINE');
  }

  /**
   * 获取学习卡片数据
   * @returns {Promise<Flashcard[]>} 卡片列表
   */
  async getFlashcards() {
    return this._fetchWithCache('flashcards', 'CACHE_FLASHCARDS');
  }

  /**
   * 获取每日金句数据
   * @returns {Promise<DailyQuote[]>} 金句列表
   */
  async getDailyQuotes() {
    return this._fetchWithCache('daily_quotes', 'CACHE_DAILY_QUOTES', 12 * 60 * 60 * 1000); // 12小时缓存
  }

  /**
   * 获取电台节目列表
   * @returns {Promise<RadioProgram[]>} 电台节目列表
   */
  async getRadioPlaylist() {
    return this._fetchWithCache('radio_playlist', 'CACHE_RADIO_PLAYLIST');
  }

  /**
   * 获取知识图谱数据
   * @returns {Promise<Object>} 知识图谱数据 {nodes, edges}
   */
  async getGraphData() {
    const data = await this._fetchWithCache('knowledge_graph', 'CACHE_GRAPH');
    // 将平铺的数据重组为 {nodes, edges} 结构
    const nodes = data.filter(item => item.type === 'event' || item.type === 'person');
    const edges = data.filter(item => item.source && item.target);
    return { nodes, edges };
  }

  /**
   * 获取学习卡片（用于星火燎原）
   * @returns {Promise<Array>} 卡片列表
   */
  async getCards() {
    return this.getFlashcards();
  }

  /**
   * 获取红色珍藏数据（合并博物馆+文物）
   * @returns {Promise<Array>} 珍藏列表
   */
  async getHeritageItems() {
    try {
      const relics = await this.getRelics();
      const heroes = await this.getHeroes();
      
      // 合并文物和英雄作为珍藏品
      const heritageItems = [
        ...relics.map(relic => ({
          id: relic.id,
          name: relic.name,
          image: relic.image_url || '/images/default-relic.png',
          type: 'relic',
          collected: relic.collected || false
        })),
        ...heroes.slice(0, 10).map(hero => ({
          id: hero.id,
          name: hero.name,
          image: hero.avatar || '/images/default-avatar.png',
          type: 'hero',
          collected: hero.collected || false
        }))
      ];
      
      return heritageItems;
    } catch (error) {
      console.error('[DataManager] 获取珍藏数据失败:', error);
      return [];
    }
  }

  /**
   * 获取红色地标数据（用于红色足迹）
   * @returns {Promise<Array>} 地标列表
   */
  async getRedLocations() {
    return this._fetchWithCache('red_locations', 'CACHE_RED_LOCATIONS');
  }

  /**
   * 根据 ID 获取单个英雄详情
   * @param {string} heroId - 英雄 ID
   * @returns {Promise<Hero|null>} 英雄详情对象
   */
  async getHeroById(heroId) {
    try {
      const heroes = await this.getHeroes();
      return heroes.find(hero => hero.id === heroId) || null;
    } catch (error) {
      console.error(`[DataManager] 获取英雄详情失败: ${heroId}`, error);
      return null;
    }
  }

  /**
   * 根据 ID 获取单个文物详情
   * @param {string} relicId - 文物 ID
   * @returns {Promise<Relic|null>} 文物详情对象
   */
  async getRelicById(relicId) {
    try {
      const relics = await this.getRelics();
      return relics.find(relic => relic.id === relicId) || null;
    } catch (error) {
      console.error(`[DataManager] 获取文物详情失败: ${relicId}`, error);
      return null;
    }
  }

  /**
   * 清除指定缓存
   * @param {string} cacheKey - 缓存键名
   */
  clearCache(cacheKey) {
    try {
      wx.removeStorageSync(cacheKey);
      console.log(`[DataManager] 缓存已清除: ${cacheKey}`);
    } catch (error) {
      console.error(`[DataManager] 清除缓存失败: ${cacheKey}`, error);
    }
  }

  /**
   * 清除所有数据缓存
   */
  clearAllCache() {
    const cacheKeys = [
      'CACHE_HEROES',
      'CACHE_RELICS',
      'CACHE_TIMELINE',
      'CACHE_FLASHCARDS',
      'CACHE_DAILY_QUOTES',
      'CACHE_RADIO_PLAYLIST',
      'CACHE_GRAPH'
    ];

    cacheKeys.forEach(key => this.clearCache(key));
    console.log('[DataManager] 所有缓存已清除');
  }

  /**
   * 强制刷新指定数据（跳过缓存）
   * @param {string} collectionName - 集合名称
   * @param {string} cacheKey - 缓存键名
   * @returns {Promise<Array>} 最新数据
   */
  async forceRefresh(collectionName, cacheKey) {
    this.clearCache(cacheKey);
    return this._fetchWithCache(collectionName, cacheKey, 0);
  }
}

// 导出单例实例
export default new DataManager();
