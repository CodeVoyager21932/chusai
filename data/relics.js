// 红色信物数据
const relics = [
  // SSR 级别（4件）
  {
    id: 'relic_ssr_001',
    name: '南湖红船模型',
    rarity: 'SSR',
    image: '/images/relics/red-boat.png',
    related_hero_id: 'hero_001',
    story: '1921年7月，中国共产党第一次全国代表大会在嘉兴南湖的一艘游船上完成最后议程。',
    year: 1921
  },
  {
    id: 'relic_ssr_002',
    name: '井冈山八角楼油灯',
    rarity: 'SSR',
    image: '/images/relics/oil-lamp.png',
    related_hero_id: 'hero_001',
    story: '在这盏清油灯下，毛泽东同志写下了《中国的红色政权为什么能够存在？》等光辉著作。',
    year: 1928
  },
  {
    id: 'relic_ssr_003',
    name: '长征草鞋',
    rarity: 'SSR',
    image: '/images/relics/straw-shoes.png',
    related_hero_id: 'hero_005',
    story: '红军战士穿着这样的草鞋，走过了二万五千里长征路。',
    year: 1935
  },
  {
    id: 'relic_ssr_004',
    name: '开国大典礼炮',
    rarity: 'SSR',
    image: '/images/relics/cannon.png',
    related_hero_id: 'hero_001',
    story: '1949年10月1日，28响礼炮在天安门广场响起，象征着新中国的诞生。',
    year: 1949
  },
  // SR 级别（6件）
  {
    id: 'relic_sr_001',
    name: '雷锋日记',
    rarity: 'SR',
    image: '/images/relics/leifeng-diary.png',
    related_hero_id: 'hero_010',
    story: '雷锋在日记中写道："人的生命是有限的，可是，为人民服务是无限的。"',
    year: 1962
  },
  {
    id: 'relic_sr_002',
    name: '抗联冲锋号',
    rarity: 'SR',
    image: '/images/relics/bugle.png',
    related_hero_id: 'hero_008',
    story: '东北抗日联军使用的冲锋号，在白山黑水间吹响了抗日的号角。',
    year: 1938
  },
  {
    id: 'relic_sr_003',
    name: '延安窑洞煤油灯',
    rarity: 'SR',
    image: '/images/relics/cave-lamp.png',
    related_hero_id: 'hero_001',
    story: '在延安的窑洞里，共产党人在煤油灯下学习、工作、战斗。',
    year: 1942
  },
  {
    id: 'relic_sr_004',
    name: '焦裕禄的藤椅',
    rarity: 'SR',
    image: '/images/relics/rattan-chair.png',
    related_hero_id: 'hero_011',
    story: '焦裕禄同志因肝病疼痛，在藤椅上顶出了一个大窟窿。',
    year: 1964
  },
  {
    id: 'relic_sr_005',
    name: '红军军号',
    rarity: 'SR',
    image: '/images/relics/army-bugle.png',
    related_hero_id: 'hero_005',
    story: '红军军号是红军部队的重要通讯工具。',
    year: 1934
  },
  {
    id: 'relic_sr_006',
    name: '《新青年》杂志',
    rarity: 'SR',
    image: '/images/relics/new-youth.png',
    related_hero_id: 'hero_002',
    story: '《新青年》杂志是新文化运动的主要阵地。',
    year: 1915
  },
  // R 级别（10件）
  {
    id: 'relic_r_001',
    name: '红军斗笠',
    rarity: 'R',
    image: '/images/relics/bamboo-hat.png',
    related_hero_id: 'hero_005',
    story: '红军战士头戴斗笠，在井冈山上开展游击战争。',
    year: 1928
  },
  {
    id: 'relic_r_002',
    name: '红缨枪',
    rarity: 'R',
    image: '/images/relics/red-tassel-spear.png',
    related_hero_id: 'hero_006',
    story: '抗战时期，民兵们手持红缨枪，配合八路军打击日本侵略者。',
    year: 1940
  },
  {
    id: 'relic_r_003',
    name: '军用水壶',
    rarity: 'R',
    image: '/images/relics/canteen.png',
    related_hero_id: 'hero_005',
    story: '红军战士的军用水壶，陪伴他们走过雪山草地。',
    year: 1935
  },
  {
    id: 'relic_r_004',
    name: '红星帽徽',
    rarity: 'R',
    image: '/images/relics/red-star-badge.png',
    related_hero_id: 'hero_005',
    story: '红军帽徽上的红五星，象征着中国共产党领导下的工农武装。',
    year: 1927
  },
  {
    id: 'relic_r_005',
    name: '抗战传单',
    rarity: 'R',
    image: '/images/relics/leaflet.png',
    related_hero_id: 'hero_006',
    story: '抗战时期，共产党印制了大量传单，宣传抗日主张。',
    year: 1937
  }
];

// 稀有度配置
const rarityConfig = {
  SSR: {
    name: '传说',
    probability: 0.05,
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    glow: 'rgba(255, 107, 107, 0.5)'
  },
  SR: {
    name: '稀有',
    probability: 0.25,
    color: '#A78BFA',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
    glow: 'rgba(167, 139, 250, 0.5)'
  },
  R: {
    name: '普通',
    probability: 0.70,
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    glow: 'rgba(96, 165, 250, 0.5)'
  }
};

module.exports = {
  relics,
  rarityConfig
};
