Component({
  data: {
    showSearch: false,
    keyword: '',
    results: [],
    hasSearched: false,
    statusBarHeight: 0,
    navBarHeight: 44,
    searchTimer: null,
    searchContainerPaddingRight: 0,
    // 热门搜索标签 - 对应 heroes.js 中的英雄名称
    hotTags: ['雷锋', '焦裕禄', '黄继光', '赵一曼'],
    // 关键词到页面的直接映射 - 使用实际的 heroId 参数
    pageMap: {
      '雷锋': '/pages/hero-detail/hero-detail?heroId=hero_001',
      '焦裕禄': '/pages/hero-detail/hero-detail?heroId=hero_002',
      '冷云': '/pages/hero-detail/hero-detail?heroId=hero_003',
      '赵一曼': '/pages/hero-detail/hero-detail?heroId=hero_004',
      '黄继光': '/pages/hero-detail/hero-detail?heroId=hero_005',
      '邱少云': '/pages/hero-detail/hero-detail?heroId=hero_006'
    },
    // 通用搜索结果页 - 跳转到英雄列表页
    searchResultPage: '/pages/hero-gallery/hero-gallery'
  },

  lifetimes: {
    attached() {
      // 获取系统信息，动态设置状态栏高度
      const systemInfo = wx.getSystemInfoSync()
      const capsule = wx.getMenuButtonBoundingClientRect()
      
      // 计算右边距：屏幕宽度 - 胶囊左边位置 + 额外间距
      const rightMargin = systemInfo.screenWidth - capsule.left + 8
      // 计算导航栏高度
      const navBarHeight = (capsule.top - systemInfo.statusBarHeight) * 2 + capsule.height
      
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20,
        navBarHeight: navBarHeight,
        searchContainerPaddingRight: rightMargin
      })
    }
  },

  methods: {
    openSearch() {
      this.setData({ showSearch: true })
    },

    closeSearch() {
      // 清除防抖定时器
      if (this.data.searchTimer) {
        clearTimeout(this.data.searchTimer)
      }
      this.setData({ 
        showSearch: false,
        keyword: '',
        results: [],
        hasSearched: false,
        searchTimer: null
      })
    },

    stopPropagation() {},

    // 输入事件 - 带防抖优化
    onInput(e) {
      const keyword = e.detail.value
      this.setData({ keyword })
      
      // 清除之前的定时器
      if (this.data.searchTimer) {
        clearTimeout(this.data.searchTimer)
      }
      
      // 设置新的定时器（500ms 延迟）
      const timer = setTimeout(() => {
        this.performSearch()
      }, 500)
      
      this.setData({ searchTimer: timer })
    },

    onSearch() {
      // 清除防抖定时器，立即执行搜索
      if (this.data.searchTimer) {
        clearTimeout(this.data.searchTimer)
      }
      this.performSearch()
    },

    performSearch() {
      const keyword = this.data.keyword
      
      if (!keyword.trim()) {
        this.setData({ 
          results: [],
          hasSearched: false
        })
        return
      }
      
      this.setData({ hasSearched: true })
      
      console.log('Searching for:', keyword)
      
      // 搜索数据 - 对应 heroes.js 实际数据
      const mockDb = [
        { id: 'hero_001', title: '雷锋', tag: '建设时期', type: '人物', icon: '👤' },
        { id: 'hero_002', title: '焦裕禄', tag: '建设时期', type: '人物', icon: '👤' },
        { id: 'hero_003', title: '冷云', tag: '革命时期', type: '人物', icon: '👤' },
        { id: 'hero_004', title: '赵一曼', tag: '革命时期', type: '人物', icon: '👤' },
        { id: 'hero_005', title: '黄继光', tag: '建设时期', type: '人物', icon: '👤' },
        { id: 'hero_006', title: '邱少云', tag: '建设时期', type: '人物', icon: '👤' }
      ]
      
      const results = mockDb.filter(item => item.title.includes(keyword))
      this.setData({ results })
    },

    selectResult(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent('select', item)
      this.closeSearch()
      
      // 根据类型跳转 - 使用 heroId 参数
      if (item.type === '人物') {
        wx.navigateTo({ url: `/pages/hero-detail/hero-detail?heroId=${item.id}` })
      }
    },

    // 热门标签点击
    handleTagClick(e) {
      const tag = e.currentTarget.dataset.keyword
      this.setData({ keyword: tag })
      this.navigateByKeyword(tag)
    },

    // 根据关键词导航
    navigateByKeyword(term) {
      if (!term || !term.trim()) return
      
      const keyword = term.trim()
      console.log(`Searching for: ${keyword}`)
      
      // 策略A：精确匹配 - 直接跳转到详情页
      if (this.data.pageMap[keyword]) {
        wx.navigateTo({
          url: this.data.pageMap[keyword],
          fail: (err) => {
            console.error(`Failed to navigate to ${this.data.pageMap[keyword]}`, err)
            wx.showToast({ title: '页面开发中', icon: 'none' })
          }
        })
        this.closeSearch()
        return
      }
      
      // 策略B：通用搜索 - 跳转到搜索结果列表页
      wx.navigateTo({
        url: `${this.data.searchResultPage}?keyword=${encodeURIComponent(keyword)}`,
        fail: () => {
          wx.showToast({ title: '搜索页面开发中', icon: 'none' })
        }
      })
      this.closeSearch()
    },

    // 返回上一页
    goBack() {
      wx.navigateBack()
    }
  }
})
