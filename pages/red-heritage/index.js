// 红色珍藏 - 博物馆展厅 + 抽卡解密
Page({
  data: {
    heritageItems: [],
    collectedCount: 0,
    totalCount: 0,
    showMysteryBox: false
  },

  onLoad() {
    this.loadHeritageData()
  },

  onShow() {
    this.loadHeritageData()
  },

  // 加载珍藏数据
  loadHeritageData() {
    const dataManager = getApp().globalData.dataManager
    const items = dataManager.getHeritageItems()
    const collected = items.filter(item => item.collected).length
    
    this.setData({
      heritageItems: items,
      collectedCount: collected,
      totalCount: items.length
    })
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.heritageItems.find(i => i.id === id)
    
    if (!item.collected) {
      wx.showToast({
        title: '该藏品尚未解锁',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/hero-detail/hero-detail?id=${id}`
    })
  },

  // 打开抽卡弹窗
  openMysteryBox() {
    this.setData({ showMysteryBox: true })
  },

  // 关闭抽卡弹窗
  closeMysteryBox() {
    this.setData({ showMysteryBox: false })
  },

  stopPropagation() {},

  // 抽卡
  drawCard() {
    wx.showLoading({ title: '解密中...' })
    
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '获得新藏品！',
        icon: 'success'
      })
      this.closeMysteryBox()
      this.loadHeritageData()
    }, 1500)
  }
})
