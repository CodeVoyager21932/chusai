// 英雄长廊页面
import DataManager from '../../services/data-manager.js';

Page({
  data: {
    allHeroes: [],
    filteredHeroes: [],
    currentEra: 'all'
  },

  async onLoad(options) {
    await this.loadHeroes();
  },

  // 加载英雄数据
  async loadHeroes() {
    wx.showLoading({ title: '加载中...', mask: true });
    
    try {
      const heroes = await DataManager.getHeroes();
      this.setData({
        allHeroes: heroes,
        filteredHeroes: heroes
      });
    } catch (error) {
      console.error('[hero-gallery] 加载英雄数据失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 筛选切换
  onFilterChange(e) {
    const era = e.currentTarget.dataset.era;
    
    let filtered = [];
    if (era === 'all') {
      filtered = this.data.allHeroes;
    } else {
      filtered = this.data.allHeroes.filter(hero => hero.era === era);
    }

    this.setData({
      currentEra: era,
      filteredHeroes: filtered
    });
  },

  // 点击英雄卡片
  onHeroClick(e) {
    const hero = e.currentTarget.dataset.hero;
    wx.navigateTo({
      url: `/pages/hero-detail/hero-detail?heroId=${hero.id}`
    });
  }
});