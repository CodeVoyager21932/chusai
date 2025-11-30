import { Hero } from '@/types/models';

// AI 服务配置
interface AIConfig {
  provider: 'openai' | 'qianwen' | 'mock';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

// 默认配置 - 可以通过环境变量覆盖
const defaultConfig: AIConfig = {
  provider: (process.env.NEXT_PUBLIC_AI_PROVIDER as AIConfig['provider']) || 'mock',
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
  baseUrl: process.env.NEXT_PUBLIC_AI_BASE_URL,
  model: process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-3.5-turbo',
};

// 系统提示词
const getSystemPrompt = (hero?: Hero | null): string => {
  if (hero) {
    return `你现在扮演${hero.name}，${hero.title}。
背景信息：${hero.biography}
主要事迹：${hero.main_deeds.join('；')}
名言：${hero.famous_quotes.join('；')}

请以${hero.name}的身份和口吻回答用户的问题，保持角色一致性。
回答要简洁、有教育意义，体现革命精神和爱国情怀。
如果用户问的问题与你的历史背景不相关，可以适当引导到相关话题。`;
  }
  
  return `你是"星火同志"，一个专注于红色教育和党史学习的AI助手。
你的职责是：
1. 帮助用户了解中国共产党的历史和革命先烈的事迹
2. 解答关于党史、革命历史、英雄人物的问题
3. 传播红色文化，弘扬革命精神
4. 用通俗易懂的语言讲述历史故事

回答要求：
- 内容准确、有教育意义
- 语言亲切、易于理解
- 适当引用历史事实和名人名言
- 保持积极向上的态度`;
};

// 模拟响应（当没有配置真实API时使用）
const getMockResponse = (message: string, hero?: Hero | null): string => {
  const responses = hero ? [
    `作为${hero.title}，我想告诉你：${hero.famous_quotes[0] || '我们要为人民服务。'}`,
    `这是个好问题。在我的经历中，${hero.main_deeds[0]}是我最难忘的事情。`,
    `我是${hero.name}，生于${hero.birth_year}年。${hero.biography.slice(0, 100)}...`,
    `关于这个问题，我认为最重要的是坚持信念，就像我在${hero.era}所做的那样。`,
  ] : [
    '这是一个很好的问题！让我来为你解答。党史学习是非常重要的，它能帮助我们了解中国共产党的光辉历程。',
    '你问得很好！在党的历史上，有很多值得我们学习的英雄人物和重要事件。',
    '作为星火同志，我很高兴能和你一起学习党史。你可以问我关于任何英雄人物或历史事件的问题。',
    '学习党史，传承红色基因，这是我们每个人的责任。让我们一起探索这段光辉的历史吧！',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// 调用 OpenAI API
async function callOpenAI(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIConfig
): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';
}

// 调用通义千问 API
async function callQianwen(
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  config: AIConfig
): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'qwen-turbo',
      input: {
        messages,
      },
      parameters: {
        max_tokens: 500,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Qianwen API error: ${response.status}`);
  }

  const data = await response.json();
  return data.output?.text || '抱歉，我暂时无法回答这个问题。';
}

// AI 服务类
class AIService {
  private config: AIConfig;
  private conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];

  constructor(config: AIConfig = defaultConfig) {
    this.config = config;
  }

  // 更新配置
  updateConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
  }

  // 重置对话历史
  resetConversation() {
    this.conversationHistory = [];
  }

  // 发送消息并获取回复
  async chat(message: string, hero?: Hero | null): Promise<string> {
    // 如果是模拟模式，直接返回模拟响应
    if (this.config.provider === 'mock' || !this.config.apiKey) {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      return getMockResponse(message, hero);
    }

    try {
      // 构建消息列表
      const systemPrompt = getSystemPrompt(hero);
      
      // 如果对话历史为空或切换了角色，重新初始化
      if (this.conversationHistory.length === 0 || 
          this.conversationHistory[0].content !== systemPrompt) {
        this.conversationHistory = [{ role: 'system', content: systemPrompt }];
      }

      // 添加用户消息
      this.conversationHistory.push({ role: 'user', content: message });

      // 限制历史长度，保留最近10轮对话
      if (this.conversationHistory.length > 21) {
        this.conversationHistory = [
          this.conversationHistory[0], // 保留系统提示
          ...this.conversationHistory.slice(-20),
        ];
      }

      // 调用对应的 API
      let response: string;
      
      switch (this.config.provider) {
        case 'openai':
          response = await callOpenAI(this.conversationHistory, this.config);
          break;
        case 'qianwen':
          response = await callQianwen(this.conversationHistory, this.config);
          break;
        default:
          response = getMockResponse(message, hero);
      }

      // 添加助手回复到历史
      this.conversationHistory.push({ role: 'assistant', content: response });

      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      // 出错时返回模拟响应
      return getMockResponse(message, hero);
    }
  }

  // 检查是否已配置真实 API
  isConfigured(): boolean {
    return this.config.provider !== 'mock' && !!this.config.apiKey;
  }

  // 获取当前提供商
  getProvider(): string {
    return this.config.provider;
  }
}

// 导出单例
export const aiService = new AIService();

// 导出类型
export type { AIConfig };
