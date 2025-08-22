import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { DifficultyLevel } from '@/types/game';

const difficulties = [
  {
    level: DifficultyLevel.BEGINNER,
    title: 'Beginner',
    subtitle: 'Numbers 1-20',
    description: 'Perfect for starting your BODMAS journey',
    color: '#10B981',
    operations: ['Addition (+)', 'Subtraction (-)']
  },
  {
    level: DifficultyLevel.INTERMEDIATE,
    title: 'Intermediate',
    subtitle: 'Numbers 1-50', 
    description: 'Add multiplication and division',
    color: '#F59E0B',
    operations: ['Addition (+)', 'Subtraction (-)', 'Multiplication (×)', 'Division (÷)']
  },
  {
    level: DifficultyLevel.ADVANCED,
    title: 'Advanced',
    subtitle: 'Numbers 1-100',
    description: 'Full BODMAS with brackets',
    color: '#8B5CF6',
    operations: ['All Basic Operations', 'Brackets ( )', 'Order of Operations']
  },
  {
    level: DifficultyLevel.EXPERT,
    title: 'Expert',
    subtitle: 'Master Level',
    description: 'Nested brackets and exponents',
    color: '#EF4444',
    operations: ['All Operations', 'Nested Brackets', 'Exponents (²)', 'Complex BODMAS']
  }
];

export default function ModeSelectionScreen() {
  const startPractice = (difficulty: DifficultyLevel) => {
    router.push({
      pathname: '/game',
      params: { mode: 'practice', difficulty }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Difficulty</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Choose your difficulty level to start practicing BODMAS rules
        </Text>

        {difficulties.map((diff, index) => (
          <TouchableOpacity
            key={diff.level}
            style={styles.difficultyCard}
            onPress={() => startPractice(diff.level)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.levelBadge, { backgroundColor: diff.color }]}>
                <Text style={styles.levelNumber}>{index + 1}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{diff.title}</Text>
                <Text style={styles.cardSubtitle}>{diff.subtitle}</Text>
              </View>
            </View>
            
            <Text style={styles.cardDescription}>{diff.description}</Text>
            
            <View style={styles.operationsContainer}>
              <Text style={styles.operationsTitle}>What you'll practice:</Text>
              {diff.operations.map((op, idx) => (
                <View key={idx} style={styles.operationChip}>
                  <Text style={[styles.operationText, { color: diff.color }]}>
                    {op}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.startButton}>
              <Text style={[styles.startButtonText, { color: diff.color }]}>
                Start Practice
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 24,
  },
  operationsContainer: {
    marginBottom: 16,
  },
  operationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  operationChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  operationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});