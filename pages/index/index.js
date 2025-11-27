// pages/index/index.js
import DataManager from '../../services/data-manager.js';

const app = getApp();

Page({
  data: {
    // 导航栏适配数据
    statusBarHeight: 0,
    navBarHeight: 44,
    totalHeaderHeight: 88,
    capsuleHeight: 32,
    
    userInfo: {
      nickName: '星火学习者',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    },
    greeting: '早安，传承星火',
    hasCheckedIn: false,
    todayHero: {},
    todayQuote: {},
    todayDate: '',
    userLevel: 1,
    stats: {
      continuous_days: 7,
      mastered_cards: 25,
      ai_chat_count: 50
    },
    heroCardTransform: '',
    heroCardGlare: '',
    isHeroCardTouching: false,
    showDailySign: false,
    showBadgeModal: false,
    currentBadge: null,
    dailyTaskDesc: '与雷锋对话并学习5张卡片',
    hasNewHeritage: false,
    heroList: []
  },

  async onLoad() {
    this.initNavBarHeight(); // 初始化导航栏高度
    this.checkLoginStatus();
    this.setDynamicGreeting();
    await this.loadTodayHero();
    await this.loadTodayQuote();
    await this.loadHeroList();
    this.loadUserStats();
    this.checkTodayCheckIn();
    this.setTodayDate();
    this.calculateLevel();
    this.generateDailyTask();
    this.checkNewHeritage();
  },

  // 初始化导航栏高度（沉浸式适配）
  initNavBarHeight() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const menuButton = wx.getMenuButtonBoundingClientRect();
      
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      // 导航栏高度 = (胶囊顶部距离 - 状态栏高度) * 2 + 胶囊高度
      const navBarHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height;
      const totalHeaderHeight = statusBarHeight + navBarHeight;
      const capsuleHeight = menuButton.height;
      
      this.setData({
        statusBarHeight,
        navBarHeight,
        totalHeaderHeight,
        capsuleHeight
      });
      
      console.log('[NavBar] 适配完成:', { statusBarHeight, navBarHeight, totalHeaderHeight, capsuleHeight });
    } catch (e) {
      console.error('[NavBar] 获取系统信息失败:', e);
      // 使用默认值
      this.setData({
        statusBarHeight: 20,
        navBarHeight: 44,
        totalHeaderHeight: 64,
        capsuleHeight: 32
      });
    }
  },

  onShow() {
    // 每次显示页面时刷新统计数据和问候语
    this.setDynamicGreeting();
    if (app.globalData.userInfo) {
      this.loadUserStats();
    }
  },

  // 设置动态问候语
  setDynamicGreeting() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 9) {
      greeting = '早安，传承星火';
    } else if (hour >= 9 && hour < 12) {
      greeting = '上午好，学习进行时';
    } else if (hour >= 12 && hour < 14) {
      greeting = '午安，稍作休息';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好，继续前进';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好，温故知新';
    } else {
      greeting = '夜深了，重温历史';
    }

    this.setData({ greeting });
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({ userInfo });
    } else {
      // 未登录，跳转到登录页面或显示登录按钮
      this.getUserProfile();
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({ userInfo });
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);

        // 调用云函数创建用户记录
        this.createUserRecord(userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        });
      }
    });
  },

  // 创建用户记录
  createUserRecord(userInfo) {
    wx.cloud.callFunction({
      name: 'create-user',
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      },
      success: (res) => {
        console.log('用户记录创建成功', res);
        app.globalData.openid = res.result.openid;
      },
      fail: (err) => {
        console.error('创建用户记录失败', err);
      }
    });
  },

  // 加载今日英雄
  async loadTodayHero() {
    try {
      const heroesData = await DataManager.getHeroes();
      if (heroesData.length === 0) return;
      
      // 根据日期选择英雄（每天不同）
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const todayHero = heroesData[dayOfYear % heroesData.length];

      // 默认图片未加载
      todayHero.avatarLoaded = false;

      this.setData({ todayHero });
    } catch (error) {
      console.error('[index] 加载今日英雄失败:', error);
    }
  },

  // 加载今日名言
  async loadTodayQuote() {
    try {
      const dailyQuotesData = await DataManager.getDailyQuotes();
      if (dailyQuotesData.length === 0) return;
      
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const todayQuote = dailyQuotesData[dayOfYear % dailyQuotesData.length];
      this.setData({ todayQuote });
    } catch (error) {
      console.error('[index] 加载今日名言失败:', error);
    }
  },

  // 图片加载错误处理
  onImageError(e) {
    console.log('图片加载失败', e);
    // 图片加载失败，显示占位符
    this.setData({
      'todayHero.avatarLoaded': false
    });
  },

  // 加载用户统计数据
  loadUserStats() {
    wx.cloud.callFunction({
      name: 'get-user-stats',
      success: (res) => {
        if (res.result && res.result.stats) {
          this.setData({
            stats: res.result.stats
          });
          this.calculateLevel(); // Recalculate level when stats update
        }
      },
      fail: (err) => {
        console.error('获取用户统计失败', err);
      }
    });
  },

  // 检查今日是否已打卡
  checkTodayCheckIn() {
    const today = this.formatDate(new Date());
    const checkInRecords = wx.getStorageSync('checkInRecords') || [];

    if (Array.isArray(checkInRecords) && checkInRecords.includes(today)) {
      this.setData({ hasCheckedIn: true });
    }
  },

  // 打卡
  onCheckIn() {
    if (this.data.hasCheckedIn) {
      wx.showToast({
        title: '今日已打卡',
        icon: 'none'
      });
      return;
    }

    const today = this.formatDate(new Date());
    let checkInRecords = wx.getStorageSync('checkInRecords') || [];

    // 确保是数组
    if (!Array.isArray(checkInRecords)) {
      checkInRecords = [];
    }

    // 添加今日打卡记录
    if (!checkInRecords.includes(today)) {
      checkInRecords.push(today);
      wx.setStorageSync('checkInRecords', checkInRecords);
    }

    // 计算连续天数
    const continuousDays = this.calculateContinuousDays(checkInRecords);

    this.setData({ hasCheckedIn: true });

    // 显示打卡成功动画
    wx.showToast({
      title: `打卡成功！连续${continuousDays}天`,
      icon: 'success',
      duration: 2000
    });

    // 更新统计数据
    let stats = wx.getStorageSync('userStats') || {};
    stats.continuous_days = continuousDays;
    stats.total_days = checkInRecords.length;
    wx.setStorageSync('userStats', stats);

    this.loadUserStats();
  },

  // 计算连续打卡天数
  calculateContinuousDays(records) {
    if (!records || !Array.isArray(records) || records.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let continuous = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = this.formatDate(currentDate);
      if (records.includes(dateStr)) {
        continuous++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return continuous;
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 设置今日日期
  setTodayDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    this.setData({
      todayDate: `${month}月${day}日 周${weekDay}`
    });
  },

  // 计算用户等级
  calculateLevel() {
    // 简单逻辑：每掌握10张卡片升1级，或者每打卡7天升1级
    const { mastered_cards, continuous_days } = this.data.stats;
    const level = 1 + Math.floor(mastered_cards / 10) + Math.floor(continuous_days / 7);
    this.setData({ userLevel: level });
  },

  // 跳转到英雄详情
  goToHeroDetail() {
    const heroId = this.data.todayHero.id;
    if (heroId) {
      wx.navigateTo({
        url: `/pages/hero-detail/hero-detail?heroId=${heroId}`
      });
    }
  },

  // 跳转到AI对话
  goToAIChat() {
    wx.navigateTo({
      url: '/pages/ai-chat/index'
    });
  },

  // 跳转到知识图谱
  goToGraph() {
    wx.navigateTo({
      url: '/pages/knowledge-graph/index'
    });
  },

  // 跳转到星火燎原（合并后的学练测）
  goToSparkPrairie() {
    wx.navigateTo({
      url: '/pages/spark-prairie/index'
    });
  },

  // 跳转到红色珍藏（合并后的博物馆+抽卡）
  goToRedHeritage() {
    wx.navigateTo({
      url: '/pages/red-heritage/index'
    });
  },

  // 跳转到红色足迹（新增地图探索）
  goToRedFootprints() {
    wx.navigateTo({
      url: '/pages/red-footprints/index'
    });
  },

  // 跳转到英雄长廊
  goToHeroes() {
    wx.navigateTo({
      url: '/pages/hero-gallery/hero-gallery'
    });
  },

  // --- 3D Card Tilt Effect ---
  onReady() {
    this.updateHeroCardRect();
  },

  updateHeroCardRect() {
    const query = wx.createSelectorQuery();
    query.select('.today-hero-card').boundingClientRect(rect => {
      if (rect) {
        this.heroCardRect = rect;
      }
    }).exec();
  },

  onHeroCardTouchStart(e) {
    this.setData({ isHeroCardTouching: true });
  },

  onHeroCardTouchMove(e) {
    if (!this.heroCardRect) return;

    const touch = e.touches[0];
    const rect = this.heroCardRect;

    // Calculate center relative to viewport
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const percentX = (touch.clientX - centerX) / (rect.width / 2);
    const percentY = (touch.clientY - centerY) / (rect.height / 2);

    // Limit tilt range
    const maxTilt = 8; // degrees
    const rotateX = -percentY * maxTilt; // Tilt up/down (inverted Y)
    const rotateY = percentX * maxTilt;  // Tilt left/right

    // Glare effect
    const glareX = 50 + (percentX * 50);
    const glareY = 50 + (percentY * 50);
    const glareOpacity = Math.min(0.6, Math.sqrt(percentX * percentX + percentY * percentY) * 0.5);

    this.setData({
      heroCardTransform: `transform: perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(0.98, 0.98, 0.98);`,
      heroCardGlare: `background: radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%); opacity: ${glareOpacity};`
    });
  },

  onHeroCardTouchEnd(e) {
    this.setData({
      isHeroCardTouching: false,
      heroCardTransform: '', // Reset to default
      heroCardGlare: 'opacity: 0;'
    });
  },

  // 打开日签弹窗
  onOpenDailySign() {
    console.log('点击日签按钮');
    console.log('todayQuote:', this.data.todayQuote);

    if (!this.data.todayQuote || !this.data.todayQuote.quote_content) {
      wx.showToast({
        title: '数据加载中...',
        icon: 'none'
      });
      // 重新加载数据
      this.loadTodayQuote();
      return;
    }

    this.setData({ showDailySign: true });
    console.log('弹窗已打开，showDailySign:', this.data.showDailySign);
  },

  // 关闭日签弹窗
  onCloseDailySign() {
    this.setData({ showDailySign: false });
  },

  // 日签打卡回调
  onDailyCheckIn(e) {
    const { date } = e.detail;
    this.setData({ hasCheckedIn: true });

    // 刷新统计数据
    this.loadUserStats();
    this.calculateLevel();

    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  },

  // 显示徽章详情
  showBadgeDetail() {
    this.setData({
      showBadgeModal: true,
      currentBadge: {
        name: '星火燎原 Lv.1',
        desc: '初入革命征程，点燃理想之火。',
        icon: '🔥',
        date: '2023.11.21'
      }
    });
    wx.vibrateShort({ type: 'medium' });
  },

  onCloseBadgeModal() {
    this.setData({ showBadgeModal: false });
  },

  // 打开全局搜索
  openGlobalSearch() {
    // 触发全局搜索组件
    this.selectComponent('#global-search')?.openSearch();
  },

  // 跳转到个人中心
  goToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 生成每日任务描述
  generateDailyTask() {
    const tasks = [
      `与${this.data.todayHero.name || '英雄'}对话并学习5张卡片`,
      '完成3次知识图谱探索',
      '参与1次PK对战并获胜',
      '解锁1个新的红色珍藏',
      '探访2个红色地标'
    ];
    
    // 根据日期选择任务
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const taskDesc = tasks[dayOfYear % tasks.length];
    
    this.setData({ dailyTaskDesc: taskDesc });
  },

  // 跳转到每日任务
  goToDailyTask() {
    // 根据任务类型跳转到对应页面
    const taskDesc = this.data.dailyTaskDesc;
    
    if (taskDesc.includes('对话') || taskDesc.includes('卡片')) {
      this.goToSparkPrairie();
    } else if (taskDesc.includes('图谱')) {
      this.goToGraph();
    } else if (taskDesc.includes('对战')) {
      this.goToSparkPrairie();
    } else if (taskDesc.includes('珍藏')) {
      this.goToRedHeritage();
    } else if (taskDesc.includes('地标')) {
      this.goToRedFootprints();
    } else {
      this.goToSparkPrairie();
    }
  },

  // 检查是否有新的珍藏
  checkNewHeritage() {
    // 检查本地存储，看是否有未查看的新珍藏
    const newHeritageFlag = wx.getStorageSync('hasNewHeritage');
    this.setData({ hasNewHeritage: newHeritageFlag || false });
  },

  // 加载英雄列表（用于横向滚动）
  async loadHeroList() {
    try {
      const heroesData = await DataManager.getHeroes();
      // 取前10个英雄用于展示
      const heroList = heroesData.slice(0, 10);
      this.setData({ heroList });
    } catch (error) {
      console.error('[index] 加载英雄列表失败:', error);
    }
  },

  // 根据ID跳转到英雄详情
  goToHeroDetailById(e) {
    const heroId = e.currentTarget.dataset.id;
    if (heroId) {
      wx.navigateTo({
        url: `/pages/hero-detail/hero-detail?heroId=${heroId}`
      });
    }
  }
});
