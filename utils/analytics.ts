export interface GameAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  averageTime: number;
  difficulty: string;
  mode: string;
  hintsUsed: number;
  powerUpsUsed: string[];
}

export class AnalyticsManager {
  private static sessions: Map<string, GameAnalytics> = new Map();

  static startSession(mode: string, difficulty: string): string {
    const sessionId = Math.random().toString(36).substr(2, 9);
    
    const session: GameAnalytics = {
      sessionId,
      startTime: new Date(),
      score: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      averageTime: 0,
      difficulty,
      mode,
      hintsUsed: 0,
      powerUpsUsed: []
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  static updateSession(
    sessionId: string, 
    updates: Partial<GameAnalytics>
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
  }

  static endSession(sessionId: string): GameAnalytics | null {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      this.sessions.delete(sessionId);
      
      // In production, send to Firebase Analytics
      this.logToAnalytics(session);
      
      return session;
    }
    return null;
  }

  private static logToAnalytics(session: GameAnalytics): void {
    // Mock analytics logging - replace with Firebase Analytics in production
    console.log('Game Session Analytics:', {
      mode: session.mode,
      difficulty: session.difficulty,
      score: session.score,
      accuracy: session.questionsAnswered > 0 ? 
        (session.correctAnswers / session.questionsAnswered) * 100 : 0,
      sessionDuration: session.endTime ? 
        session.endTime.getTime() - session.startTime.getTime() : 0,
      hintsUsed: session.hintsUsed,
      powerUpsUsed: session.powerUpsUsed.length
    });
  }

  static getWeakAreas(sessions: GameAnalytics[]): string[] {
    // Analyze common mistakes and return weak operation types
    // This would be more sophisticated in production
    const weakAreas: string[] = [];
    
    sessions.forEach(session => {
      const accuracy = session.questionsAnswered > 0 ? 
        (session.correctAnswers / session.questionsAnswered) * 100 : 0;
      
      if (accuracy < 60) {
        switch (session.difficulty) {
          case 'beginner':
            weakAreas.push('Basic Operations');
            break;
          case 'intermediate':
            weakAreas.push('Multiplication & Division');
            break;
          case 'advanced':
            weakAreas.push('Brackets & Order');
            break;
          case 'expert':
            weakAreas.push('Complex BODMAS');
            break;
        }
      }
    });

    return [...new Set(weakAreas)];
  }
}