# Implementation Plan

## 1. 项目初始化与基础架构

- [ ] 1.1 初始化 Next.js 14+ 项目
  - 使用 `create-next-app` 创建项目，启用 TypeScript、Tailwind CSS、App Router
  - 配置 `tsconfig.json` 路径别名 (`@/`)
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 1.2 安装和配置 Shadcn/UI
  - 运行 `npx shadcn-ui@latest init` 初始化
  - 安装核心组件：Button, Card, Dialog, Tabs, Input, Avatar, Badge, Progress, Skeleton
  - 配置 Lucide Icons
  - _Requirements: 1.4, 1.6_

- [ ] 1.3 配置设计系统和全局样式
  - 在 `globals.css` 中定义 CSS 变量（配色、字体、间距、阴影）
  - 配置 Tailwind 扩展主题
  - 添加 Glassmorphism 和动画预设样式
  - _Requirements: 9.3, 9.4, 9.5, 9.6_

- [ ] 1.4 创建 TypeScript 类型定义
  - 在 `src/types/models.ts` 定义所有数据模型接口
  - Hero, Flashcard, Relic, QuizQuestion, DailyQuote, RadioProgram, UserStats, ChatMessage
  - _Requirements: 1.2_

- [ ] 1.5 迁移静态数据文件
  - 将小程序 `data/` 目录下的数据转换为 TypeScript 模块
  - heroes.ts, cards.ts, relics.ts, daily-quotes.ts, quiz-questions.ts, radio-playlist.ts
  - _Requirements: 10.2_

## 2. 状态管理与数据服务

- [ ] 2.1 配置 Zustand 状态管理
  - 安装 Zustand 和 persist 中间件
  - 创建 `src/stores/userStore.ts` - 用户信息、统计、签到记录
  - 创建 `src/stores/uiStore.ts` - 模态框、搜索、音频播放状态
  - 创建 `src/stores/learningStore.ts` - 学习模式、卡片进度、答题状态
  - _Requirements: 1.5, 10.1_

- [ ] 2.2 编写属性测试：数据持久化往返
  - **Property 7: Data Persistence Round-Trip**
  - **Validates: Requirements 10.1, 17.3**

- [ ] 2.3 创建数据管理服务
  - 实现 `src/services/dataManager.ts`
  - 提供统一的数据访问接口，支持缓存
  - 实现日期相关内容选择函数（getGreeting, getTodayHero, getDailyQuote）
  - _Requirements: 10.3, 10.4_

- [ ] 2.4 编写属性测试：日期内容选择一致性
  - **Property 1: Date-based Content Selection Consistency**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.8**

## 3. 布局与导航组件

- [ ] 3.1 创建根布局组件
  - 实现 `src/app/layout.tsx` 包含 Providers、字体配置、元数据
  - 添加 Toast 容器和全局错误边界
  - _Requirements: 16.5_

- [ ] 3.2 实现响应式导航组件
  - 创建 `src/components/layout/Navigation.tsx`
  - Mobile: 底部固定导航栏（5 个图标）
  - Desktop: 左侧边栏导航
  - 当前路由高亮指示器
  - _Requirements: 11.1, 11.2, 11.4_

- [ ] 3.3 实现页面头部组件
  - 创建 `src/components/layout/Header.tsx`
  - 包含搜索按钮、用户头像、签到按钮
  - _Requirements: 2.7, 14.1_

## 4. 首页实现

- [ ] 4.1 创建首页基础结构
  - 实现 `src/app/page.tsx`
  - 动态问候语显示
  - 响应式布局（Mobile First）
  - _Requirements: 2.1, 9.1, 9.2_

- [ ] 4.2 实现 3D 倾斜英雄卡片组件
  - 创建 `src/components/home/HeroCard.tsx`
  - 鼠标/触摸移动时的透视变换
  - 光晕叠加效果
  - 时代徽章渐变
  - _Requirements: 2.2_

- [ ] 4.3 编写属性测试：英雄卡片数据完整性
  - **Property 3: Hero Card Data Completeness**
  - **Validates: Requirements 3.3**

- [ ] 4.4 实现功能网格组件
  - 创建 `src/components/home/FeatureGrid.tsx`
  - 2x2 网格布局（AI Chat, Knowledge Graph, Spark Prairie, Red Heritage）
  - 卡片悬停动画效果
  - _Requirements: 2.4_

- [ ] 4.5 实现英雄画廊横向滚动组件
  - 创建 `src/components/home/HeroGalleryScroll.tsx`
  - 水平滚动展示英雄卡片
  - 平滑滚动动画
  - _Requirements: 2.5_

- [ ] 4.6 实现学习统计卡片组件
  - 创建 `src/components/home/StatsCard.tsx`
  - 显示连续天数、掌握卡片数、AI 对话次数
  - _Requirements: 2.6_

- [ ] 4.7 实现每日签到模态框
  - 创建 `src/components/shared/DailySignModal.tsx`
  - 显示今日名言
  - 签到成功动画
  - _Requirements: 2.7, 2.8_

## 5. Checkpoint - 确保所有测试通过
- Ensure all tests pass, ask the user if questions arise.

## 6. 英雄长廊页面

- [ ] 6.1 创建英雄长廊页面
  - 实现 `src/app/hero-gallery/page.tsx`
  - 时代筛选标签页（全部/革命时期/建设时期/改革时期/新时代）
  - _Requirements: 3.1_

- [ ] 6.2 实现英雄筛选组件
  - 创建 `src/components/hero/HeroFilter.tsx`
  - Tabs 组件实现时代切换
  - _Requirements: 3.2_

- [ ] 6.3 编写属性测试：时代筛选
  - **Property 2: Era-based Hero Filtering**
  - **Validates: Requirements 3.1, 3.2**

- [ ] 6.4 实现英雄画廊卡片组件
  - 创建 `src/components/hero/HeroCard.tsx`
  - 显示头像、姓名、年份、头衔、简介
  - 淡入动画效果
  - _Requirements: 3.3, 3.4, 3.5_

## 7. 英雄详情页面

- [ ] 7.1 创建英雄详情页面
  - 实现 `src/app/hero/[id]/page.tsx`
  - 动态路由获取英雄 ID
  - _Requirements: 4.1_

- [ ] 7.2 实现英雄详情组件
  - 创建 `src/components/hero/HeroDetail.tsx`
  - 显示完整传记、主要事迹、名言
  - 头像突出显示，时代徽章
  - 丰富的排版层级
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

## 8. AI 对话页面

- [ ] 8.1 创建 AI 对话页面
  - 实现 `src/app/ai-chat/page.tsx`
  - 聊天界面布局
  - _Requirements: 5.1_

- [ ] 8.2 实现聊天气泡组件
  - 创建 `src/components/chat/ChatBubble.tsx`
  - 用户和 AI 消息样式区分
  - 打字指示器动画
  - 时间戳显示
  - _Requirements: 5.1, 5.3_

- [ ] 8.3 实现聊天输入组件
  - 创建 `src/components/chat/ChatInput.tsx`
  - 输入框和发送按钮
  - 加载状态显示
  - _Requirements: 5.6_

- [ ] 8.4 实现英雄选择器模态框
  - 创建 `src/components/chat/HeroSelector.tsx`
  - 网格布局展示可选英雄
  - 支持默认模式和角色扮演模式切换
  - _Requirements: 5.2, 5.7_

- [ ] 8.5 实现聊天历史持久化
  - 在 localStorage 中保存聊天记录
  - 页面加载时恢复历史
  - _Requirements: 5.5_

- [ ] 8.6 编写属性测试：聊天历史持久化往返
  - **Property 4: Chat History Persistence Round-Trip**
  - **Validates: Requirements 5.5**

## 9. Checkpoint - 确保所有测试通过
- Ensure all tests pass, ask the user if questions arise.

## 10. 星火燎原页面（学习/练习/对战）

- [ ] 10.1 创建星火燎原页面
  - 实现 `src/app/spark-prairie/page.tsx`
  - 三种模式切换（学习/练习/对战）
  - _Requirements: 6.1_

- [ ] 10.2 实现可翻转闪卡组件
  - 创建 `src/components/spark/FlashCard.tsx`
  - 3D 翻转动画
  - 滑动手势检测（左滑/右滑）
  - 掌握时的火花粒子效果
  - _Requirements: 6.2, 6.3, 6.4_

- [ ] 10.3 编写属性测试：卡片状态转换
  - **Property 5: Card Status Transition Consistency**
  - **Validates: Requirements 6.3, 6.4**

- [ ] 10.4 实现答题组件
  - 创建 `src/components/spark/QuizQuestion.tsx`
  - 多选题选项展示
  - 正确/错误反馈动画
  - 答案解析显示
  - _Requirements: 6.5, 6.6_

- [ ] 10.5 编写属性测试：答题验证
  - **Property 6: Quiz Answer Validation**
  - **Validates: Requirements 6.6**

- [ ] 10.6 实现对战竞技场组件
  - 创建 `src/components/spark/BattleArena.tsx`
  - 模拟对手匹配
  - 计时 PK 回合
  - 分数追踪和最终结果
  - _Requirements: 6.7, 6.8_

## 11. 红色珍藏页面

- [ ] 11.1 创建红色珍藏页面
  - 实现 `src/app/red-heritage/page.tsx`
  - 收藏展示和抽卡功能入口
  - _Requirements: 7.1_

- [ ] 11.2 实现信物卡片组件
  - 创建 `src/components/heritage/RelicCard.tsx`
  - 稀有度指示器（SSR/SR/R）
  - 锁定/解锁状态显示
  - _Requirements: 7.1, 7.2_

- [ ] 11.3 实现收藏网格组件
  - 创建 `src/components/heritage/CollectionGrid.tsx`
  - 收藏进度显示（已收集/总数）
  - _Requirements: 7.5_

- [ ] 11.4 实现抽卡组件
  - 创建 `src/components/heritage/GachaDrawer.tsx`
  - 神秘盒子动画
  - 基于稀有度的揭示效果
  - 稀有抽取时的彩带效果
  - _Requirements: 7.3, 7.4_

## 12. Checkpoint - 确保所有测试通过
- Ensure all tests pass, ask the user if questions arise.

## 13. 个人中心页面

- [ ] 13.1 创建个人中心页面
  - 实现 `src/app/profile/page.tsx`
  - 用户信息展示
  - _Requirements: 8.1_

- [ ] 13.2 实现学习统计展示
  - 显示连续天数、总天数、掌握卡片数、AI 对话次数
  - _Requirements: 8.2_

- [ ] 13.3 实现成就系统
  - 可解锁徽章展示
  - 徽章详情和进度模态框
  - _Requirements: 8.3, 8.5_

- [ ] 13.4 实现签到日历
  - 月度日历视图
  - 已签到日期标记
  - _Requirements: 8.4_

## 14. 知识图谱页面

- [ ] 14.1 创建知识图谱页面
  - 实现 `src/app/knowledge-graph/page.tsx`
  - 时间线和图谱两种视图模式
  - _Requirements: 12.1_

- [ ] 14.2 实现时间线视图
  - 按年份展示历史事件
  - 事件卡片（年份、标题、描述、图片）
  - 平滑滚动动画
  - _Requirements: 12.2, 12.3, 12.4_

- [ ] 14.3 实现图谱视图
  - 交互式节点可视化
  - 事件和人物的关联展示
  - _Requirements: 12.5_

## 15. 红色足迹页面

- [ ] 15.1 创建红色足迹页面
  - 实现 `src/app/red-footprints/page.tsx`
  - 地图展示和列表视图
  - _Requirements: 13.1_

- [ ] 15.2 实现地图组件
  - 集成地图 SDK（如高德地图或 Leaflet）
  - 红色历史地点标记
  - 点击标记显示详情
  - _Requirements: 13.2, 13.3_

- [ ] 15.3 实现地点列表组件
  - 按距离排序的地点列表
  - 导航按钮跳转外部地图
  - _Requirements: 13.4, 13.5_

## 16. 全局搜索功能

- [ ] 16.1 实现全局搜索组件
  - 创建 `src/components/search/GlobalSearch.tsx`
  - 搜索覆盖层
  - 防抖搜索（500ms 延迟）
  - _Requirements: 14.1, 14.2_

- [ ] 16.2 编写属性测试：搜索结果准确性
  - **Property 8: Search Result Accuracy**
  - **Validates: Requirements 14.2**

- [ ] 16.3 实现搜索结果展示
  - 热门搜索标签
  - 搜索结果列表
  - 空状态提示
  - _Requirements: 14.3, 14.4, 14.5_

## 17. 红色电台功能

- [ ] 17.1 创建红色电台页面
  - 实现 `src/app/red-radio/page.tsx`
  - 播放列表展示
  - 分类筛选
  - _Requirements: 15.1, 15.5_

- [ ] 17.2 实现音频播放器服务
  - 创建 `src/services/audioManager.ts`
  - 播放控制（播放/暂停/上一首/下一首）
  - 后台播放支持
  - _Requirements: 15.2, 15.4_

- [ ] 17.3 实现迷你播放器组件
  - 创建 `src/components/layout/MiniPlayer.tsx`
  - 底部固定迷你播放器
  - 当前播放信息和控制按钮
  - _Requirements: 15.3_

## 18. 错误处理与加载状态

- [ ] 18.1 实现骨架屏组件
  - 创建 `src/components/shared/Skeleton.tsx`
  - 各页面的加载骨架
  - _Requirements: 16.1_

- [ ] 18.2 实现错误边界
  - 全局错误捕获
  - 友好的错误提示界面
  - 重试按钮
  - _Requirements: 16.2, 16.3_

- [ ] 18.3 实现图片懒加载和回退
  - 图片加载失败时显示占位图
  - _Requirements: 16.4, 17.1_

- [ ] 18.4 实现 Toast 通知系统
  - 成功/错误/警告/信息类型
  - 自动消失和手动关闭
  - _Requirements: 16.5_

## 19. 性能优化

- [ ] 19.1 配置代码分割
  - 路由级别的代码分割
  - 动态导入大型组件
  - _Requirements: 17.2_

- [ ] 19.2 实现数据缓存
  - localStorage 缓存静态数据
  - 离线访问支持
  - _Requirements: 17.3_

- [ ] 19.3 优化动画性能
  - 使用 CSS transform 和 opacity
  - 避免布局抖动
  - 保持 60fps
  - _Requirements: 17.4_

- [ ] 19.4 配置加载优先级
  - 关键内容优先加载
  - 图片懒加载配置
  - _Requirements: 17.5_

## 20. Final Checkpoint - 确保所有测试通过
- Ensure all tests pass, ask the user if questions arise.
