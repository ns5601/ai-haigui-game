import type { AnswerType } from '../../types/game';
import { RuleEngine } from './rule-engine';
import type { GameContext } from './rule-engine';
import { AnswerCache } from './cache';

export interface AIRequest {
  question: string;
  storyId: string;
  context: GameContext;
  language?: string;
}

export interface AIResponse {
  answer: AnswerType;
  confidence: number;
  processingTime: number;
  source: 'ai' | 'rule-engine' | 'cache';
  cached: boolean;
}

export class AIService {
  private ruleEngine: RuleEngine;
  private cache: AnswerCache;
  private useMockAI: boolean;

  constructor(useMockAI: boolean = true) {
    this.ruleEngine = new RuleEngine();
    this.cache = new AnswerCache();
    this.useMockAI = useMockAI;
  }

  /**
   * 获取问题答案
   */
  async getAnswer(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    // 1. 检查缓存
    const cachedAnswer = this.cache.get(cacheKey);
    if (cachedAnswer) {
      return {
        answer: cachedAnswer,
        confidence: 0.9,
        processingTime: Date.now() - startTime,
        source: 'cache',
        cached: true,
      };
    }

    // 2. 本地规则引擎处理简单问题
    const ruleAnswer = this.ruleEngine.evaluate(request.question, request.context);
    if (ruleAnswer !== 'irrelevant') {
      this.cache.set(cacheKey, ruleAnswer);
      return {
        answer: ruleAnswer,
        confidence: 0.7,
        processingTime: Date.now() - startTime,
        source: 'rule-engine',
        cached: false,
      };
    }

    // 3. 模拟AI API调用 (或真实调用)
    try {
      const aiAnswer = await this.callAI(request);
      this.cache.set(cacheKey, aiAnswer.answer);

      return {
        answer: aiAnswer.answer,
        confidence: aiAnswer.confidence,
        processingTime: Date.now() - startTime,
        source: 'ai',
        cached: false,
      };
    } catch (error) {
      console.warn('AI调用失败，使用规则引擎后备:', error);

      // 使用规则引擎作为后备
      const fallbackAnswer = this.ruleEngine.evaluate(request.question, request.context);
      return {
        answer: fallbackAnswer,
        confidence: 0.5,
        processingTime: Date.now() - startTime,
        source: 'rule-engine',
        cached: false,
      };
    }
  }

  /**
   * AI API调用（根据useMockAI选择模拟或真实后端）
   */
  private async callAI(request: AIRequest): Promise<{ answer: AnswerType; confidence: number }> {
    if (this.useMockAI) {
      return this.callMockAI(request);
    } else {
      return this.callRealAI(request);
    }
  }

  /**
   * 调用真实后端AI API
   */
  private async callRealAI(request: AIRequest): Promise<{ answer: AnswerType; confidence: number }> {
    // 从环境变量获取API地址，如果没有设置则使用相对路径
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const apiUrl = `${apiBaseUrl}/api/chat`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: request.question,
        storyId: request.storyId,
        context: request.context,
        language: request.language || 'zh-CN',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 验证响应格式
    if (typeof data.answer === 'string' && typeof data.confidence === 'number') {
      return {
        answer: data.answer as AnswerType,
        confidence: data.confidence,
      };
    } else {
      throw new Error('Invalid response format from backend');
    }
  }

  /**
   * 模拟AI API调用
   */
  private async callMockAI(request: AIRequest): Promise<{ answer: AnswerType; confidence: number }> {
    // 模拟网络延迟
    await this.delay(500 + Math.random() * 1000);

    // 模拟AI回答逻辑
    const question = request.question.toLowerCase();
    let answer: AnswerType = 'irrelevant';
    let confidence = 0.8;

    // 简单规则：问题包含"是"或"否"关键词
    if (question.includes('是') || question.includes('对吗') || question.includes('是不是')) {
      answer = Math.random() > 0.5 ? 'yes' : 'no';
    } else if (question.includes('可能') || question.includes('或许')) {
      answer = 'partial';
      confidence = 0.6;
    } else if (question.length < 3) {
      answer = 'irrelevant';
      confidence = 0.9;
    }

    return {
      answer,
      confidence,
    };
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(request: AIRequest): string {
    return `${request.storyId}:${request.question}:${request.language || 'zh-CN'}`;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}