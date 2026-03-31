// AI相关类型定义

export interface AIRequest {
  question: string;
  storyId: string;
  context: GameContext;
  language: string;
}

export interface AIResponse {
  answer: 'yes' | 'no' | 'irrelevant' | 'partial';
  confidence: number;
  processingTime: number;
  cached: boolean;
}

export interface GameContext {
  confirmedFacts: string[];
  avoidedClues: string[];
  previousQuestions: string[];
  storyTheme: string;
  difficulty: string;
}

// AI服务配置
export interface AIConfig {
  provider: 'deepseek' | 'claude' | 'openai' | 'local';
  apiKey?: string;
  endpoint?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}