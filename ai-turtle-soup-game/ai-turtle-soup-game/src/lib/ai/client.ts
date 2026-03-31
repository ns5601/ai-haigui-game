import { AnswerType } from '../../types/game';
import { RuleEngine, GameContext } from './rule-engine';
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
        cached: true
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
        cached: false
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
        cached: false
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
        cached: false
      };
    }
  }

  /**
   * 模拟AI API调用
   */
  private async callAI(request: AIRequest): Promise<{ answer: AnswerType; confidence: number }> {
    // 模拟网络延迟
    await this.delay(500 + Math.random() * 1000);

    // 模拟AI回答逻辑
    const question = request.question.toLowerCase();
    const context = request.context;

    // 基于问题内容和上下文的简单模拟逻辑
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

    // 根据上下文调整
    if (context.confirmedFacts.some(fact => question.includes(fact.toLowerCase()))) {
      answer = 'yes';
      confidence = 0.9;
    }

    return { answer, confidence };
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
   * 批量获取答案
   */
  async getAnswers(requests: AIRequest[]): Promise<AIResponse[]> {
    const results: AIResponse[] = [];
    for (const request of requests) {
      const result = await this.getAnswer(request);
      results.push(result);
    }
    return results;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 更新规则引擎关键词
   */
  updateRulePatterns(patterns: any): void {
    this.ruleEngine.updatePatterns(patterns);
  }
}