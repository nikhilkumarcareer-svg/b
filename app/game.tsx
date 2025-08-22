import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  Heart, 
  Clock, 
  Lightbulb,
  Zap,
  Target
} from 'lucide-react-native';
import { GameEngine } from '@/utils/gameEngine';
import { StorageManager } from '@/utils/storage';
import { GameState, GameMode, DifficultyLevel } from '@/types/game';

export default function GameScreen() {
  const params = useLocalSearchParams();
  const mode = params.mode as GameMode;
  const difficulty = params.difficulty as DifficultyLevel;

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (gameState?.mode === GameMode.CHALLENGE && gameState.isGameActive) {
      const timer = setInterval(() => {
        setGameState(prevState => {
          if (!prevState) return prevState;
          return GameEngine.updateTimer(prevState, 1);
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState?.mode, gameState?.isGameActive]);

  const initializeGame = () => {
    const initialState = GameEngine.initializeGame(mode, difficulty);
    setGameState(initialState);
    setStartTime(Date.now());
  };

  const submitAnswer = async () => {
    if (!gameState || !userAnswer.trim()) return;

    const timeSpent = Date.now() - startTime;
    const answer = parseInt(userAnswer);
    
    if (isNaN(answer)) {
      Alert.alert('Invalid Answer', 'Please enter a valid number');
      return;
    }

    const newState = GameEngine.processAnswer(gameState, answer, timeSpent);
    setGameState(newState);

    // Animate feedback
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    // Reset for next question
    setUserAnswer('');
    setStartTime(Date.now());
    setShowHint(false);
    setCurrentStepIndex(0);

    // Check if game ended
    if (!newState.isGameActive) {
      setTimeout(() => {
        handleGameEnd(newState);
      }, 1000);
    }
  };

  const handleGameEnd = async (finalState: GameState) => {
    const coinsEarned = GameEngine.calculateCoinsEarned(finalState.score, finalState.difficulty);
    
    await StorageManager.updateUserStats(
      finalState.score,
      finalState.streak,
      (Date.now() - startTime) / 1000,
      coinsEarned
    );

    router.replace({
      pathname: '/results',
      params: {
        score: finalState.score.toString(),
        streak: finalState.streak.toString(),
        coinsEarned: coinsEarned.toString(),
        difficulty: finalState.difficulty
      }
    });
  };

  const showNextStep = () => {
    if (!gameState?.currentQuestion) return;
    
    if (currentStepIndex < gameState.currentQuestion.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setShowHint(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameState) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = gameState.currentQuestion;
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No question available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.gameInfo}>
          <View style={styles.scoreContainer}>
            <Target size={16} color="#4F46E5" />
            <Text style={styles.score}>{gameState.score}</Text>
          </View>
          
          {gameState.mode === GameMode.CHALLENGE && (
            <>
              <View style={styles.timerContainer}>
                <Clock size={16} color="#EF4444" />
                <Text style={styles.timer}>
                  {formatTime(Math.floor(gameState.timeRemaining))}
                </Text>
              </View>
              
              <View style={styles.livesContainer}>
                {Array.from({ length: gameState.lives }).map((_, index) => (
                  <Heart key={index} size={16} color="#EF4444" fill="#EF4444" />
                ))}
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.streakContainer}>
          <Zap size={20} color="#F59E0B" />
          <Text style={styles.streakText}>Streak: {gameState.streak}</Text>
          {gameState.multiplier > 1 && (
            <Text style={styles.multiplier}>×{gameState.multiplier}</Text>
          )}
        </View>

        <Animated.View 
          style={[
            styles.questionContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <Text style={styles.questionLabel}>Solve:</Text>
          <Text style={styles.questionText}>{currentQuestion.expression}</Text>
        </Animated.View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.answerInput}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Your answer"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={submitAnswer}
            autoFocus
          />
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={submitAnswer}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.hintButton}
          onPress={showNextStep}
        >
          <Lightbulb size={20} color="#F59E0B" />
          <Text style={styles.hintButtonText}>
            {currentStepIndex < currentQuestion.steps.length ? 'Show Step' : 'Show Answer'}
          </Text>
        </TouchableOpacity>

        {currentStepIndex > 0 && currentQuestion.steps[currentStepIndex - 1] && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>
              Step {currentQuestion.steps[currentStepIndex - 1].step}:
            </Text>
            <Text style={styles.hintDescription}>
              {currentQuestion.steps[currentStepIndex - 1].description}
            </Text>
            <Text style={styles.hintExpression}>
              {currentQuestion.steps[currentStepIndex - 1].expression} = {currentQuestion.steps[currentStepIndex - 1].result}
            </Text>
          </View>
        )}

        {showHint && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText}>{currentQuestion.answer}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  livesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  gameArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  streakText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  multiplier: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  answerInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  hintButtonText: {
    color: '#92400E',
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 4,
  },
  hintDescription: {
    fontSize: 14,
    color: '#075985',
    marginBottom: 8,
  },
  hintExpression: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C4A6E',
    fontFamily: 'monospace',
  },
  answerContainer: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  answerLabel: {
    fontSize: 16,
    color: '#065F46',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#047857',
  },
});