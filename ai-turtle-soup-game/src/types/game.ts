// Story (海龟汤故事 - 完整元数据)
export interface Story {
  id: string;
  title: string;
  surface: string;           // 汤面 (故事开头)
  bottom: string;           // 汤底 (解决方案，客户端加密存储)
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;         // 分类: 'mystery', 'scifi', 'everyday', 'historical'
  tags: string[];           // 标签
  estimatedTime: number;    // 预估完成时间 (分钟)
  hints: string[];          // 渐进式提示数组
  author?: 'ai' | 'user' | 'curated'; // 故事来源
  rating?: number;          // 用户评分 1-5
  playCount: number;        // 游玩次数
  winRate?: number;         // 通关率 (0-1)
  createdAt: number;        // 创建时间戳
  updatedAt: number;        // 更新时间戳
  locale: 'zh-CN' | 'en-US'; // 语言
  version: number;          // 故事版本 (用于更新)
}

// GameSession (游戏会话 - 完整跟踪)
export interface GameSession {
  id: string;
  storyId: string;
  status: 'active' | 'completed' | 'abandoned' | 'paused';
  startTime: number;
  endTime?: number;
  questions: QuestionAnswer[]; // 问题-回答对
  hintsUsed: number;          // 使用提示次数
  solutionRevealed: boolean;  // 是否查看了汤底
  solved: boolean;            // 是否成功解决
  score?: number;             // 游戏得分
  localSaveId?: string;       // IndexedDB存储ID
  cloudSyncId?: string;       // 云同步ID (如果已同步)
  deviceInfo?: {             // 设备信息 (用于分析)
    userAgent: string;
    platform: string;
  };
}

// QuestionAnswer (问题回答对)
export interface QuestionAnswer {
  id: string;
  question: string;
  answer: 'yes' | 'no' | 'irrelevant' | 'partial' | 'pending' | 'error';
  timestamp: number;
  processingTime?: number;    // AI处理时间 (ms)
  confidence?: number;        // AI置信度 (0-1)
  source: 'ai' | 'rule-engine' | 'cache'; // 回答来源
  cached?: boolean;           // 是否来自缓存
  suggestion?: string;        // 重新提问建议
  reasoning?: string;         // AI推理过程
}

// AnswerType 类型别名
export type AnswerType = QuestionAnswer['answer'];