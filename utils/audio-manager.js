// 背景音频管理器封装
class AudioManager {
  constructor() {
    this.bgAudioManager = null;
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.listeners = [];
    
    this.init();
  }

  // 初始化
  init() {
    this.bgAudioManager = wx.getBackgroundAudioManager();
    
    // 监听播放事件
    this.bgAudioManager.onPlay(() => {
      this.isPlaying = true;
      this.notifyListeners('play');
    });

    // 监听暂停事件
    this.bgAudioManager.onPause(() => {
      this.isPlaying = false;
      this.notifyListeners('pause');
    });

    // 监听停止事件
    this.bgAudioManager.onStop(() => {
      this.isPlaying = false;
      this.notifyListeners('stop');
    });

    // 监听自然播放结束
    this.bgAudioManager.onEnded(() => {
      this.next();
    });

    // 监听错误
    this.bgAudioManager.onError((err) => {
      console.error('音频播放错误', err);
      this.notifyListeners('error', err);
    });
  }

  // 设置播放列表
  setPlaylist(playlist) {
    this.playlist = playlist;
  }

  // 播放指定音频
  play(audio, index = 0) {
    if (!audio) return;

    this.currentIndex = index;
    
    // 设置音频信息
    this.bgAudioManager.title = audio.title;
    this.bgAudioManager.epname = audio.category || '红色电台';
    this.bgAudioManager.singer = audio.artist;
    this.bgAudioManager.coverImgUrl = audio.coverUrl;
    this.bgAudioManager.src = audio.audioUrl;

    this.notifyListeners('change', audio);
  }

  // 暂停
  pause() {
    this.bgAudioManager.pause();
  }

  // 继续播放
  resume() {
    this.bgAudioManager.play();
  }

  // 停止
  stop() {
    this.bgAudioManager.stop();
  }

  // 下一首
  next() {
    if (this.playlist.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    const nextAudio = this.playlist[this.currentIndex];
    this.play(nextAudio, this.currentIndex);
  }

  // 上一首
  prev() {
    if (this.playlist.length === 0) return;

    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    const prevAudio = this.playlist[this.currentIndex];
    this.play(prevAudio, this.currentIndex);
  }

  // 获取当前播放信息
  getCurrentAudio() {
    return this.playlist[this.currentIndex];
  }

  // 获取播放状态
  getPlayingState() {
    return this.isPlaying;
  }

  // 添加监听器
  addListener(callback) {
    this.listeners.push(callback);
  }

  // 移除监听器
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // 通知所有监听器
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      callback(event, data);
    });
  }
}

// 创建单例
const audioManager = new AudioManager();

module.exports = audioManager;
