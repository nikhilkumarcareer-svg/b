import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { Target, Zap } from 'lucide-react-native';

interface ScoreDisplayProps {
  score: number;
  streak: number;
  multiplier: number;
}

export default function ScoreDisplay({ score, streak, multiplier }: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.scoreItem}>
        <Target size={20} color="#4F46E5" />
        <Text style={styles.scoreText}>{score.toLocaleString()}</Text>
      </View>
      
      <View style={styles.scoreItem}>
        <Zap size={20} color="#F59E0B" />
        <Text style={styles.streakText}>{streak}</Text>
        {multiplier > 1 && (
          <Text style={styles.multiplier}>×{multiplier}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  multiplier: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});