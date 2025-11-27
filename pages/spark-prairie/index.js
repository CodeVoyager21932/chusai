const cardsData = require('../../data/cards.js');
const { getRandomQuestions } = require('../../data/quiz-questions.js');

Page({
  data: {
    mode: 'learn',
    
    // 学习
    cards: [],
    currentIndex: 0,
    flipped: false,
    
    // 滑动相关
    touchStartX: 0,
    touchStartY: 0,
    swipeX: 0,
    swipeY: 0,
    swipeRotate: 0,
    swipeOpacity: 1,
    swipeLeftOpacity: 0,
    swipeRightOpacity: 0,
    showSparks: false,
    
    // 练习
    quizStarted: false,
    quizFinished: false,
    quizIndex: 0,
    currentQ: {},
    selected: null,
    correct: false,
    showAns: false,
    score: 0,
    
    // 对战 - 真人匹配
    battleStarted: false,
    battleFinished: false,
    battleQ: {},
    battleSel: null,
    myScore: 0,
    opponentScore: 0,
    won: false,
    isDraw: false,
    opponentAnswered: false,
    showBattleAns: false,
    battleTimeLeft: 10,
    battleTimer: null,
    
    // 匹配相关
    isMatching: false,
    matchingTime: 0,
    matchingTimer: null,
    matchFound: false,
    matchCountdown: 3,
    onlineCount: 128,
    winRate: 78,
    winStreak: 8,
    
    // 用户和对手信息
    userInfo: {},
    opponent: {}
  },

  onLoad() {
    this.loadCards();
    this.loadUserInfo();
    this.updateOnlineCount();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
  },

  // 模拟在线人数
  updateOnlineCount() {
    const base = 100;
    const random = Math.floor(Math.random() * 50);
    this.setData({ onlineCount: base + random });
  },

  loadCards() {
    const cards = [...cardsData].sort(() => Math.random() - 0.5);
    this.setData({ cards, currentIndex: 0, flipped: false });
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode });
    
    // 添加震动反馈
    wx.vibrateShort({ type: 'light' });
  },

  switchToPractice() {
    this.setData({ mode: 'practice' });
  },

  switchToBattle() {
    this.setData({ mode: 'battle' });
  },

  switchToLearn() {
    this.setData({ mode: 'learn' });
  },

  flipCard(e) {
    // 阻止事件冒泡，避免触发滑动
    if (e) {
      e.stopPropagation();
    }
    this.setData({ flipped: !this.data.flipped });
    wx.vibrateShort({ type: 'light' });
  },

  // 触摸开始
  onTouchStart(e) {
    const touch = e.touches[0];
    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY
    });
  },

  // 触摸移动
  onTouchMove(e) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.data.touchStartX;
    const deltaY = touch.clientY - this.data.touchStartY;
    
    // 计算旋转角度（最大15度）
    const rotate = deltaX * 0.05;
    const maxRotate = 15;
    const finalRotate = Math.max(-maxRotate, Math.min(maxRotate, rotate));
    
    // 计算透明度
    const opacity = 1 - Math.abs(deltaX) / 1000;
    
    // 计算左右滑动覆盖层透明度
    const leftOpacity = deltaX < 0 ? Math.min(Math.abs(deltaX) / 150, 1) : 0;
    const rightOpacity = deltaX > 0 ? Math.min(deltaX / 150, 1) : 0;
    
    this.setData({
      swipeX: deltaX,
      swipeY: deltaY * 0.3, // Y轴移动减弱
      swipeRotate: finalRotate,
      swipeOpacity: Math.max(0.5, opacity),
      swipeLeftOpacity: leftOpacity,
      swipeRightOpacity: rightOpacity
    });
  },

  // 触摸结束
  onTouchEnd(e) {
    const deltaX = this.data.swipeX;
    const threshold = 100; // 滑动阈值
    
    if (Math.abs(deltaX) > threshold) {
      // 滑动距离超过阈值，执行操作
      if (deltaX < 0) {
        // 左滑 - 待复习
        this.animateSwipeOut('left');
      } else {
        // 右滑 - 已掌握
        this.animateSwipeOut('right');
      }
    } else {
      // 滑动距离不够，回弹
      this.resetSwipe();
    }
  },

  // 滑出动画
  animateSwipeOut(direction) {
    const targetX = direction === 'left' ? -1000 : 1000;
    const targetRotate = direction === 'left' ? -30 : 30;
    
    this.setData({
      swipeX: targetX,
      swipeRotate: targetRotate,
      swipeOpacity: 0
    });
    
    // 震动反馈
    wx.vibrateShort({ type: direction === 'right' ? 'medium' : 'light' });
    
    // 右滑（已掌握）触发星火汇聚动画
    if (direction === 'right') {
      this.showSparkAnimation();
    }
    
    // 延迟后进入下一张
    setTimeout(() => {
      this.nextCard();
      this.resetSwipe();
    }, 300);
  },

  // 星火汇聚动画
  showSparkAnimation() {
    // 显示粒子效果
    this.setData({ showSparks: true });
    
    // 显示Toast
    wx.showToast({
      title: '✨ 星火+1',
      icon: 'none',
      duration: 1500
    });
    
    // 清除粒子效果
    setTimeout(() => {
      this.setData({ showSparks: false });
    }, 1000);
  },

  // 重置滑动状态
  resetSwipe() {
    this.setData({
      swipeX: 0,
      swipeY: 0,
      swipeRotate: 0,
      swipeOpacity: 1,
      swipeLeftOpacity: 0,
      swipeRightOpacity: 0
    });
  },

  // 按钮操作
  onReviewCard() {
    this.animateSwipeOut('left');
  },

  onMasterCard() {
    this.animateSwipeOut('right');
  },

  // 打开AI详解
  openAIDetail(e) {
    if (e) {
      e.stopPropagation();
    }
    const card = this.data.cards[this.data.currentIndex];
    wx.showModal({
      title: 'AI 详解',
      content: `即将为您详细讲解"${card.front_title}"的相关知识...`,
      confirmText: '前往AI讲解员',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/ai-chat/index?topic=' + encodeURIComponent(card.front_title)
          });
        }
      }
    });
  },

  nextCard() {
    const nextIndex = this.data.currentIndex + 1;
    this.setData({
      currentIndex: nextIndex,
      flipped: false
    });
    
    // 如果完成所有卡片，显示完成动画
    if (nextIndex >= this.data.cards.length) {
      wx.showToast({
        title: '学习完成！',
        icon: 'success'
      });
    }
  },

  restart() {
    this.loadCards();
  },

  startQuiz() {
    const questions = getRandomQuestions(5);
    this.setData({
      quizStarted: true,
      quizFinished: false,
      quizIndex: 0,
      currentQ: questions[0],
      questions,
      selected: null,
      showAns: false,
      score: 0
    });
  },

  selectOpt(e) {
    if (this.data.showAns) return;
    const idx = e.currentTarget.dataset.idx;
    const correct = idx === this.data.currentQ.correctIndex;
    
    // 添加反馈
    wx.vibrateShort({ type: correct ? 'medium' : 'heavy' });
    
    this.setData({
      selected: idx,
      correct,
      showAns: true,
      score: correct ? this.data.score + 20 : this.data.score
    });
  },

  nextQ() {
    const nextIdx = this.data.quizIndex + 1;
    if (nextIdx >= this.data.questions.length) {
      this.setData({ quizFinished: true });
      return;
    }
    this.setData({
      quizIndex: nextIdx,
      currentQ: this.data.questions[nextIdx],
      selected: null,
      showAns: false
    });
  },

  restartQuiz() {
    this.setData({ quizStarted: false });
  },

  // 开始匹配
  startMatching() {
    wx.vibrateShort({ type: 'medium' });
    this.setData({
      isMatching: true,
      matchingTime: 0,
      matchFound: false
    });
    
    // 匹配计时器
    this.data.matchingTimer = setInterval(() => {
      this.setData({ matchingTime: this.data.matchingTime + 1 });
      
      // 模拟匹配成功（3-8秒随机）
      if (this.data.matchingTime >= 3 + Math.floor(Math.random() * 5)) {
        this.onMatchSuccess();
      }
    }, 1000);
  },

  // 取消匹配
  cancelMatching() {
    this.clearMatchingTimer();
    this.setData({ isMatching: false, matchingTime: 0 });
    wx.showToast({ title: '已取消匹配', icon: 'none' });
  },

  // 清除匹配计时器
  clearMatchingTimer() {
    if (this.data.matchingTimer) {
      clearInterval(this.data.matchingTimer);
      this.data.matchingTimer = null;
    }
  },

  // 匹配成功
  onMatchSuccess() {
    this.clearMatchingTimer();
    
    // 模拟对手信息
    const opponents = [
      { nickName: '历史达人', avatarUrl: '' },
      { nickName: '红色传承者', avatarUrl: '' },
      { nickName: '知识先锋', avatarUrl: '' },
      { nickName: '学习标兵', avatarUrl: '' },
      { nickName: '党史小能手', avatarUrl: '' }
    ];
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    wx.vibrateShort({ type: 'heavy' });
    this.setData({
      isMatching: false,
      matchFound: true,
      matchCountdown: 3,
      opponent
    });
    
    // 倒计时开始对战
    const countdownTimer = setInterval(() => {
      const countdown = this.data.matchCountdown - 1;
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        this.startBattle();
      } else {
        this.setData({ matchCountdown: countdown });
      }
    }, 1000);
  },

  // 开始对战
  startBattle() {
    const questions = getRandomQuestions(5);
    this.setData({
      matchFound: false,
      battleStarted: true,
      battleFinished: false,
      battleQ: questions[0],
      battleQuestions: questions,
      battleIdx: 0,
      battleSel: null,
      myScore: 0,
      opponentScore: 0,
      showBattleAns: false,
      battleTimeLeft: 10
    });
    this.startBattleTimer();
  },

  // 开始倒计时
  startBattleTimer() {
    this.clearBattleTimer();
    this.setData({ battleTimeLeft: 10 });
    
    this.data.battleTimer = setInterval(() => {
      const timeLeft = this.data.battleTimeLeft - 1;
      this.setData({ battleTimeLeft: timeLeft });
      
      // 剩余3秒时震动提示
      if (timeLeft === 3) {
        wx.vibrateShort({ type: 'light' });
      }
      
      // 时间到，自动跳过
      if (timeLeft <= 0) {
        this.clearBattleTimer();
        if (this.data.battleSel === null) {
          this.handleBattleTimeout();
        }
      }
    }, 1000);
  },

  // 清除倒计时
  clearBattleTimer() {
    if (this.data.battleTimer) {
      clearInterval(this.data.battleTimer);
      this.data.battleTimer = null;
    }
  },

  // 超时处理
  handleBattleTimeout() {
    wx.showToast({
      title: '超时未答',
      icon: 'none'
    });
    
    // 模拟对手答题
    const opponentCorrect = Math.random() > 0.4;
    let { opponentScore } = this.data;
    if (opponentCorrect) opponentScore += 20;
    
    this.setData({
      battleSel: -1,
      opponentScore,
      opponentAnswered: opponentCorrect,
      showBattleAns: true
    });
    
    setTimeout(() => {
      this.nextBattleQuestion();
    }, 2000);
  },

  selectBattleOpt(e) {
    if (this.data.battleSel !== null) return;
    
    this.clearBattleTimer();
    
    const idx = e.currentTarget.dataset.idx;
    const correct = idx === this.data.battleQ.correctIndex;
    let { myScore, opponentScore } = this.data;
    
    if (correct) {
      myScore += 20;
      wx.vibrateShort({ type: 'medium' });
    } else {
      wx.vibrateShort({ type: 'heavy' });
    }
    
    // 模拟对手答题
    const opponentCorrect = Math.random() > 0.4;
    if (opponentCorrect) opponentScore += 20;
    
    this.setData({ 
      battleSel: idx, 
      correct,
      myScore, 
      opponentScore,
      opponentAnswered: opponentCorrect,
      showBattleAns: true
    });
    
    setTimeout(() => {
      this.nextBattleQuestion();
    }, 2500);
  },

  nextBattleQuestion() {
    const nextIdx = this.data.battleIdx + 1;
    if (nextIdx >= this.data.battleQuestions.length) {
      const { myScore, opponentScore } = this.data;
      const won = myScore > opponentScore;
      const isDraw = myScore === opponentScore;
      
      this.clearBattleTimer();
      this.setData({
        battleFinished: true,
        won,
        isDraw
      });
      
      if (won) {
        wx.showToast({ title: '🎉 胜利！', icon: 'none' });
      } else if (isDraw) {
        wx.showToast({ title: '🤝 平局', icon: 'none' });
      }
      return;
    }
    
    this.setData({
      battleIdx: nextIdx,
      battleQ: this.data.battleQuestions[nextIdx],
      battleSel: null,
      correct: false,
      opponentAnswered: false,
      showBattleAns: false
    });
    
    this.startBattleTimer();
  },

  restartBattle() {
    this.clearBattleTimer();
    this.clearMatchingTimer();
    this.setData({ 
      battleStarted: false,
      battleFinished: false,
      isMatching: false,
      matchFound: false
    });
  },

  onUnload() {
    // 页面卸载时清除定时器
    this.clearBattleTimer();
  }
});
