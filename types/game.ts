export interface Question {
  id: string;
  expression: string;
  answer: number;
  steps: SolutionStep[];
  difficulty: DifficultyLevel;
  timeLimit: number;
}

export interface SolutionStep {
  step: number;
  description: string;
  expression: string;
  highlight: string;
  result: string;
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum GameMode {
  PRACTICE = 'practice',
  CHALLENGE = 'challenge',
  LEADERBOARD = 'leaderboard',
  ZEN = 'zen'
}

export interface GameState {
  score: number;
  streak: number;
  lives: number;
  timeRemaining: number;
  multiplier: number;
  currentQuestion: Question | null;
  isGameActive: boolean;
  mode: GameMode;
  difficulty: DifficultyLevel;
}

export interface UserStats {
  totalScore: number;
  gamesPlayed: number;
  averageTime: number;
  bestStreak: number;
  weakAreas: string[];
  coins: number;
  level: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  duration?: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  difficulty: DifficultyLevel;
  timestamp: Date;
  country?: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  vibrationsEnabled: boolean;
  darkMode: boolean;
  notifications: boolean;
}