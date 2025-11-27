const app = getApp()

Component({
  properties: {
    title: {
      type: String,
      value: '星火'
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: '' // 允许外部覆盖背景，例如透明
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    menuButtonHeight: 0,
    menuButtonTop: 0,
    navBarWidth: 0
  },

  lifetimes: {
    attached() {
      const systemInfo = wx.getSystemInfoSync()
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect()

      // 计算导航栏高度：胶囊底部 + 胶囊顶部距状态栏底部的距离 (保持上下边距一致)
      // 胶囊顶部距屏幕顶部的距离 = menuButtonInfo.top
      // 状态栏高度 = systemInfo.statusBarHeight
      // 胶囊上边距 = menuButtonInfo.top - systemInfo.statusBarHeight
      // 导航栏总高度 = 状态栏高度 + 胶囊高度 + (胶囊上边距 * 2)
      
      const gap = menuButtonInfo.top - systemInfo.statusBarHeight
      const navBarHeight = menuButtonInfo.height + (gap * 2)

      this.setData({
        statusBarHeight: systemInfo.statusBarHeight,
        navBarHeight: navBarHeight,
        menuButtonHeight: menuButtonInfo.height,
        menuButtonTop: gap, // 胶囊相对于状态栏底部的上边距
        navBarWidth: menuButtonInfo.left // 导航栏内容区域宽度（避开胶囊）
      })
    }
  },

  methods: {
    goBack() {
      const pages = getCurrentPages()
      if (pages.length > 1) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        this.goHome()
      }
    },
    goHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})
