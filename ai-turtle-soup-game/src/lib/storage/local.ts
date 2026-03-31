import type { GameSession } from '../../types/game';
import type { UserPreferences } from '../../types/user';

export class LocalStorageManager {
  private static readonly PREFIX = 'turtle_soup_';
  private static readonly KEYS = {
    PREFERENCES: 'preferences',
    GAME_SESSIONS: 'game_sessions',
    COMPLETED_STORIES: 'completed_stories',
  };

  // 用户偏好
  static getPreferences(): UserPreferences {
    const defaultPrefs: UserPreferences = {
      theme: 'auto',
      language: 'zh-CN',
      soundEnabled: true,
      hintsEnabled: true,
      autoSave: true,
      difficultyPreference: 'adaptive',
      reduceAnimations: false,
      fontSize: 'medium',
      dataSaver: false,
    };

    try {
      const data = localStorage.getItem(this.PREFIX + this.KEYS.PREFERENCES);
      return data ? { ...defaultPrefs, ...JSON.parse(data) } : defaultPrefs;
    } catch {
      return defaultPrefs;
    }
  }

  static savePreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(this.PREFIX + this.KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.error('保存用户偏好失败:', error);
    }
  }

  // 游戏会话
  static getGameSessions(): GameSession[] {
    try {
      const data = localStorage.getItem(this.PREFIX + this.KEYS.GAME_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveGameSession(session: GameSession): void {
    try {
      const sessions = this.getGameSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);

      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      localStorage.setItem(this.PREFIX + this.KEYS.GAME_SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('保存游戏会话失败:', error);
    }
  }

  static getGameSession(sessionId: string): GameSession | null {
    const sessions = this.getGameSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  static deleteGameSession(sessionId: string): void {
    try {
      const sessions = this.getGameSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(this.PREFIX + this.KEYS.GAME_SESSIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('删除游戏会话失败:', error);
    }
  }

  // 完成的故事
  static getCompletedStories(): string[] {
    try {
      const data = localStorage.getItem(this.PREFIX + this.KEYS.COMPLETED_STORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static markStoryCompleted(storyId: string): void {
    try {
      const completed = this.getCompletedStories();
      if (!completed.includes(storyId)) {
        completed.push(storyId);
        localStorage.setItem(this.PREFIX + this.KEYS.COMPLETED_STORIES, JSON.stringify(completed));
      }
    } catch (error) {
      console.error('标记故事完成失败:', error);
    }
  }

  static isStoryCompleted(storyId: string): boolean {
    const completed = this.getCompletedStories();
    return completed.includes(storyId);
  }

  // 游戏统计
  static getGameStats() {
    const sessions = this.getGameSessions();
    const completedSessions = sessions.filter(s => s.status === 'completed');

    return {
      totalGames: sessions.length,
      completedGames: completedSessions.length,
      abandonedGames: sessions.filter(s => s.status === 'abandoned').length,
      averageTimePerGame: completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => {
            const duration = (s.endTime || Date.now()) - s.startTime;
            return sum + duration;
          }, 0) / completedSessions.length / 1000
        : 0,
      averageQuestionsPerGame: completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + s.questions.length, 0) / completedSessions.length
        : 0,
    };
  }

  // 清理旧数据
  static cleanupOldSessions(maxAgeDays: number = 30): void {
    try {
      const cutoff = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
      const sessions = this.getGameSessions();
      const filtered = sessions.filter(s => s.startTime > cutoff);

      if (filtered.length !== sessions.length) {
        localStorage.setItem(this.PREFIX + this.KEYS.GAME_SESSIONS, JSON.stringify(filtered));
      }
    } catch (error) {
      console.error('清理旧会话失败:', error);
    }
  }

  // 导出数据
  static exportData(): string {
    const data = {
      preferences: this.getPreferences(),
      gameSessions: this.getGameSessions(),
      completedStories: this.getCompletedStories(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // 导入数据
  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);

      if (data.preferences) {
        localStorage.setItem(this.PREFIX + this.KEYS.PREFERENCES, JSON.stringify(data.preferences));
      }

      if (data.gameSessions) {
        localStorage.setItem(this.PREFIX + this.KEYS.GAME_SESSIONS, JSON.stringify(data.gameSessions));
      }

      if (data.completedStories) {
        localStorage.setItem(this.PREFIX + this.KEYS.COMPLETED_STORIES, JSON.stringify(data.completedStories));
      }

      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }

  // 清空所有数据
  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(this.PREFIX + key);
    });
  }
}