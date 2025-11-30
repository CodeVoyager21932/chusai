# Requirements Document

## Introduction

本项目旨在将"星火"微信小程序完整迁移并重构为现代化 Web 应用。"星火"是一款红色教育学习平台，包含英雄人物展示、AI 对话、知识卡片学习、答题 PK、红色珍藏收集等功能。迁移后的 Web 应用将采用 Modern SaaS 设计风格，提供响应式布局、精美的视觉效果和流畅的交互体验。

## Glossary

- **Hero（英雄）**: 革命英雄人物数据实体，包含姓名、生卒年、时代、头像、传记等信息
- **Card（卡片）**: 党史知识学习卡片，包含正面标题/图片和背面详细内容
- **Relic（信物）**: 红色珍藏物品，具有稀有度等级（SSR/SR/R）
- **Quiz（答题）**: 党史知识问答题目，包含选项和解析
- **Daily Quote（每日名言）**: 每日签到展示的革命名言
- **Spark Prairie（星火燎原）**: 学习、练习、PK 对战的综合功能模块
- **Red Heritage（红色珍藏）**: 博物馆展厅和抽卡解密功能模块
- **Check-in（打卡）**: 用户每日签到功能
- **Glassmorphism**: 毛玻璃效果的 UI 设计风格
- **Mobile First**: 优先为移动端设计，再适配桌面端的响应式策略

## Requirements

### Requirement 1: 项目架构与技术栈

**User Story:** As a developer, I want a modern, maintainable codebase, so that I can efficiently develop and scale the application.

#### Acceptance Criteria

1. THE Web_Application SHALL use Next.js 14+ with App Router as the framework
2. THE Web_Application SHALL use TypeScript for type-safe development
3. THE Web_Application SHALL use Tailwind CSS for styling with a custom design system
4. THE Web_Application SHALL use Shadcn/UI component library for UI components
5. THE Web_Application SHALL use Zustand for lightweight state management
6. THE Web_Application SHALL use Lucide Icons for consistent iconography

### Requirement 2: 首页（Home Page）

**User Story:** As a user, I want an engaging home page that showcases daily content and provides quick access to all features, so that I can start learning immediately.

#### Acceptance Criteria

1. WHEN a user visits the home page THEN THE Home_Page SHALL display a dynamic greeting based on time of day
2. WHEN the home page loads THEN THE Home_Page SHALL display a featured "Today's Hero" card with 3D tilt effect on hover/touch
3. WHEN the home page loads THEN THE Home_Page SHALL display a daily task prompt with progress indicator
4. THE Home_Page SHALL display a 2x2 grid of main feature cards (AI Chat, Knowledge Graph, Spark Prairie, Red Heritage)
5. THE Home_Page SHALL display a horizontally scrollable hero gallery section
6. THE Home_Page SHALL display user learning statistics (consecutive days, mastered cards, AI interactions)
7. THE Home_Page SHALL include a floating action button for daily sign-in/quote modal
8. WHEN a user clicks the daily sign button THEN THE Home_Page SHALL display a modal with today's revolutionary quote

### Requirement 3: 英雄长廊（Hero Gallery）

**User Story:** As a user, I want to browse and filter revolutionary heroes by era, so that I can learn about different historical periods.

#### Acceptance Criteria

1. THE Hero_Gallery SHALL display a filterable list of heroes with era-based tabs (全部/革命时期/建设时期/改革时期/新时代)
2. WHEN a user selects an era filter THEN THE Hero_Gallery SHALL display only heroes from that era
3. THE Hero_Gallery SHALL display each hero as a card with avatar, name, years, title, and brief description
4. WHEN a user clicks a hero card THEN THE Hero_Gallery SHALL navigate to the hero detail page
5. THE Hero_Gallery SHALL implement smooth fade-in animations for card rendering

### Requirement 4: 英雄详情（Hero Detail）

**User Story:** As a user, I want to view detailed information about a hero, so that I can learn their biography and famous quotes.

#### Acceptance Criteria

1. THE Hero_Detail SHALL display the hero's full biography, main deeds, and famous quotes
2. THE Hero_Detail SHALL display the hero's avatar prominently with era badge
3. THE Hero_Detail SHALL provide a button to start AI conversation with this hero
4. THE Hero_Detail SHALL implement a visually rich layout with proper typography hierarchy

### Requirement 5: AI 对话（AI Chat）

**User Story:** As a user, I want to have conversations with an AI guide or role-play with historical heroes, so that I can learn history interactively.

#### Acceptance Criteria

1. THE AI_Chat SHALL display a chat interface with message bubbles for user and AI
2. THE AI_Chat SHALL support switching between default mode (星火同志) and hero role-play mode
3. WHEN in hero mode THEN THE AI_Chat SHALL display the selected hero's avatar and name
4. THE AI_Chat SHALL display rotating loading tips during AI response generation
5. THE AI_Chat SHALL persist chat history in local storage
6. WHEN a user sends a message THEN THE AI_Chat SHALL display the message immediately and show loading state
7. THE AI_Chat SHALL implement a hero selection modal with grid layout

### Requirement 6: 星火燎原（Spark Prairie - Learn/Practice/Battle）

**User Story:** As a user, I want to learn through flashcards, practice with quizzes, and compete in PK battles, so that I can reinforce my knowledge.

#### Acceptance Criteria

1. THE Spark_Prairie SHALL provide three modes: Learn (学习), Practice (练习), Battle (对战)
2. WHEN in Learn mode THEN THE Spark_Prairie SHALL display swipeable flashcards with flip animation
3. WHEN a user swipes left on a card THEN THE Spark_Prairie SHALL mark it as "needs review"
4. WHEN a user swipes right on a card THEN THE Spark_Prairie SHALL mark it as "mastered" with spark animation
5. WHEN in Practice mode THEN THE Spark_Prairie SHALL display quiz questions with multiple choice options
6. WHEN a user selects an answer THEN THE Spark_Prairie SHALL show correct/incorrect feedback with explanation
7. WHEN in Battle mode THEN THE Spark_Prairie SHALL simulate opponent matching and timed PK rounds
8. THE Spark_Prairie SHALL display score tracking and final results for practice and battle modes

### Requirement 7: 红色珍藏（Red Heritage）

**User Story:** As a user, I want to collect and view red relics through a gacha system, so that I can be motivated to learn more.

#### Acceptance Criteria

1. THE Red_Heritage SHALL display a collection gallery of relics with rarity indicators (SSR/SR/R)
2. THE Red_Heritage SHALL show locked/unlocked status for each relic
3. THE Red_Heritage SHALL provide a "mystery box" gacha draw feature
4. WHEN a user draws a relic THEN THE Red_Heritage SHALL display an animated reveal with rarity effects
5. THE Red_Heritage SHALL display collection progress (collected/total)

### Requirement 8: 个人中心（Profile）

**User Story:** As a user, I want to view my learning progress and achievements, so that I can track my growth.

#### Acceptance Criteria

1. THE Profile SHALL display user avatar and nickname
2. THE Profile SHALL display learning statistics (consecutive days, total days, mastered cards, AI chats)
3. THE Profile SHALL display an achievement system with unlockable badges
4. THE Profile SHALL display a monthly check-in calendar with marked days
5. WHEN a user clicks an achievement THEN THE Profile SHALL show achievement details and progress

### Requirement 9: 响应式设计与视觉风格

**User Story:** As a user, I want a beautiful, responsive interface that works on both mobile and desktop, so that I can access the app from any device.

#### Acceptance Criteria

1. THE Web_Application SHALL implement Mobile First responsive design
2. THE Web_Application SHALL adapt layout for desktop with centered content or side panels
3. THE Web_Application SHALL use a cohesive color palette with primary red theme and soft neutrals
4. THE Web_Application SHALL implement Glassmorphism effects for cards and modals
5. THE Web_Application SHALL use soft shadows and rounded corners consistently
6. THE Web_Application SHALL implement micro-interactions (hover effects, click feedback, smooth transitions)
7. THE Web_Application SHALL use generous whitespace and clear typography hierarchy

### Requirement 10: 数据管理与持久化

**User Story:** As a user, I want my learning progress to be saved, so that I can continue where I left off.

#### Acceptance Criteria

1. THE Web_Application SHALL store user progress in browser localStorage
2. THE Web_Application SHALL load static data (heroes, cards, quotes, relics, questions) from local data files
3. THE Web_Application SHALL implement a data manager service for centralized data access
4. WHEN the application loads THEN THE Data_Manager SHALL initialize all required data

### Requirement 11: 导航与路由

**User Story:** As a user, I want intuitive navigation between pages, so that I can easily explore all features.

#### Acceptance Criteria

1. THE Web_Application SHALL implement a bottom navigation bar for mobile view
2. THE Web_Application SHALL implement a sidebar or top navigation for desktop view
3. THE Web_Application SHALL support browser back/forward navigation
4. THE Web_Application SHALL highlight the current active route in navigation

### Requirement 12: 知识图谱（Knowledge Graph）

**User Story:** As a user, I want to explore party history through an interactive timeline and knowledge graph, so that I can understand historical events and their connections.

#### Acceptance Criteria

1. THE Knowledge_Graph SHALL provide two view modes: Timeline view and Graph view
2. WHEN in Timeline view THEN THE Knowledge_Graph SHALL display historical events chronologically with year, title, description, and image
3. WHEN a user clicks an event card THEN THE Knowledge_Graph SHALL navigate to the event detail or related hero page
4. THE Knowledge_Graph SHALL implement smooth scroll animations for timeline navigation
5. WHEN in Graph view THEN THE Knowledge_Graph SHALL display an interactive node-based visualization of connected events and figures

### Requirement 13: 红色足迹（Red Footprints - Map Exploration）

**User Story:** As a user, I want to explore red historical sites on a map, so that I can discover nearby revolutionary landmarks.

#### Acceptance Criteria

1. THE Red_Footprints SHALL display an interactive map centered on user's location or default coordinates
2. THE Red_Footprints SHALL display markers for red historical sites with custom icons
3. WHEN a user clicks a marker THEN THE Red_Footprints SHALL display location details with name and distance
4. THE Red_Footprints SHALL provide a list view of nearby locations sorted by distance
5. WHEN a user clicks navigate button THEN THE Red_Footprints SHALL open external map application for directions

### Requirement 14: 全局搜索（Global Search）

**User Story:** As a user, I want to search for heroes and content across the application, so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. THE Global_Search SHALL provide a search overlay accessible from the home page header
2. WHEN a user types in the search input THEN THE Global_Search SHALL display matching results with debounced search (500ms delay)
3. THE Global_Search SHALL display hot search tags for quick access to popular heroes
4. WHEN a user selects a search result THEN THE Global_Search SHALL navigate to the corresponding detail page
5. WHEN no results are found THEN THE Global_Search SHALL display an empty state message

### Requirement 15: 红色电台（Red Radio - Audio Player）

**User Story:** As a user, I want to listen to revolutionary audio content, so that I can learn through audio stories and historical recordings.

#### Acceptance Criteria

1. THE Red_Radio SHALL display a playlist of audio content with title, artist, duration, and cover image
2. THE Red_Radio SHALL provide playback controls (play, pause, next, previous)
3. WHEN audio is playing THEN THE Red_Radio SHALL display a mini player bar at the bottom of the screen
4. THE Red_Radio SHALL support background audio playback
5. THE Red_Radio SHALL display audio categories for filtering (英雄原声, 历史实况, 党史故事, 英雄故事)

### Requirement 16: 错误处理与加载状态

**User Story:** As a user, I want clear feedback during loading and error states, so that I understand what's happening in the application.

#### Acceptance Criteria

1. THE Web_Application SHALL display skeleton loading states during data fetching
2. THE Web_Application SHALL display appropriate error messages when operations fail
3. THE Web_Application SHALL provide retry options for failed network requests
4. THE Web_Application SHALL implement graceful image fallbacks for failed image loads
5. THE Web_Application SHALL display toast notifications for user actions (success, error, info)

### Requirement 17: 性能优化

**User Story:** As a user, I want a fast and smooth application experience, so that I can use the app without frustration.

#### Acceptance Criteria

1. THE Web_Application SHALL implement lazy loading for images
2. THE Web_Application SHALL implement code splitting for route-based chunks
3. THE Web_Application SHALL cache static data in browser storage for offline access
4. THE Web_Application SHALL optimize animations to maintain 60fps performance
5. THE Web_Application SHALL implement proper loading priorities for critical content
