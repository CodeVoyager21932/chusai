# Design Document: 星火 Web Application

## Overview

本设计文档描述将"星火"微信小程序迁移为现代化 Web 应用的技术架构和实现方案。新应用采用 Next.js 14+ App Router 架构，结合 Tailwind CSS 和 Shadcn/UI 组件库，打造具有 Modern SaaS 风格的红色教育学习平台。

设计目标：
- **视觉升级**：从原生小程序风格升级为 Glassmorphism + 微交互的现代设计
- **响应式体验**：Mobile First 设计，完美适配桌面端
- **性能优化**：代码分割、图片懒加载、数据缓存
- **可维护性**：TypeScript 类型安全、组件化架构、状态管理

## Architecture

### 技术栈

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Next.js    │  │  Tailwind   │  │     Shadcn/UI       │  │
│  │  App Router │  │    CSS      │  │  + Lucide Icons     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      State Management                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                     Zustand                          │    │
│  │  (User Store, UI Store, Learning Progress Store)     │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Static     │  │  LocalStorage│  │   Data Manager     │  │
│  │  JSON Data  │  │  Persistence │  │   Service          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── hero-gallery/
│   │   └── page.tsx
│   ├── hero/[id]/
│   │   └── page.tsx
│   ├── ai-chat/
│   │   └── page.tsx
│   ├── spark-prairie/
│   │   └── page.tsx
│   ├── red-heritage/
│   │   └── page.tsx
│   ├── knowledge-graph/
│   │   └── page.tsx
│   ├── red-footprints/
│   │   └── page.tsx
│   ├── red-radio/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
├── components/
│   ├── ui/                       # Shadcn/UI components
│   ├── layout/
│   │   ├── Navigation.tsx        # Bottom nav (mobile) / Sidebar (desktop)
│   │   ├── Header.tsx
│   │   └── MiniPlayer.tsx        # Audio mini player
│   ├── home/
│   │   ├── HeroCard.tsx          # 3D tilt hero card
│   │   ├── FeatureGrid.tsx
│   │   ├── HeroGalleryScroll.tsx
│   │   └── StatsCard.tsx
│   ├── hero/
│   │   ├── HeroCard.tsx
│   │   ├── HeroFilter.tsx
│   │   └── HeroDetail.tsx
│   ├── chat/
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── HeroSelector.tsx
│   ├── spark/
│   │   ├── FlashCard.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── BattleArena.tsx
│   ├── heritage/
│   │   ├── RelicCard.tsx
│   │   ├── GachaDrawer.tsx
│   │   └── CollectionGrid.tsx
│   ├── search/
│   │   └── GlobalSearch.tsx
│   └── shared/
│       ├── DailySignModal.tsx
│       ├── BadgeModal.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
├── stores/
│   ├── userStore.ts              # User info, stats, check-in
│   ├── uiStore.ts                # Modals, search, audio player
│   └── learningStore.ts          # Cards progress, quiz state
├── services/
│   ├── dataManager.ts            # Data fetching with cache
│   └── audioManager.ts           # Audio playback control
├── data/
│   ├── heroes.ts
│   ├── cards.ts
│   ├── relics.ts
│   ├── daily-quotes.ts
│   ├── quiz-questions.ts
│   └── radio-playlist.ts
├── types/
│   └── models.ts                 # TypeScript interfaces
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── cn.ts                     # Class name merger
└── styles/
    └── globals.css               # Tailwind + custom styles
```

## Components and Interfaces

### Core Components

#### 1. Navigation Component
```typescript
interface NavigationProps {
  currentPath: string;
}

// Features:
// - Mobile: Fixed bottom bar with 5 icons (Home, Heroes, Learn, Heritage, Profile)
// - Desktop: Left sidebar with expanded labels
// - Active state highlighting with animated indicator
```

#### 2. HeroCard (3D Tilt Effect)
```typescript
interface HeroCardProps {
  hero: Hero;
  variant: 'featured' | 'gallery' | 'compact';
  onTilt?: (rotateX: number, rotateY: number) => void;
}

// Features:
// - Perspective transform on mouse/touch move
// - Glare overlay effect
// - Era badge with gradient
// - Smooth transition on hover/touch end
```

#### 3. FlashCard (Swipeable)
```typescript
interface FlashCardProps {
  card: Flashcard;
  onSwipeLeft: () => void;   // Needs review
  onSwipeRight: () => void;  // Mastered
  onFlip: () => void;
}

// Features:
// - 3D flip animation
// - Swipe gesture detection
// - Spark particle effect on mastery
```

#### 4. GachaDrawer
```typescript
interface GachaDrawerProps {
  onDraw: () => Promise<Relic>;
  availableDraws: number;
}

// Features:
// - Mystery box animation
// - Rarity-based reveal effects (SSR/SR/R)
// - Confetti on rare draws
```

#### 5. ChatBubble
```typescript
interface ChatBubbleProps {
  message: ChatMessage;
  isUser: boolean;
  heroAvatar?: string;
}

// Features:
// - Typing indicator animation
// - Message timestamp
// - Avatar display for AI/hero
```

### Shared UI Components (Shadcn/UI based)

| Component | Usage |
|-----------|-------|
| Button | Primary actions, navigation |
| Card | Content containers |
| Dialog | Modals (daily sign, badge, hero select) |
| Tabs | Era filters, view modes |
| Input | Search, chat input |
| Avatar | User, hero avatars |
| Badge | Era tags, rarity indicators |
| Progress | Learning progress, quiz score |
| Skeleton | Loading states |
| Toast | Notifications |

## Data Models

### TypeScript Interfaces

```typescript
// Hero Model
interface Hero {
  id: string;                    // hero_001
  name: string;
  birth_year: number;
  death_year: number;
  era: '革命时期' | '建设时期' | '改革时期' | '新时代';
  title: string;
  avatar: string;
  biography: string;
  main_deeds: string[];
  famous_quotes: string[];
}

// Flashcard Model
interface Flashcard {
  id: string;
  front_title: string;
  front_image: string;
  back_content: string;
  back_keywords: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  era: 'revolution' | 'construction' | 'reform' | 'new_era';
}

// Relic Model
interface Relic {
  id: string;
  name: string;
  rarity: 'SSR' | 'SR' | 'R';
  image: string;
  related_hero_id: string;
  story: string;
  year: number;
}

// Quiz Question Model
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Daily Quote Model
interface DailyQuote {
  id: string;
  quote_content: string;
  author: string;
  source?: string;
  date?: string;
}

// Radio Program Model
interface RadioProgram {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  description: string;
  category: '英雄原声' | '历史实况' | '党史故事' | '英雄故事';
}

// User Stats Model
interface UserStats {
  continuous_days: number;
  total_days: number;
  mastered_cards: number;
  ai_chat_count: number;
  relics_collected: number;
}

// Chat Message Model
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  heroId?: string;
}

// Check-in Record
interface CheckInRecord {
  date: string;        // YYYY-MM-DD
  quote: DailyQuote;
}
```

### Zustand Store Interfaces

```typescript
// User Store
interface UserStore {
  userInfo: {
    nickName: string;
    avatarUrl: string;
  };
  stats: UserStats;
  checkInRecords: string[];
  collectedRelics: string[];
  masteredCards: string[];
  
  // Actions
  checkIn: (date: string) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  collectRelic: (relicId: string) => void;
  masterCard: (cardId: string) => void;
}

// UI Store
interface UIStore {
  showDailySign: boolean;
  showSearch: boolean;
  showBadgeModal: boolean;
  currentBadge: Badge | null;
  audioPlaying: boolean;
  currentAudio: RadioProgram | null;
  
  // Actions
  toggleDailySign: () => void;
  toggleSearch: () => void;
  showBadge: (badge: Badge) => void;
  setAudio: (audio: RadioProgram | null) => void;
}

// Learning Store
interface LearningStore {
  currentMode: 'learn' | 'practice' | 'battle';
  currentCardIndex: number;
  quizScore: number;
  battleState: BattleState | null;
  
  // Actions
  setMode: (mode: 'learn' | 'practice' | 'battle') => void;
  nextCard: () => void;
  answerQuestion: (index: number) => boolean;
  startBattle: () => void;
}
```

