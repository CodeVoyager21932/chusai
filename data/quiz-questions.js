// 党史答题题库（基于卡片数据生成）
const quizQuestions = [
  {
    id: 'q001',
    question: '中国共产党第一次全国代表大会在哪一年召开？',
    options: ['1919年', '1921年', '1927年', '1949年'],
    correctIndex: 1,
    explanation: '1921年7月，中国共产党第一次全国代表大会在上海召开，标志着中国共产党的诞生。',
    difficulty: 'easy'
  },
  {
    id: 'q002',
    question: '长征途中，红军爬雪山过草地，历时多久？',
    options: ['半年', '一年', '两年', '三年'],
    correctIndex: 2,
    explanation: '红军长征历时两年（1934-1936），行程二万五千里。',
    difficulty: 'medium'
  },
  {
    id: 'q003',
    question: '新中国成立于哪一年？',
    options: ['1945年', '1949年', '1950年', '1954年'],
    correctIndex: 1,
    explanation: '1949年10月1日，中华人民共和国成立。',
    difficulty: 'easy'
  },
  {
    id: 'q004',
    question: '"为人民服务"是哪位英雄的座右铭？',
    options: ['董存瑞', '黄继光', '雷锋', '邱少云'],
    correctIndex: 2,
    explanation: '雷锋同志以"为人民服务"为人生信条，成为全国学习的榜样。',
    difficulty: 'easy'
  },
  {
    id: 'q005',
    question: '井冈山革命根据地是谁创建的？',
    options: ['毛泽东、朱德', '周恩来、刘少奇', '陈独秀、李大钊', '邓小平、陈云'],
    correctIndex: 0,
    explanation: '1927年，毛泽东、朱德等创建了井冈山革命根据地，开辟了"农村包围城市"的道路。',
    difficulty: 'medium'
  },
  {
    id: 'q006',
    question: '抗日战争胜利是在哪一年？',
    options: ['1943年', '1944年', '1945年', '1946年'],
    correctIndex: 2,
    explanation: '1945年8月15日，日本宣布无条件投降，中国抗日战争取得胜利。',
    difficulty: 'easy'
  },
  {
    id: 'q007',
    question: '"八女投江"的英雄事迹发生在哪里？',
    options: ['长江', '黄河', '乌斯浑河', '松花江'],
    correctIndex: 2,
    explanation: '1938年，以冷云为首的8名女战士在乌斯浑河畔英勇就义。',
    difficulty: 'hard'
  },
  {
    id: 'q008',
    question: '遵义会议确立了谁在党中央的领导地位？',
    options: ['陈独秀', '毛泽东', '周恩来', '朱德'],
    correctIndex: 1,
    explanation: '1935年遵义会议确立了毛泽东同志在党中央和红军的领导地位。',
    difficulty: 'medium'
  },
  {
    id: 'q009',
    question: '焦裕禄同志是哪个县的县委书记？',
    options: ['延安县', '井冈山县', '兰考县', '遵义县'],
    correctIndex: 2,
    explanation: '焦裕禄同志担任河南省兰考县县委书记，带领群众治理"三害"。',
    difficulty: 'medium'
  },
  {
    id: 'q010',
    question: '红军长征的起点是哪里？',
    options: ['江西瑞金', '陕西延安', '贵州遵义', '四川泸定'],
    correctIndex: 0,
    explanation: '1934年10月，中央红军从江西瑞金出发，开始长征。',
    difficulty: 'medium'
  },
  {
    id: 'q011',
    question: '"星星之火，可以燎原"出自哪篇文章？',
    options: ['《论持久战》', '《实践论》', '《星星之火，可以燎原》', '《矛盾论》'],
    correctIndex: 2,
    explanation: '这是毛泽东同志1930年写给林彪的一封信，后改为此标题。',
    difficulty: 'hard'
  },
  {
    id: 'q012',
    question: '黄继光在哪场战役中英勇牺牲？',
    options: ['淮海战役', '辽沈战役', '上甘岭战役', '平津战役'],
    correctIndex: 2,
    explanation: '1952年，黄继光在上甘岭战役中用身体堵住敌人枪眼，壮烈牺牲。',
    difficulty: 'medium'
  },
  {
    id: 'q013',
    question: '《新青年》杂志的创办者是谁？',
    options: ['李大钊', '陈独秀', '毛泽东', '鲁迅'],
    correctIndex: 1,
    explanation: '1915年，陈独秀在上海创办《新青年》杂志，成为新文化运动的主要阵地。',
    difficulty: 'hard'
  },
  {
    id: 'q014',
    question: '南昌起义发生在哪一年？',
    options: ['1925年', '1927年', '1929年', '1931年'],
    correctIndex: 1,
    explanation: '1927年8月1日，南昌起义打响了武装反抗国民党反动派的第一枪。',
    difficulty: 'medium'
  },
  {
    id: 'q015',
    question: '延安整风运动的主要内容是什么？',
    options: ['反对帝国主义', '反对封建主义', '反对主观主义、宗派主义、党八股', '反对官僚主义'],
    correctIndex: 2,
    explanation: '延安整风运动主要反对主观主义以整顿学风、反对宗派主义以整顿党风、反对党八股以整顿文风。',
    difficulty: 'hard'
  }
];

// 随机抽取题目
function getRandomQuestions(count = 5) {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 根据难度获取题目
function getQuestionsByDifficulty(difficulty, count = 5) {
  const filtered = quizQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, filtered.length));
}

module.exports = {
  quizQuestions,
  getRandomQuestions,
  getQuestionsByDifficulty
};
