import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, Achievement, LeaderboardEntry, GameSettings } from '@/types/game';

export class StorageManager {
  private static readonly KEYS = {
    USER_STATS: 'userStats',
    ACHIEVEMENTS: 'achievements',
    SETTINGS: 'gameSettings',
    DAILY_REWARD: 'dailyReward'
  };

  static async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.USER_STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }

    // Return default stats
    return {
      totalScore: 0,
      gamesPlayed: 0,
      averageTime: 0,
      bestStreak: 0,
      weakAreas: [],
      coins: 100, // Starting coins
      level: 1,
      achievements: this.getDefaultAchievements()
    };
  }

  static async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  static async updateUserStats(
    score: number, 
    streak: number, 
    timeSpent: number,
    coinsEarned: number
  ): Promise<UserStats> {
    const currentStats = await this.getUserStats();
    
    const updatedStats: UserStats = {
      ...currentStats,
      totalScore: currentStats.totalScore + score,
      gamesPlayed: currentStats.gamesPlayed + 1,
      averageTime: (currentStats.averageTime * currentStats.gamesPlayed + timeSpent) / (currentStats.gamesPlayed + 1),
      bestStreak: Math.max(currentStats.bestStreak, streak),
      coins: currentStats.coins + coinsEarned,
      level: Math.floor((currentStats.totalScore + score) / 1000) + 1
    };

    await this.saveUserStats(updatedStats);
    return updatedStats;
  }

  static async checkDailyReward(): Promise<boolean> {
    try {
      const lastReward = await AsyncStorage.getItem(this.KEYS.DAILY_REWARD);
      const today = new Date().toDateString();
      
      return lastReward !== today;
    } catch (error) {
      console.error('Error checking daily reward:', error);
      return false;
    }
  }

  static async claimDailyReward(): Promise<number> {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(this.KEYS.DAILY_REWARD, today);
      
      const stats = await this.getUserStats();
      stats.coins += 50; // Daily reward
      await this.saveUserStats(stats);
      
      return 50;
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      return 0;
    }
  }

  static async getSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Return default settings
    return {
      soundEnabled: true,
      vibrationsEnabled: true,
      darkMode: false,
      notifications: true
    };
  }

  static async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  static async resetUserStats(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.USER_STATS,
        this.KEYS.ACHIEVEMENTS,
        this.KEYS.DAILY_REWARD
      ]);
    } catch (error) {
      console.error('Error resetting user stats:', error);
    }
  }

  private static getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_game',
        title: 'Getting Started',
        description: 'Play your first game',
        icon: 'play',
        unlocked: false
      },
      {
        id: 'streak_5',
        title: 'On Fire!',
        description: 'Get 5 correct answers in a row',
        icon: 'flame',
        unlocked: false
      },
      {
        id: 'streak_10',
        title: 'Unstoppable',
        description: 'Get 10 correct answers in a row',
        icon: 'zap',
        unlocked: false
      },
      {
        id: 'score_1000',
        title: 'Math Prodigy',
        description: 'Score 1000 points in a single game',
        icon: 'trophy',
        unlocked: false
      },
      {
        id: 'expert_master',
        title: 'BODMAS Expert',
        description: 'Complete 10 Expert level questions',
        icon: 'crown',
        unlocked: false
      }
    ];
  }
}