import { GameState, GameMode, DifficultyLevel, Question } from '@/types/game';
import { ExpressionGenerator } from './expressionGenerator';

export class GameEngine {
  private static readonly CORRECT_POINTS = 10;
  private static readonly WRONG_PENALTY = 5;
  private static readonly SPEED_BONUS = 5;
  private static readonly SPEED_THRESHOLD = 5000; // 5 seconds

  static initializeGame(mode: GameMode, difficulty: DifficultyLevel): GameState {
    const lives = mode === GameMode.CHALLENGE ? 3 : Infinity;
    const timeRemaining = mode === GameMode.CHALLENGE ? 60 : Infinity;

    return {
      score: 0,
      streak: 0,
      lives,
      timeRemaining,
      multiplier: 1,
      currentQuestion: ExpressionGenerator.generateQuestion(difficulty),
      isGameActive: true,
      mode,
      difficulty
    };
  }

  static processAnswer(
    gameState: GameState, 
    userAnswer: number, 
    timeSpent: number
  ): GameState {
    const isCorrect = userAnswer === gameState.currentQuestion?.answer;
    let newState = { ...gameState };

    if (isCorrect) {
      // Calculate points
      let points = this.CORRECT_POINTS;
      
      // Speed bonus
      if (timeSpent < this.SPEED_THRESHOLD) {
        points += this.SPEED_BONUS;
      }

      // Apply multiplier
      points *= newState.multiplier;

      newState.score += points;
      newState.streak += 1;

      // Update multiplier based on streak
      if (newState.streak >= 10) {
        newState.multiplier = 3;
      } else if (newState.streak >= 5) {
        newState.multiplier = 2;
      }
    } else {
      // Wrong answer
      newState.score = Math.max(0, newState.score - this.WRONG_PENALTY);
      newState.streak = 0;
      newState.multiplier = 1;

      if (newState.mode === GameMode.CHALLENGE) {
        newState.lives -= 1;
      }
    }

    // Check game over conditions
    if (newState.lives <= 0 || newState.timeRemaining <= 0) {
      newState.isGameActive = false;
    } else {
      // Generate next question
      newState.currentQuestion = ExpressionGenerator.generateQuestion(newState.difficulty);
    }

    return newState;
  }

  static updateTimer(gameState: GameState, deltaTime: number): GameState {
    if (gameState.mode !== GameMode.CHALLENGE || !gameState.isGameActive) {
      return gameState;
    }

    const newTimeRemaining = Math.max(0, gameState.timeRemaining - deltaTime);
    
    return {
      ...gameState,
      timeRemaining: newTimeRemaining,
      isGameActive: newTimeRemaining > 0 && gameState.lives > 0
    };
  }

  static getScoreMultiplier(streak: number): number {
    if (streak >= 10) return 3;
    if (streak >= 5) return 2;
    return 1;
  }

  static calculateCoinsEarned(score: number, difficulty: DifficultyLevel): number {
    const baseCoins = Math.floor(score / 100);
    const difficultyMultiplier = {
      [DifficultyLevel.BEGINNER]: 1,
      [DifficultyLevel.INTERMEDIATE]: 1.5,
      [DifficultyLevel.ADVANCED]: 2,
      [DifficultyLevel.EXPERT]: 3
    };

    return Math.floor(baseCoins * difficultyMultiplier[difficulty]);
  }
}