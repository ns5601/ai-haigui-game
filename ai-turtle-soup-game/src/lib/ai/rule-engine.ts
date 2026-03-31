import type { AnswerType } from '../../types/game';

export interface GameContext {
  storySurface?: string;
  confirmedFacts: string[];
  avoidedClues: string[];
  previousQuestions: string[];
  storyTheme: string;
  difficulty: string;
}

export class RuleEngine {
  private keywordPatterns = {
    yes: ['是', '死亡', '谋杀', '自杀', '凶手', '受害者', '死了', '杀死', '杀人', '凶手是'],
    no: ['否', '活着', '安全', '无辜', '意外', '没死', '幸存', '活着', '安全'],
    partial: ['可能', '或许', '部分', '有关联', '有点', '稍微', '某种程度上'],
    irrelevant: ['颜色', '天气', '无关', '不知道', '不相干', '没关系', '不相关']
  };

  /**
   * 评估问题并返回回答类型
   */
  evaluate(question: string, context: GameContext): AnswerType {
    // 基于关键词的简单规则匹配
    const lowerQuestion = question.toLowerCase();

    // 检查是否包含关键词
    for (const [type, keywords] of Object.entries(this.keywordPatterns)) {
      if (keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return type as AnswerType;
      }
    }

    // 检查问题长度 - 非常短的问题可能是无关的
    if (question.trim().length < 2) {
      return 'irrelevant';
    }

    // 检查是否重复问题
    if (context.previousQuestions.some(q =>
      q.toLowerCase() === lowerQuestion ||
      q.toLowerCase().includes(lowerQuestion) ||
      lowerQuestion.includes(q.toLowerCase())
    )) {
      return 'irrelevant';
    }

    // 根据上下文进行简单推理
    if (this.contextualEvaluation(question, context)) {
      return 'yes';
    }

    // 默认回答
    return 'irrelevant';
  }

  /**
   * 基于上下文的简单评估
   */
  private contextualEvaluation(question: string, context: GameContext): boolean {
    const lowerQuestion = question.toLowerCase();

    // 如果问题包含已确认的事实，回答"是"
    for (const fact of context.confirmedFacts) {
      if (lowerQuestion.includes(fact.toLowerCase()) ||
          fact.toLowerCase().includes(lowerQuestion)) {
        return true;
      }
    }

    // 如果问题包含需要避免的线索，回答"否"
    for (const clue of context.avoidedClues) {
      if (lowerQuestion.includes(clue.toLowerCase()) ||
          clue.toLowerCase().includes(lowerQuestion)) {
        return false;
      }
    }

    // 根据故事主题进行简单判断
    if (context.storyTheme.includes('谋杀') && lowerQuestion.includes('凶手')) {
      return true;
    }

    if (context.storyTheme.includes('自杀') && lowerQuestion.includes('自杀')) {
      return true;
    }

    return false;
  }
}