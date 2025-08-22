import { Question, DifficultyLevel, SolutionStep } from '@/types/game';

export class ExpressionGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static generateQuestion(difficulty: DifficultyLevel): Question {
    let expression: string;
    let timeLimit: number;

    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        expression = this.generateBeginnerExpression();
        timeLimit = 30;
        break;
      case DifficultyLevel.INTERMEDIATE:
        expression = this.generateIntermediateExpression();
        timeLimit = 45;
        break;
      case DifficultyLevel.ADVANCED:
        expression = this.generateAdvancedExpression();
        timeLimit = 60;
        break;
      case DifficultyLevel.EXPERT:
        expression = this.generateExpertExpression();
        timeLimit = 90;
        break;
      default:
        expression = this.generateBeginnerExpression();
        timeLimit = 30;
    }

    const steps = this.generateSolutionSteps(expression);
    const answer = this.evaluateExpression(expression);

    return {
      id: this.generateId(),
      expression,
      answer,
      steps,
      difficulty,
      timeLimit
    };
  }

  private static generateBeginnerExpression(): string {
    const operations = ['+', '-'];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    // Ensure no negative results
    if (op === '-' && num1 < num2) {
      return `${num2} ${op} ${num1}`;
    }
    return `${num1} ${op} ${num2}`;
  }

  private static generateIntermediateExpression(): string {
    const operations = ['+', '-', '*', '/'];
    const templates = [
      () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 20) + 1;
        const op1 = operations[Math.floor(Math.random() * operations.length)];
        const op2 = operations[Math.floor(Math.random() * operations.length)];
        return `${a} ${op1} ${b} ${op2} ${c}`;
      },
      () => {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        const c = a * Math.floor(Math.random() * 5) + 1; // Ensure clean division
        return `${a} * ${b} / ${Math.floor(c/a)}`;
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template();
  }

  private static generateAdvancedExpression(): string {
    const templates = [
      () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const c = Math.floor(Math.random() * 15) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        return `(${a} + ${b}) * ${c} - ${d}`;
      },
      () => {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 8) + 1;
        const c = Math.floor(Math.random() * 12) + 1;
        return `${a} * (${b} + ${c}) / ${b}`;
      },
      () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 8) + 1;
        const c = Math.floor(Math.random() * 6) + 1;
        const d = Math.floor(Math.random() * 10) + 1;
        return `(${a} + ${b}) * (${c} + ${d})`;
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template();
  }

  private static generateExpertExpression(): string {
    const templates = [
      () => {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 5) + 1;
        const c = Math.floor(Math.random() * 6) + 1;
        const d = Math.floor(Math.random() * 4) + 1;
        return `${a}^${2} + (${b} * ${c} - ${d})`;
      },
      () => {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 4) + 1;
        const c = Math.floor(Math.random() * 8) + 1;
        const d = Math.floor(Math.random() * 5) + 1;
        return `((${a} + ${b}) * ${c}) / (${d} + 1)`;
      },
      () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        const c = Math.floor(Math.random() * 6) + 1;
        return `${a}^${2} - (${b} * ${c})`;
      }
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template();
  }

  private static evaluateExpression(expression: string): number {
    try {
      // Handle exponents
      let expr = expression.replace(/(\d+)\^(\d+)/g, (match, base, exp) => {
        return Math.pow(parseInt(base), parseInt(exp)).toString();
      });

      // Safe evaluation using Function constructor
      return Function(`"use strict"; return (${expr})`)();
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return 0;
    }
  }

  private static generateSolutionSteps(expression: string): SolutionStep[] {
    const steps: SolutionStep[] = [];
    let currentExpression = expression;
    let stepNumber = 1;

    // Handle exponents first
    if (currentExpression.includes('^')) {
      const exponentMatch = currentExpression.match(/(\d+)\^(\d+)/);
      if (exponentMatch) {
        const [fullMatch, base, exp] = exponentMatch;
        const result = Math.pow(parseInt(base), parseInt(exp));
        steps.push({
          step: stepNumber++,
          description: `Calculate exponents first: ${base}^${exp}`,
          expression: currentExpression,
          highlight: fullMatch,
          result: result.toString()
        });
        currentExpression = currentExpression.replace(fullMatch, result.toString());
      }
    }

    // Handle brackets
    while (currentExpression.includes('(')) {
      const bracketContent = this.extractBracketContent(currentExpression);
      if (bracketContent) {
        const { content, fullBracket } = bracketContent;
        const result = this.evaluateExpression(content);
        steps.push({
          step: stepNumber++,
          description: `Solve brackets first: ${content}`,
          expression: currentExpression,
          highlight: fullBracket,
          result: result.toString()
        });
        currentExpression = currentExpression.replace(fullBracket, result.toString());
      }
    }

    // Handle multiplication and division (left to right)
    while (currentExpression.match(/\d+\s*[*/]\s*\d+/)) {
      const match = currentExpression.match(/(\d+)\s*([*/])\s*(\d+)/);
      if (match) {
        const [fullMatch, num1, operator, num2] = match;
        const result = operator === '*' 
          ? parseInt(num1) * parseInt(num2)
          : parseInt(num1) / parseInt(num2);
        
        steps.push({
          step: stepNumber++,
          description: `${operator === '*' ? 'Multiply' : 'Divide'}: ${num1} ${operator} ${num2}`,
          expression: currentExpression,
          highlight: fullMatch,
          result: result.toString()
        });
        currentExpression = currentExpression.replace(fullMatch, result.toString());
      }
    }

    // Handle addition and subtraction (left to right)
    while (currentExpression.match(/\d+\s*[+-]\s*\d+/)) {
      const match = currentExpression.match(/(\d+)\s*([+-])\s*(\d+)/);
      if (match) {
        const [fullMatch, num1, operator, num2] = match;
        const result = operator === '+' 
          ? parseInt(num1) + parseInt(num2)
          : parseInt(num1) - parseInt(num2);
        
        steps.push({
          step: stepNumber++,
          description: `${operator === '+' ? 'Add' : 'Subtract'}: ${num1} ${operator} ${num2}`,
          expression: currentExpression,
          highlight: fullMatch,
          result: result.toString()
        });
        currentExpression = currentExpression.replace(fullMatch, result.toString());
      }
    }

    return steps;
  }

  private static extractBracketContent(expression: string): { content: string; fullBracket: string } | null {
    const openIndex = expression.indexOf('(');
    if (openIndex === -1) return null;

    let depth = 0;
    let closeIndex = -1;

    for (let i = openIndex; i < expression.length; i++) {
      if (expression[i] === '(') depth++;
      if (expression[i] === ')') {
        depth--;
        if (depth === 0) {
          closeIndex = i;
          break;
        }
      }
    }

    if (closeIndex === -1) return null;

    const fullBracket = expression.substring(openIndex, closeIndex + 1);
    const content = expression.substring(openIndex + 1, closeIndex);

    return { content, fullBracket };
  }
}