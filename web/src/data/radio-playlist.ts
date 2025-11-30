import { RadioProgram } from '@/types/models';

export const radioPlaylist: RadioProgram[] = [
  {
    id: 'radio_001',
    title: '雷锋的故事',
    artist: '中央人民广播电台',
    duration: 1800,
    coverUrl: '/images/radio/leifeng.jpg',
    audioUrl: '/audio/leifeng-story.mp3',
    description: '讲述雷锋同志的感人事迹，弘扬雷锋精神。',
    category: '英雄故事'
  },
  {
    id: 'radio_002',
    title: '长征组歌',
    artist: '中国人民解放军合唱团',
    duration: 2400,
    coverUrl: '/images/radio/long-march.jpg',
    audioUrl: '/audio/long-march-song.mp3',
    description: '用歌声重温红军长征的伟大历程。',
    category: '历史实况'
  },
  {
    id: 'radio_003',
    title: '焦裕禄精神',
    artist: '河南人民广播电台',
    duration: 1500,
    coverUrl: '/images/radio/jiaoyulu.jpg',
    audioUrl: '/audio/jiaoyulu-spirit.mp3',
    description: '讲述焦裕禄同志在兰考的感人事迹。',
    category: '英雄故事'
  },
  {
    id: 'radio_004',
    title: '开国大典实况录音',
    artist: '中央人民广播电台',
    duration: 3600,
    coverUrl: '/images/radio/founding.jpg',
    audioUrl: '/audio/founding-ceremony.mp3',
    description: '1949年10月1日开国大典珍贵录音。',
    category: '历史实况'
  },
  {
    id: 'radio_005',
    title: '党史故事100讲',
    artist: '中央党校',
    duration: 1200,
    coverUrl: '/images/radio/party-history.jpg',
    audioUrl: '/audio/party-history-100.mp3',
    description: '系统讲述中国共产党百年奋斗历程。',
    category: '党史故事'
  },
  {
    id: 'radio_006',
    title: '赵一曼家书',
    artist: '黑龙江人民广播电台',
    duration: 900,
    coverUrl: '/images/radio/zhaoyiman.jpg',
    audioUrl: '/audio/zhaoyiman-letter.mp3',
    description: '朗读赵一曼烈士写给儿子的遗书。',
    category: '英雄原声'
  },
  {
    id: 'radio_007',
    title: '井冈山精神',
    artist: '江西人民广播电台',
    duration: 1800,
    coverUrl: '/images/radio/jinggangshan.jpg',
    audioUrl: '/audio/jinggangshan-spirit.mp3',
    description: '讲述井冈山革命根据地的创建历程。',
    category: '党史故事'
  },
  {
    id: 'radio_008',
    title: '抗美援朝战歌',
    artist: '中国人民志愿军文工团',
    duration: 1200,
    coverUrl: '/images/radio/korea-war.jpg',
    audioUrl: '/audio/korea-war-song.mp3',
    description: '重温抗美援朝时期的经典歌曲。',
    category: '历史实况'
  }
];

export default radioPlaylist;
