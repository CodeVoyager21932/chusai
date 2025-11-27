# 星火小程序前端

## 目录结构

```
miniprogram/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── ai-chat/       # AI对话页面
│   ├── knowledge-graph/  # 知识图谱页面
│   ├── card-learning/ # 卡片学习页面
│   ├── hero-gallery/  # 英雄长廊页面
│   ├── hero-detail/   # 英雄详情页面
│   └── profile/       # 个人中心页面
├── components/        # 组件目录
├── utils/            # 工具函数目录
│   ├── cache.js      # 缓存工具
│   └── error-handler.js  # 错误处理工具
├── images/           # 图片资源目录
├── styles/           # 样式文件目录
├── app.js            # 小程序逻辑
├── app.json          # 小程序配置
├── app.wxss          # 小程序全局样式
└── sitemap.json      # 站点地图配置
```

## 开发指南

### 1. 配置AppID

在 `project.config.json` 中修改 `appid` 为你的小程序AppID。

### 2. 配置云开发环境

在 `app.js` 中修改云开发环境ID：

```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云开发环境ID
  traceUser: true,
});
```

### 3. 开发调试

使用微信开发者工具打开本项目，即可开始开发调试。

## 页面说明

### 首页 (index)
- 显示用户信息和打卡按钮
- 展示今日英雄卡片
- 提供功能入口网格
- 显示学习统计数据

### AI对话 (ai-chat)
- 与AI讲解员进行对话
- 支持切换英雄对话模式
- 显示对话历史

### 知识图谱 (knowledge-graph)
- 展示党史知识图谱
- 支持节点点击查看详情
- 支持筛选和缩放

### 卡片学习 (card-learning)
- Tinder式卡片滑动学习
- 支持左滑/右滑标记
- 智能复习推送

### 英雄长廊 (hero-gallery)
- 展示英雄人物列表
- 支持按时代筛选
- 点击查看详情

### 个人中心 (profile)
- 显示用户信息
- 展示学习统计
- 显示成就徽章

## 注意事项

1. 所有云函数调用需要先部署云函数
2. 图片资源需要放在 `images/` 目录下
3. 使用缓存工具避免频繁请求云端数据
4. 错误处理使用统一的 `error-handler` 工具
