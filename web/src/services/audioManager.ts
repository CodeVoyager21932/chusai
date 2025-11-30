import { RadioProgram } from '@/types/models';

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentProgram: RadioProgram | null = null;
  private playlist: RadioProgram[] = [];
  private currentIndex: number = -1;
  private listeners: Set<() => void> = new Set();

  // 初始化音频元素
  private initAudio() {
    if (typeof window === 'undefined') return;
    
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.addEventListener('ended', () => this.playNext());
      this.audio.addEventListener('timeupdate', () => this.notifyListeners());
      this.audio.addEventListener('play', () => this.notifyListeners());
      this.audio.addEventListener('pause', () => this.notifyListeners());
    }
  }

  // 设置播放列表
  setPlaylist(programs: RadioProgram[]) {
    this.playlist = programs;
  }

  // 播放指定节目
  play(program: RadioProgram) {
    this.initAudio();
    if (!this.audio) return;

    this.currentProgram = program;
    this.currentIndex = this.playlist.findIndex(p => p.id === program.id);
    
    // 模拟音频 URL（实际项目中应该使用真实的音频文件）
    this.audio.src = program.audioUrl || '';
    this.audio.play().catch(console.error);
    this.notifyListeners();
  }

  // 暂停
  pause() {
    this.audio?.pause();
    this.notifyListeners();
  }

  // 继续播放
  resume() {
    this.audio?.play().catch(console.error);
    this.notifyListeners();
  }

  // 切换播放/暂停
  toggle() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.resume();
    }
  }

  // 播放下一首
  playNext() {
    if (this.playlist.length === 0) return;
    
    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    this.play(this.playlist[nextIndex]);
  }

  // 播放上一首
  playPrevious() {
    if (this.playlist.length === 0) return;
    
    const prevIndex = this.currentIndex <= 0 
      ? this.playlist.length - 1 
      : this.currentIndex - 1;
    this.play(this.playlist[prevIndex]);
  }

  // 跳转到指定时间
  seekTo(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  // 设置音量 (0-1)
  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  // 获取当前播放状态
  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  // 获取当前节目
  getCurrentProgram(): RadioProgram | null {
    return this.currentProgram;
  }

  // 获取当前播放时间
  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  // 获取总时长
  getDuration(): number {
    return this.audio?.duration || 0;
  }

  // 获取播放进度 (0-100)
  getProgress(): number {
    const duration = this.getDuration();
    if (duration === 0) return 0;
    return (this.getCurrentTime() / duration) * 100;
  }

  // 订阅状态变化
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 通知所有监听器
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // 停止播放并清理
  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.currentProgram = null;
    this.currentIndex = -1;
    this.notifyListeners();
  }
}

// 单例导出
export const audioManager = new AudioManager();
