// 全局音频播放器组件
const audioContext = wx.getBackgroundAudioManager();

Component({
  data: {
    isPlaying: false,
    isPaused: false,
    expanded: false,
    currentAudio: {
      title: '红色故事',
      subtitle: '党史音频',
      src: ''
    },
    progress: 0,
    currentTime: '00:00',
    totalTime: '00:00'
  },

  lifetimes: {
    attached() {
      this.initAudioContext();
      this.checkPlayingState();
    },

    detached() {
      // 清理监听器
      audioContext.offPlay(this.onAudioPlay);
      audioContext.offPause(this.onAudioPause);
      audioContext.offStop(this.onAudioStop);
      audioContext.offEnded(this.onAudioEnded);
      audioContext.offTimeUpdate(this.onTimeUpdate);
    }
  },

  methods: {
    // 初始化音频上下文
    initAudioContext() {
      audioContext.onPlay(() => {
        this.setData({ isPlaying: true, isPaused: false });
      });

      audioContext.onPause(() => {
        this.setData({ isPlaying: false, isPaused: true });
      });

      audioContext.onStop(() => {
        this.setData({ isPlaying: false, isPaused: false });
      });

      audioContext.onEnded(() => {
        this.setData({ isPlaying: false, isPaused: false });
      });

      audioContext.onTimeUpdate(() => {
        const current = audioContext.currentTime || 0;
        const total = audioContext.duration || 0;
        const progress = total > 0 ? (current / total) * 100 : 0;

        this.setData({
          progress: progress,
          currentTime: this.formatTime(current),
          totalTime: this.formatTime(total)
        });
      });
    },

    // 检查播放状态
    checkPlayingState() {
      const globalAudio = getApp().globalData.currentAudio;
      if (globalAudio) {
        this.setData({
          currentAudio: globalAudio,
          isPlaying: audioContext.paused === false,
          isPaused: audioContext.paused === true
        });
      }
    },

    // 切换展开/收起
    toggleExpand() {
      this.setData({ expanded: !this.data.expanded });
    },

    stopPropagation() {},

    // 播放/暂停
    onTogglePlay() {
      if (this.data.isPlaying) {
        audioContext.pause();
      } else {
        audioContext.play();
      }
    },

    // 上一首
    onPrev() {
      wx.showToast({
        title: '已是第一首',
        icon: 'none'
      });
    },

    // 下一首
    onNext() {
      wx.showToast({
        title: '已是最后一首',
        icon: 'none'
      });
    },

    // 关闭播放器
    onClose() {
      audioContext.stop();
      this.setData({
        isPlaying: false,
        isPaused: false,
        expanded: false
      });
    },

    // 格式化时间
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '00:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }
});
