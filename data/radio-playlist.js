// 红色电台播放列表
const radioPlaylist = [
  {
    id: 'audio_001',
    title: '雷锋原声：为人民服务',
    artist: '雷锋',
    duration: 180,
    coverUrl: '/images/radio/leifeng.png',
    audioUrl: 'https://example.com/audio/leifeng.mp3', // 替换为实际音频URL
    description: '雷锋同志生前的珍贵录音，讲述为人民服务的故事。',
    category: '英雄原声'
  },
  {
    id: 'audio_002',
    title: '开国大典实况',
    artist: '历史录音',
    duration: 300,
    coverUrl: '/images/radio/founding.png',
    audioUrl: 'https://example.com/audio/founding.mp3',
    description: '1949年10月1日，毛主席在天安门城楼宣告新中国成立的历史时刻。',
    category: '历史实况'
  },
  {
    id: 'audio_003',
    title: '党史故事：南湖红船',
    artist: '党史讲解员',
    duration: 240,
    coverUrl: '/images/radio/red-boat.png',
    audioUrl: 'https://example.com/audio/red-boat.mp3',
    description: '讲述中国共产党诞生的故事，红船精神的由来。',
    category: '党史故事'
  },
  {
    id: 'audio_004',
    title: '长征路上的故事',
    artist: '党史讲解员',
    duration: 360,
    coverUrl: '/images/radio/long-march.png',
    audioUrl: 'https://example.com/audio/long-march.mp3',
    description: '红军长征途中的感人故事，展现革命先辈的坚定信念。',
    category: '党史故事'
  },
  {
    id: 'audio_005',
    title: '焦裕禄的故事',
    artist: '党史讲解员',
    duration: 280,
    coverUrl: '/images/radio/jiaoyulu.png',
    audioUrl: 'https://example.com/audio/jiaoyulu.mp3',
    description: '焦裕禄同志在兰考带领群众治理"三害"的感人事迹。',
    category: '英雄故事'
  },
  {
    id: 'audio_006',
    title: '八女投江',
    artist: '党史讲解员',
    duration: 220,
    coverUrl: '/images/radio/eight-women.png',
    audioUrl: 'https://example.com/audio/eight-women.mp3',
    description: '东北抗联八名女战士英勇就义的悲壮故事。',
    category: '英雄故事'
  }
];

// 获取播放列表
function getPlaylist() {
  return radioPlaylist;
}

// 根据分类获取
function getPlaylistByCategory(category) {
  return radioPlaylist.filter(item => item.category === category);
}

// 根据ID获取
function getAudioById(id) {
  return radioPlaylist.find(item => item.id === id);
}

module.exports = {
  radioPlaylist,
  getPlaylist,
  getPlaylistByCategory,
  getAudioById
};
