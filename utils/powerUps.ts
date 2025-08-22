import { PowerUp } from '@/types/game';

export class PowerUpManager {
  static readonly POWER_UPS: PowerUp[] = [
    {
      id: 'hint',
      name: 'Hint',
      description: 'Reveal the next step in solving the equation',
      cost: 10,
      icon: 'lightbulb'
    },
    {
      id: 'extra_time',
      name: 'Extra Time',
      description: 'Add 30 seconds to the timer',
      cost: 15,
      icon: 'clock',
      duration: 30
    },
    {
      id: 'double_points',
      name: 'Double Points',
      description: 'Double points for the next 3 questions',
      cost: 25,
      icon: 'zap',
      duration: 3
    },
    {
      id: 'skip_question',
      name: 'Skip Question',
      description: 'Skip the current question without penalty',
      cost: 20,
      icon: 'fast-forward'
    }
  ];

  static canAfford(powerUpId: string, coins: number): boolean {
    const powerUp = this.POWER_UPS.find(p => p.id === powerUpId);
    return powerUp ? coins >= powerUp.cost : false;
  }

  static purchasePowerUp(powerUpId: string, coins: number): { success: boolean; remainingCoins: number } {
    const powerUp = this.POWER_UPS.find(p => p.id === powerUpId);
    
    if (!powerUp || coins < powerUp.cost) {
      return { success: false, remainingCoins: coins };
    }

    return {
      success: true,
      remainingCoins: coins - powerUp.cost
    };
  }

  static getPowerUpById(id: string): PowerUp | undefined {
    return this.POWER_UPS.find(p => p.id === id);
  }
}