import { Achievement, UserStats } from '@/types/game';

export class AchievementManager {
  static checkAchievements(
    oldStats: UserStats,
    newStats: UserStats,
    gameScore: number,
    gameStreak: number
  ): Achievement[] {
    const unlockedAchievements: Achievement[] = [];

    // First game achievement
    if (oldStats.gamesPlayed === 0 && newStats.gamesPlayed > 0) {
      const achievement = newStats.achievements.find(a => a.id === 'first_game');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        unlockedAchievements.push(achievement);
      }
    }

    // Streak achievements
    if (gameStreak >= 5) {
      const achievement = newStats.achievements.find(a => a.id === 'streak_5');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        unlockedAchievements.push(achievement);
      }
    }

    if (gameStreak >= 10) {
      const achievement = newStats.achievements.find(a => a.id === 'streak_10');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        unlockedAchievements.push(achievement);
      }
    }

    // High score achievement
    if (gameScore >= 1000) {
      const achievement = newStats.achievements.find(a => a.id === 'score_1000');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        unlockedAchievements.push(achievement);
      }
    }

    return unlockedAchievements;
  }

  static getAchievementReward(achievementId: string): number {
    const rewards: Record<string, number> = {
      'first_game': 50,
      'streak_5': 100,
      'streak_10': 200,
      'score_1000': 300,
      'expert_master': 500
    };

    return rewards[achievementId] || 0;
  }
}