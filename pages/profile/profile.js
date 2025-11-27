// 个人中心页面
const app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '星火学习者',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      studentId: ''
    },
    stats: {
      continuous_days: 0,
      total_days: 0,
      mastered_cards: 0,
      ai_chat_count: 0
    },
    achievements: [],
    unlockedCount: 0,
    totalCount: 0,
    calendarDays: []
  },

  onLoad() {
    this.loadUserInfo();
    this.loadUserStats();
    this.loadAchievements();
    this.loadCalendar();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadUserStats();
    this.loadAchievements();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 加载用户统计数据
  loadUserStats() {
    const stats = wx.getStorageSync('userStats') || {
      continuous_days: 0,
      total_days: 0,
      mastered_cards: 0,
      ai_chat_count: 0
    };

    // 从卡片学习记录中统计已掌握卡片数
    const learningRecords = wx.getStorageSync('learningRecords') || {};
    const masteredCount = Object.values(learningRecords).filter(
      record => record.status === 'mastered'
    ).length;
    stats.mastered_cards = masteredCount;

    // 从存储中读取已掌握卡片数（备用key）
    const storedMasteredCards = wx.getStorageSync('mastered_cards_count') || 0;
    if (storedMasteredCards > stats.mastered_cards) {
      stats.mastered_cards = storedMasteredCards;
    }

    // 从存储中读取AI互动次数
    const aiInteractionCount = wx.getStorageSync('ai_interaction_count') || 0;
    stats.ai_chat_count = aiInteractionCount;

    // 从打卡记录中统计天数
    const checkInRecords = wx.getStorageSync('checkInRecords') || [];
    stats.total_days = checkInRecords.length;
    stats.continuous_days = this.calculateContinuousDays(checkInRecords);

    // 同步读取 user_streak_days（如果存在）
    const streakDays = wx.getStorageSync('user_streak_days') || 0;
    if (streakDays > stats.continuous_days) {
      stats.continuous_days = streakDays;
    }

    this.setData({ stats });
    wx.setStorageSync('userStats', stats);
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

  // 加载成就系统
  loadAchievements() {
    const stats = this.data.stats;
    const checkInRecords = wx.getStorageSync('checkInRecords') || [];
    
    const achievements = [
      {
        id: 'first_login',
        name: '初识星火',
        icon: '🌟',
        description: '首次登录小程序',
        unlocked: true,
        progress: 1,
        target: 1
      },
      {
        id: 'checkin_3',
        name: '三日之约',
        icon: '📅',
        description: '连续打卡3天',
        unlocked: stats.continuous_days >= 3,
        progress: Math.min(stats.continuous_days, 3),
        target: 3
      },
      {
        id: 'checkin_7',
        name: '好学之星',
        icon: '⭐',
        description: '连续打卡7天',
        unlocked: stats.continuous_days >= 7,
        progress: Math.min(stats.continuous_days, 7),
        target: 7
      },
      {
        id: 'checkin_30',
        name: '坚持不懈',
        icon: '💪',
        description: '连续打卡30天',
        unlocked: stats.continuous_days >= 30,
        progress: Math.min(stats.continuous_days, 30),
        target: 30
      },
      {
        id: 'cards_10',
        name: '初窥门径',
        icon: '🎴',
        description: '掌握10张卡片',
        unlocked: stats.mastered_cards >= 10,
        progress: Math.min(stats.mastered_cards, 10),
        target: 10
      },
      {
        id: 'cards_50',
        name: '党史达人',
        icon: '📚',
        description: '掌握50张卡片',
        unlocked: stats.mastered_cards >= 50,
        progress: Math.min(stats.mastered_cards, 50),
        target: 50
      },
      {
        id: 'ai_chat_10',
        name: '好奇宝宝',
        icon: '💬',
        description: 'AI问答10次',
        unlocked: stats.ai_chat_count >= 10,
        progress: Math.min(stats.ai_chat_count, 10),
        target: 10
      },
      {
        id: 'ai_chat_100',
        name: '博学多才',
        icon: '🎓',
        description: 'AI问答100次',
        unlocked: stats.ai_chat_count >= 100,
        progress: Math.min(stats.ai_chat_count, 100),
        target: 100
      }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    this.setData({
      achievements,
      unlockedCount,
      totalCount: achievements.length
    });

    // 检查是否有新解锁的成就
    this.checkNewAchievements(achievements);
  },

  // 检查新解锁的成就
  checkNewAchievements(achievements) {
    const lastUnlocked = wx.getStorageSync('lastUnlockedAchievements') || [];
    const currentUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    
    // 确保是数组
    const lastUnlockedArray = Array.isArray(lastUnlocked) ? lastUnlocked : [];
    const newUnlocked = currentUnlocked.filter(id => !lastUnlockedArray.includes(id));
    
    if (newUnlocked.length > 0) {
      const newAchievement = achievements.find(a => a.id === newUnlocked[0]);
      this.showAchievementUnlock(newAchievement);
      wx.setStorageSync('lastUnlockedAchievements', currentUnlocked);
    }
  },

  // 显示成就解锁动画
  showAchievementUnlock(achievement) {
    wx.showModal({
      title: '🎉 成就解锁',
      content: `恭喜你获得成就：${achievement.icon} ${achievement.name}\n${achievement.description}`,
      showCancel: false,
      confirmText: '太棒了'
    });
  },

  // 加载打卡日历
  loadCalendar() {
    const checkInRecords = wx.getStorageSync('checkInRecords') || [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // 获取当月天数
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 确保是数组
    const recordsArray = Array.isArray(checkInRecords) ? checkInRecords : [];
    
    const calendarDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = this.formatDate(date);
      calendarDays.push({
        day: i,
        date: dateStr,
        checked: recordsArray.includes(dateStr)
      });
    }
    
    this.setData({ calendarDays });
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 点击成就
  onAchievementClick(e) {
    const achievement = e.currentTarget.dataset.achievement;
    const status = achievement.unlocked ? '已解锁' : '未解锁';
    const progress = achievement.unlocked ? '' : `\n进度：${achievement.progress}/${achievement.target}`;
    
    wx.showModal({
      title: `${achievement.icon} ${achievement.name}`,
      content: `${achievement.description}\n状态：${status}${progress}`,
      showCancel: false
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？这不会影响你的学习记录。',
      success: (res) => {
        if (res.confirm) {
          // 只清除临时缓存，保留学习记录
          wx.removeStorageSync('graphData');
          wx.removeStorageSync('heroesData');
          wx.removeStorageSync('cardsData');
          
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于星火',
      content: '星火红色教育智能体小程序\n版本：1.0.0\n\n让红色基因代代相传，让星火燎原！',
      showCancel: false
    });
  }
});
