import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import { Question } from '@/types/game';

interface QuestionCardProps {
  question: Question;
  animatedValue?: Animated.Value;
}

export default function QuestionCard({ question, animatedValue }: QuestionCardProps) {
  const animatedStyle = animatedValue ? {
    transform: [{ scale: animatedValue }]
  } : {};

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.label}>Solve:</Text>
      <Text style={styles.expression}>{question.expression}</Text>
      <Text style={styles.equals}>=</Text>
      <Text style={styles.questionMark}>?</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  expression: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  equals: {
    fontSize: 24,
    color: '#6B7280',
    marginBottom: 8,
  },
  questionMark: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
});