/**
 * 资源路径配置文件
 * 
 * ⚠️ 重要提示：
 * 1. 请将 CLOUD_BASE 替换为你的云开发环境 ID
 * 2. 格式：cloud://your-env-id.xxxx/images
 * 3. 所有图片资源应上传至云存储对应目录
 * 
 * @typedef {Object} AssetConfig
 */

// TODO: 替换为实际的云存储环境 ID
const CLOUD_BASE = "cloud://your-env-id.xxxx/images";

/**
 * 全局资源路径配置
 * 消除硬编码，统一管理所有图片资源
 */
export const ASSETS = {
  /**
   * 底部导航栏图标
   * 注意：小程序 tabBar 配置暂不支持云存储路径，需使用本地路径
   */
  Tabs: {
    HOME: "/images/tabbar/home.png",
    HOME_ACTIVE: "/images/tabbar/home-active.png",
    PROFILE: "/images/tabbar/profile.png",
    PROFILE_ACTIVE: "/images/tabbar/profile-active.png"
  },

  /**
   * 英雄头像
   * Key 使用英雄 ID 的大写形式
   */
  Heroes: {
    HERO_001: `${CLOUD_BASE}/heroes/leifeng.png`,
    HERO_002: `${CLOUD_BASE}/heroes/jiaoyulu.png`,
    HERO_003: `${CLOUD_BASE}/heroes/lengyun.png`,
    HERO_004: `${CLOUD_BASE}/heroes/zhaoyiman.png`,
    HERO_005: `${CLOUD_BASE}/heroes/huangjigu.png`,
    HERO_006: `${CLOUD_BASE}/heroes/qiujiahe.png`,
    
    // 别名映射（兼容旧代码）
    LEIFENG: `${CLOUD_BASE}/heroes/leifeng.png`,
    JIAOYULU: `${CLOUD_BASE}/heroes/jiaoyulu.png`,
    LENGYUN: `${CLOUD_BASE}/heroes/lengyun.png`,
    ZHAOYIMAN: `${CLOUD_BASE}/heroes/zhaoyiman.png`,
    HUANGJIGU: `${CLOUD_BASE}/heroes/huangjigu.png`,
    QIUJIAHE: `${CLOUD_BASE}/heroes/qiujiahe.png`
  },

  /**
   * 功能入口图标
   */
  Icons: {
    AI_CHAT: `${CLOUD_BASE}/icons/ai_chat.png`,
    KNOWLEDGE_GRAPH: `${CLOUD_BASE}/icons/knowledge_graph.png`,
    FLASHCARDS: `${CLOUD_BASE}/icons/flashcards.png`,
    HERO_GALLERY: `${CLOUD_BASE}/icons/hero_gallery.png`,
    MYSTERY_BOX: `${CLOUD_BASE}/icons/mystery_box.png`,
    MUSEUM: `${CLOUD_BASE}/icons/museum.png`,
    PK_BATTLE: `${CLOUD_BASE}/icons/pk_battle.png`,
    RADIO: `${CLOUD_BASE}/icons/radio.png`,
    BIOGRAPHY: `${CLOUD_BASE}/icons/biography.png`,
    MEDAL: `${CLOUD_BASE}/icons/medal.png`,
    QUOTE: `${CLOUD_BASE}/icons/quote.png`
  },

  /**
   * 装饰元素
   */
  Decorations: {
    INK_STROKE: `${CLOUD_BASE}/decorations/ink-stroke.svg`
  },

  /**
   * 缺省图/占位图
   */
  Placeholders: {
    AVATAR: `${CLOUD_BASE}/default-avatar.png`,
    EMPTY: `${CLOUD_BASE}/empty-state.png`,
    DEFAULT_BG: `${CLOUD_BASE}/default-bg.jpg`
  },

  /**
   * AI 相关资源
   */
  AI: {
    XINGHUO_AVATAR: `${CLOUD_BASE}/xinghuo-avatar.png`
  },

  /**
   * 红色电台封面
   */
  Radio: {
    LEIFENG: `${CLOUD_BASE}/radio/leifeng.png`,
    FOUNDING: `${CLOUD_BASE}/radio/founding.png`,
    RED_BOAT: `${CLOUD_BASE}/radio/red-boat.png`,
    LONG_MARCH: `${CLOUD_BASE}/radio/long-march.png`,
    JIAOYULU: `${CLOUD_BASE}/radio/jiaoyulu.png`,
    EIGHT_WOMEN: `${CLOUD_BASE}/radio/eight-women.png`
  },

  /**
   * 红色文物图片
   */
  Relics: {
    RED_BOAT: `${CLOUD_BASE}/relics/red-boat.png`,
    OIL_LAMP: `${CLOUD_BASE}/relics/oil-lamp.png`,
    STRAW_SHOES: `${CLOUD_BASE}/relics/straw-shoes.png`,
    CANNON: `${CLOUD_BASE}/relics/cannon.png`,
    LEIFENG_DIARY: `${CLOUD_BASE}/relics/leifeng-diary.png`,
    BUGLE: `${CLOUD_BASE}/relics/bugle.png`,
    CAVE_LAMP: `${CLOUD_BASE}/relics/cave-lamp.png`,
    RATTAN_CHAIR: `${CLOUD_BASE}/relics/rattan-chair.png`,
    ARMY_BUGLE: `${CLOUD_BASE}/relics/army-bugle.png`,
    NEW_YOUTH: `${CLOUD_BASE}/relics/new-youth.png`,
    BAMBOO_HAT: `${CLOUD_BASE}/relics/bamboo-hat.png`,
    RED_TASSEL_SPEAR: `${CLOUD_BASE}/relics/red-tassel-spear.png`,
    CANTEEN: `${CLOUD_BASE}/relics/canteen.png`,
    RED_STAR_BADGE: `${CLOUD_BASE}/relics/red-star-badge.png`,
    LEAFLET: `${CLOUD_BASE}/relics/leaflet.png`
  },

  /**
   * 分享图片
   */
  Share: {
    PK_BATTLE: `${CLOUD_BASE}/share-pk.png`
  }
};

/**
 * 辅助函数：根据英雄 ID 获取头像路径
 * @param {string} heroId - 英雄 ID (如 'hero_001')
 * @returns {string} 头像 URL
 */
export function getHeroAvatar(heroId) {
  const key = heroId.toUpperCase().replace(/-/g, '_');
  return ASSETS.Heroes[key] || ASSETS.Placeholders.AVATAR;
}

/**
 * 辅助函数：根据图标名称获取路径
 * @param {string} iconName - 图标名称 (如 'ai_chat')
 * @returns {string} 图标 URL
 */
export function getIcon(iconName) {
  const key = iconName.toUpperCase();
  return ASSETS.Icons[key] || '';
}

/**
 * 辅助函数：根据文物 ID 获取图片路径
 * @param {string} relicId - 文物 ID
 * @returns {string} 文物图片 URL
 */
export function getRelicImage(relicId) {
  const key = relicId.toUpperCase().replace(/-/g, '_');
  return ASSETS.Relics[key] || ASSETS.Placeholders.EMPTY;
}

/**
 * 辅助函数：根据电台节目 ID 获取封面
 * @param {string} radioId - 电台节目 ID
 * @returns {string} 封面 URL
 */
export function getRadioCover(radioId) {
  const key = radioId.toUpperCase().replace(/-/g, '_');
  return ASSETS.Radio[key] || ASSETS.Placeholders.EMPTY;
}
