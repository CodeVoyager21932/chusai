// 英雄详情页面
import DataManager from '../../services/data-manager.js';

Page({
  data: {
    hero: {},
    loading: true,
    // 分享相关
    showShareMenu: false,
    showPosterPreview: false,
    generatingPoster: false,
    posterPath: '',
    // 内容掌握相关
    isMastered: false
  },

  // 掌握计时器
  masteryTimer: null,

  async onLoad(options) {
    const heroId = options.heroId;
    this.heroId = heroId; // 保存heroId供后续使用
    await this.loadHeroDetail(heroId);
    this.initAmbientSound();
    
    // 启动"内容掌握"计时器：停留3秒视为掌握
    this.masteryTimer = setTimeout(() => {
      this.markAsMastered();
    }, 3000);
  },

  onUnload() {
    // 清除掌握计时器
    if (this.masteryTimer) {
      clearTimeout(this.masteryTimer);
      this.masteryTimer = null;
    }
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.destroy();
    }
  },

  // 标记为已掌握
  markAsMastered() {
    if (this.data.isMastered) return;
    
    // 获取已阅读历史，避免重复计数
    let readHistory = wx.getStorageSync('read_history_ids') || [];
    const currentId = this.heroId;
    
    if (!readHistory.includes(currentId)) {
      // 新内容！增加掌握计数
      let count = wx.getStorageSync('mastered_cards_count') || 0;
      wx.setStorageSync('mastered_cards_count', count + 1);
      
      // 保存ID到历史记录
      readHistory.push(currentId);
      wx.setStorageSync('read_history_ids', readHistory);
      
      // 用户反馈
      wx.showToast({ 
        title: '知识点 +1', 
        icon: 'success',
        duration: 1500
      });
    }
    
    this.setData({ isMastered: true });
  },

  // 初始化环境音效
  initAmbientSound() {
    this.bgm = wx.createInnerAudioContext();
    // 示例：使用一个极低音量的白噪音或历史氛围音效
    // 实际项目中请替换为合法的音频链接
    this.bgm.src = 'https://down.ear0.com:3321/preview?soundid=38668&type=mp3';
    this.bgm.loop = true;
    this.bgm.volume = 0.1; // 极低音量，不打扰
    this.bgm.play();
  },

  // 加载英雄详情
  async loadHeroDetail(heroId) {
    try {
      const hero = await DataManager.getHeroById(heroId);
      
      if (hero) {
        // Process biography for Drop Cap
        if (hero.biography) {
          hero.biography_first_char = hero.biography.charAt(0);
          hero.biography_rest = hero.biography.slice(1);
        }

        this.setData({
          hero,
          loading: false
        });

        // 触感反馈：内容加载完成
        wx.vibrateShort({ type: 'light' });
      } else {
        wx.showToast({
          title: '英雄信息不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (error) {
      console.error('[hero-detail] 加载英雄详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  // 与英雄对话
  onChatWithHero() {
    wx.vibrateShort({ type: 'medium' }); // 触感反馈
    const hero = this.data.hero;
    wx.navigateTo({
      url: `/pages/ai-chat/index?mode=hero&heroId=${hero.id}`
    });
  },

  // 分享英雄 - 显示分享菜单
  onShare() {
    wx.vibrateShort({ type: 'light' });
    this.setData({ showShareMenu: true });
  },

  // 关闭分享菜单
  closeShareMenu() {
    this.setData({ showShareMenu: false });
  },

  // 分享给好友
  shareToFriend() {
    this.setData({ showShareMenu: false });
    // 触发微信分享
  },

  // 生成分享海报
  async generatePoster() {
    wx.vibrateShort({ type: 'medium' });
    this.setData({ showShareMenu: false, generatingPoster: true });
    
    try {
      const hero = this.data.hero;
      const ctx = wx.createCanvasContext('posterCanvas', this);
      
      // 绘制背景
      ctx.setFillStyle('#FDF5F5');
      ctx.fillRect(0, 0, 375, 600);
      
      // 绘制顶部装饰
      ctx.setFillStyle('#DC2626');
      ctx.fillRect(0, 0, 375, 200);
      
      // 绘制英雄名字
      ctx.setFillStyle('#FFFFFF');
      ctx.setFontSize(36);
      ctx.setTextAlign('center');
      ctx.fillText(hero.name, 187, 100);
      
      // 绘制标题
      ctx.setFontSize(18);
      ctx.fillText(hero.title, 187, 140);
      
      // 绘制生卒年
      ctx.setFontSize(14);
      ctx.fillText(`${hero.birth_year} - ${hero.death_year || '至今'}`, 187, 170);
      
      // 绘制简介
      ctx.setFillStyle('#374151');
      ctx.setFontSize(14);
      ctx.setTextAlign('left');
      const biography = hero.biography ? hero.biography.substring(0, 100) + '...' : '';
      this.drawWrappedText(ctx, biography, 30, 240, 315, 22);
      
      // 绘制底部
      ctx.setFillStyle('#9CA3AF');
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.fillText('长按识别小程序码，了解更多英雄故事', 187, 550);
      ctx.fillText('星火燎原 · 红色教育', 187, 575);
      
      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: 'posterCanvas',
            success: (res) => {
              this.setData({ 
                generatingPoster: false,
                showPosterPreview: true,
                posterPath: res.tempFilePath
              });
            },
            fail: () => {
              wx.showToast({ title: '生成失败', icon: 'none' });
              this.setData({ generatingPoster: false });
            }
          }, this);
        }, 300);
      });
    } catch (error) {
      console.error('生成海报失败:', error);
      wx.showToast({ title: '生成失败', icon: 'none' });
      this.setData({ generatingPoster: false });
    }
  },

  // 绘制换行文本
  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;
    
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics && metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  },

  // 保存海报到相册
  savePoster() {
    wx.vibrateShort({ type: 'medium' });
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterPath,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
        this.setData({ showPosterPreview: false });
      },
      fail: (err) => {
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            confirmText: '去授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
      }
    });
  },

  // 关闭海报预览
  closePosterPreview() {
    this.setData({ showPosterPreview: false });
  },

  // 复制分享链接
  copyShareLink() {
    wx.vibrateShort({ type: 'light' });
    const hero = this.data.hero;
    const shareText = `【${hero.name}】${hero.title}\n${hero.biography ? hero.biography.substring(0, 50) + '...' : ''}\n\n打开「星火燎原」小程序了解更多英雄故事`;
    
    wx.setClipboardData({
      data: shareText,
      success: () => {
        this.setData({ showShareMenu: false });
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 分享配置
  onShareAppMessage() {
    const hero = this.data.hero;
    return {
      title: `${hero.name} - ${hero.title}`,
      path: `/pages/hero-detail/hero-detail?heroId=${hero.id}`,
      imageUrl: hero.avatar || ''
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const hero = this.data.hero;
    return {
      title: `${hero.name} - ${hero.title}`,
      query: `heroId=${hero.id}`,
      imageUrl: hero.avatar || ''
    };
  }
});