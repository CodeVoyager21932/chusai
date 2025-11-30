import { QuizQuestion } from '@/types/models';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'quiz_001',
    question: '中国共产党第一次全国代表大会是在哪一年召开的？',
    options: ['1919年', '1920年', '1921年', '1922年'],
    correct_index: 2,
    explanation: '1921年7月23日，中国共产党第一次全国代表大会在上海召开，后转移到嘉兴南湖继续进行。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_002',
    question: '南昌起义发生在哪一年？',
    options: ['1926年', '1927年', '1928年', '1929年'],
    correct_index: 1,
    explanation: '1927年8月1日，南昌起义打响了武装反抗国民党反动派的第一枪，8月1日成为建军节。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_003',
    question: '遵义会议确立了谁在党中央和红军的领导地位？',
    options: ['周恩来', '朱德', '毛泽东', '刘少奇'],
    correct_index: 2,
    explanation: '1935年1月召开的遵义会议，确立了毛泽东在党中央和红军的领导地位，是党的历史上生死攸关的转折点。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_004',
    question: '中华人民共和国成立于哪一年？',
    options: ['1948年', '1949年', '1950年', '1951年'],
    correct_index: 1,
    explanation: '1949年10月1日，毛泽东主席在天安门城楼上庄严宣告中华人民共和国中央人民政府成立。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_005',
    question: '改革开放是从哪一年开始的？',
    options: ['1976年', '1977年', '1978年', '1979年'],
    correct_index: 2,
    explanation: '1978年12月，党的十一届三中全会召开，开启了改革开放和社会主义现代化建设新时期。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_006',
    question: '香港回归祖国是在哪一年？',
    options: ['1995年', '1996年', '1997年', '1998年'],
    correct_index: 2,
    explanation: '1997年7月1日，中国政府恢复对香港行使主权，香港回归祖国。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_007',
    question: '"八女投江"的故事发生在哪次战争中？',
    options: ['北伐战争', '抗日战争', '解放战争', '抗美援朝'],
    correct_index: 1,
    explanation: '1938年10月，东北抗日联军8名女战士为掩护大部队突围，在弹尽粮绝的情况下投入乌斯浑河壮烈牺牲。',
    difficulty: 'medium'
  },
  {
    id: 'quiz_008',
    question: '黄继光在哪场战役中壮烈牺牲？',
    options: ['淮海战役', '辽沈战役', '上甘岭战役', '平津战役'],
    correct_index: 2,
    explanation: '1952年10月，黄继光在上甘岭战役中用胸膛堵住敌人枪眼，壮烈牺牲。',
    difficulty: 'medium'
  },
  {
    id: 'quiz_009',
    question: '毛泽东主席题词"向雷锋同志学习"是在哪一年？',
    options: ['1962年', '1963年', '1964年', '1965年'],
    correct_index: 1,
    explanation: '1963年3月5日，毛泽东主席亲笔题词"向雷锋同志学习"。',
    difficulty: 'easy'
  },
  {
    id: 'quiz_010',
    question: '中国第一颗原子弹爆炸成功是在哪一年？',
    options: ['1962年', '1963年', '1964年', '1965年'],
    correct_index: 2,
    explanation: '1964年10月16日，中国第一颗原子弹爆炸成功，中国成为世界上第五个拥有核武器的国家。',
    difficulty: 'medium'
  }
];

export default quizQuestions;
