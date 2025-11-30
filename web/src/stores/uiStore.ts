import { create } from 'zustand';
import { Badge, RadioProgram } from '@/types/models';

interface UIStore {
  // Modal States
  showDailySign: boolean;
  showSearch: boolean;
  showBadgeModal: boolean;
  showHeroSelector: boolean;
  currentBadge: Badge | null;
  
  // Audio Player State
  audioPlaying: boolean;
  currentAudio: RadioProgram | null;
  audioProgress: number;
  
  // Actions
  toggleDailySign: () => void;
  setShowDailySign: (show: boolean) => void;
  toggleSearch: () => void;
  setShowSearch: (show: boolean) => void;
  showBadge: (badge: Badge) => void;
  closeBadgeModal: () => void;
  toggleHeroSelector: () => void;
  setShowHeroSelector: (show: boolean) => void;
  
  // Audio Actions
  setAudio: (audio: RadioProgram | null) => void;
  setAudioPlaying: (playing: boolean) => void;
  setAudioProgress: (progress: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial State
  showDailySign: false,
  showSearch: false,
  showBadgeModal: false,
  showHeroSelector: false,
  currentBadge: null,
  audioPlaying: false,
  currentAudio: null,
  audioProgress: 0,
  
  // Actions
  toggleDailySign: () => set((state) => ({ showDailySign: !state.showDailySign })),
  setShowDailySign: (show) => set({ showDailySign: show }),
  
  toggleSearch: () => set((state) => ({ showSearch: !state.showSearch })),
  setShowSearch: (show) => set({ showSearch: show }),
  
  showBadge: (badge) => set({ showBadgeModal: true, currentBadge: badge }),
  closeBadgeModal: () => set({ showBadgeModal: false, currentBadge: null }),
  
  toggleHeroSelector: () => set((state) => ({ showHeroSelector: !state.showHeroSelector })),
  setShowHeroSelector: (show) => set({ showHeroSelector: show }),
  
  // Audio Actions
  setAudio: (audio) => set({ currentAudio: audio, audioPlaying: audio !== null }),
  setAudioPlaying: (playing) => set({ audioPlaying: playing }),
  setAudioProgress: (progress) => set({ audioProgress: progress }),
}));

export default useUIStore;
