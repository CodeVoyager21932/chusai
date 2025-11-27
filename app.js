// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-8g19hcjc93e03232', // 你的云开发环境ID
        traceUser: true
      });
      console.log('[App] 云开发初始化完成，环境ID:', 'cloud1-8g19hcjc93e03232');
    }

    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      hasCheckedIn: false,
      userLevel: 1,
      stats: {
        continuous_days: 7,
        mastered_cards: 25,
        ai_chat_count: 50
      },
      // 导航栏信息
      statusBarHeight: 0,
      navBarHeight: 0,
      menuBottom: 0,
      menuRight: 0,
      menuHeight: 0,
      openid: null
    };

    // 获取用户信息
    this.getUserInfo();
    // 初始化系统信息
    this.initSystemInfo();
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  initSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    // 状态栏高度
    const statusBarHeight = systemInfo.statusBarHeight;
    
    // 胶囊按钮信息
    const menuButton = {
      top: menuButtonInfo.top,
      right: menuButtonInfo.right,
      bottom: menuButtonInfo.bottom,
      left: menuButtonInfo.left,
      width: menuButtonInfo.width,
      height: menuButtonInfo.height
    };

    // 胶囊与状态栏的间距
    const menuGap = menuButton.top - statusBarHeight;
    
    // 导航栏总高度 = 状态栏高度 + 胶囊与状态栏间距 + 胶囊高度 + 胶囊与状态栏间距
    const navBarHeight = statusBarHeight + menuGap + menuButton.height + menuGap;
    
    // 自定义胶囊的位置（与原生胶囊对齐）
    const customCapsule = {
      top: menuGap, // 相对于导航栏内容区的top
      height: menuButton.height,
      left: 24, // 左侧边距（rpx转px后约12px）
      right: systemInfo.screenWidth - menuButton.left + 12 // 确保不超过原生胶囊
    };

    this.globalData.statusBarHeight = statusBarHeight;
    this.globalData.navBarHeight = navBarHeight;
    this.globalData.menuButton = menuButton;
    this.globalData.customCapsule = customCapsule;
    this.globalData.menuHeight = menuButton.height;
    this.globalData.menuGap = menuGap;
    this.globalData.screenWidth = systemInfo.screenWidth;
  }
});
