// UserPreferences (用户偏好 - 本地存储)
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  soundEnabled: boolean;
  hintsEnabled: boolean;     // 是否启用提示系统
  autoSave: boolean;         // 自动保存游戏进度
  difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
  reduceAnimations: boolean; // 减少动画
  fontSize: 'small' | 'medium' | 'large';
  dataSaver: boolean;        // 数据节省模式 (减少AI调用)
}

// 用户数据 (未来扩展)
export interface User {
  id: string;
  username?: string;
  email?: string;
  avatar?: string;
  preferences: UserPreferences;
  gameStats: GameStats;
  createdAt: number;
  lastLogin: number;
}

// 游戏统计
export interface GameStats {
  totalGames: number;
  completedGames: number;
  abandonedGames: number;
  averageTimePerGame: number; // 平均游戏时间 (秒)
  averageQuestionsPerGame: number; // 平均提问次数
  favoriteCategory: string;
  totalPlayTime: number; // 总游戏时间 (秒)
  currentStreak: number; // 连续游玩天数
  bestStreak: number; // 最佳连续游玩天数
}