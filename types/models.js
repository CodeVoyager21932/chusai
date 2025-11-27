/**
 * 核心数据模型类型定义
 * 
 * 使用 JSDoc 为 JavaScript 代码提供类型提示
 * IDE 可以基于这些定义提供智能补全和类型检查
 * 
 * @module types/models
 */

/**
 * 英雄人物模型
 * @typedef {Object} Hero
 * @property {string} id - 唯一标识，格式：hero_001
 * @property {string} name - 姓名
 * @property {number} birth_year - 出生年份
 * @property {number} death_year - 逝世年份
 * @property {string} era - 所属时期（革命时期/建设时期/改革时期）
 * @property {string} title - 称号/头衔
 * @property {string} avatar - 头像云存储链接
 * @property {string} biography - 生平简介
 * @property {string[]} main_deeds - 主要事迹列表
 * @property {string[]} famous_quotes - 名言警句列表
 */

/**
 * 红色文物模型
 * @typedef {Object} Relic
 * @property {string} id - 唯一标识，格式：relic_ssr_001
 * @property {string} name - 文物名称
 * @property {('SSR'|'SR'|'R')} rarity - 稀有度等级
 * @property {string} image - 文物图片云存储链接
 * @property {string} related_hero_id - 关联英雄ID
 * @property {string} story - 文物背后的故事
 * @property {number} year - 相关历史年份
 */

/**
 * 稀有度配置
 * @typedef {Object} RarityConfig
 * @property {string} name - 稀有度名称（传说/稀有/普通）
 * @property {number} probability - 抽取概率（0-1之间）
 * @property {string} color - 主题色
 * @property {string} gradient - 渐变色CSS
 * @property {string} glow - 发光效果颜色
 */

/**
 * 学习卡片模型
 * @typedef {Object} Flashcard
 * @property {string} id - 唯一标识
 * @property {string} question - 问题/正面内容
 * @property {string} answer - 答案/背面内容
 * @property {string} category - 分类（党史/人物/事件）
 * @property {string} difficulty - 难度（easy/medium/hard）
 * @property {string[]} tags - 标签列表
 * @property {string} [image] - 可选的配图链接
 */

/**
 * 历史时间轴事件
 * @typedef {Object} TimelineEvent
 * @property {string} id - 唯一标识
 * @property {string} name - 事件名称
 * @property {string} date - 日期（YYYY-MM-DD）
 * @property {number} year - 年份
 * @property {string} location - 地点
 * @property {string[]} participants - 参与人物
 * @property {string} significance - 历史意义
 * @property {string} background - 历史背景
 * @property {string} [image] - 可选的事件图片
 */

/**
 * 每日金句模型
 * @typedef {Object} DailyQuote
 * @property {string} id - 唯一标识
 * @property {string} content - 金句内容
 * @property {string} quote - 引用原文
 * @property {string} author - 作者/出处
 * @property {string} date - 日期（YYYY-MM-DD）
 * @property {string} [image_url] - 可选的背景图片
 */

/**
 * 电台节目模型
 * @typedef {Object} RadioProgram
 * @property {string} id - 唯一标识
 * @property {string} title - 节目标题
 * @property {string} artist - 演讲者/艺术家
 * @property {number} duration - 时长（秒）
 * @property {string} coverUrl - 封面图片链接
 * @property {string} audioUrl - 音频文件链接
 * @property {string} description - 节目描述
 * @property {string} category - 分类
 */

/**
 * 用户信息模型
 * @typedef {Object} UserInfo
 * @property {string} openid - 微信用户唯一标识
 * @property {string} nickName - 昵称
 * @property {string} avatarUrl - 头像URL
 * @property {number} level - 用户等级
 * @property {number} exp - 经验值
 * @property {string[]} collected_relics - 已收集的文物ID列表
 * @property {string[]} mastered_cards - 已掌握的卡片ID列表
 * @property {number} continuous_days - 连续打卡天数
 * @property {number} total_study_time - 总学习时长（分钟）
 */

/**
 * 学习统计数据
 * @typedef {Object} StudyStats
 * @property {number} continuous_days - 连续打卡天数
 * @property {number} mastered_cards - 掌握卡片数量
 * @property {number} ai_chat_count - AI互动次数
 * @property {number} total_study_time - 总学习时长（分钟）
 * @property {number} relics_collected - 收集文物数量
 */

/**
 * AI 对话消息
 * @typedef {Object} ChatMessage
 * @property {('user'|'assistant'|'system')} role - 消息角色
 * @property {string} content - 消息内容
 * @property {number} [timestamp] - 时间戳
 */

/**
 * AI 对话历史记录
 * @typedef {Object} ChatHistory
 * @property {string} id - 记录ID
 * @property {string} user_id - 用户ID
 * @property {string} question - 用户提问
 * @property {string} answer - AI回答
 * @property {('default'|'hero')} mode - 对话模式
 * @property {string} [heroId] - 英雄模式下的英雄ID
 * @property {Date} timestamp - 时间戳
 */

/**
 * 云函数统一响应结构
 * @typedef {Object} CloudResponse
 * @property {number} code - 状态码（0=成功，-1=失败）
 * @property {*} data - 响应数据
 * @property {string} msg - 响应消息
 */

/**
 * PK 对战数据
 * @typedef {Object} PKBattle
 * @property {string} id - 对战ID
 * @property {string} challenger_id - 挑战者ID
 * @property {string} opponent_id - 对手ID
 * @property {Object} challenger_info - 挑战者信息
 * @property {string} challenger_info.nickName - 昵称
 * @property {string} challenger_info.avatarUrl - 头像
 * @property {Object} opponent_info - 对手信息
 * @property {string} opponent_info.nickName - 昵称
 * @property {string} opponent_info.avatarUrl - 头像
 * @property {number} challenger_score - 挑战者得分
 * @property {number} opponent_score - 对手得分
 * @property {string} status - 状态（pending/completed）
 * @property {Date} created_at - 创建时间
 */

/**
 * 徽章/成就模型
 * @typedef {Object} Badge
 * @property {string} id - 徽章ID
 * @property {string} name - 徽章名称
 * @property {string} description - 描述
 * @property {string} icon - 图标
 * @property {string} condition - 获得条件
 * @property {boolean} unlocked - 是否已解锁
 * @property {Date} [unlock_time] - 解锁时间
 */

/**
 * 缓存数据结构
 * @typedef {Object} CacheData
 * @property {*} data - 缓存的数据
 * @property {number} timestamp - 缓存时间戳
 */

// 导出空对象（仅用于类型定义）
module.exports = {};
