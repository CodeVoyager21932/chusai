// 红色足迹 - 基于LBS的地图探索
Page({
  data: {
    longitude: 116.397428,
    latitude: 39.90923,
    scale: 13,
    markers: [],
    locations: []
  },

  onLoad() {
    this.getUserLocation()
    this.loadRedLocations()
  },

  // 获取用户位置
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        this.loadNearbyLocations(res.longitude, res.latitude)
      },
      fail: () => {
        wx.showToast({
          title: '请授权位置信息',
          icon: 'none'
        })
      }
    })
  },

  // 加载红色地标
  loadRedLocations() {
    // 模拟数据，实际应从云数据库获取
    const mockLocations = [
      { id: 1, name: '天安门广场', longitude: 116.397428, latitude: 39.90923, distance: 0.5 },
      { id: 2, name: '中国人民革命军事博物馆', longitude: 116.316, latitude: 39.906, distance: 1.2 },
      { id: 3, name: '中国国家博物馆', longitude: 116.407, latitude: 39.904, distance: 0.8 }
    ]

    const markers = mockLocations.map(loc => ({
      id: loc.id,
      longitude: loc.longitude,
      latitude: loc.latitude,
      iconPath: '/images/marker-red.png',
      width: 40,
      height: 40,
      title: loc.name
    }))

    this.setData({
      locations: mockLocations,
      markers: markers
    })
  },

  // 加载附近地标
  loadNearbyLocations(lng, lat) {
    // 根据用户位置加载附近的红色地标
    console.log('Loading nearby locations:', lng, lat)
  },

  // 点击地图标记
  onMarkerTap(e) {
    const markerId = e.detail.markerId
    const location = this.data.locations.find(loc => loc.id === markerId)
    
    if (location) {
      wx.showModal({
        title: location.name,
        content: `距离您 ${location.distance}km`,
        confirmText: '导航',
        success: (res) => {
          if (res.confirm) {
            this.navigateToLocation({ currentTarget: { dataset: { location } } })
          }
        }
      })
    }
  },

  // 导航到地标
  navigateToLocation(e) {
    const location = e.currentTarget.dataset.location
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      scale: 15
    })
  }
})
