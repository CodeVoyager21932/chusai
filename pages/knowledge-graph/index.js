// pages/knowledge-graph/index.js
Page({
  data: {
    currentView: 'timeline', // 'timeline' or 'graph'
    timelineData: [
      { id: 1, year: '1921', title: '中共一大', description: '中国共产党成立，开天辟地的大事变。', image: 'https://picsum.photos/200/160?random=1' },
      { id: 2, year: '1927', title: '南昌起义', description: '打响了武装反抗国民党反动派的第一枪。', image: 'https://picsum.photos/200/160?random=2' },
      { id: 3, year: '1934', title: '长征开始', description: '中央红军开始战略转移，进行二万五千里长征。', image: 'https://picsum.photos/200/160?random=3' },
      { id: 4, year: '1935', title: '遵义会议', description: '确立了毛泽东在党和红军中的领导地位。', image: 'https://picsum.photos/200/160?random=4' },
      { id: 5, year: '1945', title: '抗战胜利', description: '中国人民抗日战争取得伟大胜利。', image: 'https://picsum.photos/200/160?random=5' },
      { id: 6, year: '1949', title: '开国大典', description: '中华人民共和国成立，中国人民从此站起来了。', image: 'https://picsum.photos/200/160?random=6' }
    ]
  },

  onLoad(options) {
    // 可以在这里加载真实数据
  },

  switchView(e) {
    const view = e.currentTarget.dataset.view;
    this.setData({ currentView: view });

    if (view === 'graph') {
      // 初始化图谱 (TODO: 迁移 D3 逻辑)
    }
  },

  onEventTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/hero-detail/hero-detail?id=${id}` // 暂时跳转到详情页
    });
  },

  // Canvas 触摸事件占位
  onTouchStart(e) { },
  onTouchMove(e) { },
  onTouchEnd(e) { }
});
