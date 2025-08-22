import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  BookOpen, 
  Zap, 
  Star, 
  Crown,
  ArrowRight 
} from 'lucide-react-native';
import { DifficultyLevel } from '@/types/game';
import { StorageManager } from '@/utils/storage';
import { UserStats } from '@/types/game';

const difficultyLevels = [
  {
    level: DifficultyLevel.BEGINNER,
    title: 'Beginner',
    description: 'Addition & Subtraction (1-20)',
    icon: BookOpen,
    color: '#10B981',
    bgColor: '#ECFDF5',
    examples: ['8 + 5', '15 - 7', '12 + 9']
  },
  {
    level: DifficultyLevel.INTERMEDIATE,
    title: 'Intermediate', 
    description: 'Multiplication & Division (1-50)',
    icon: Zap,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    examples: ['6 × 4 + 2', '20 ÷ 5 - 1', '3 × 7 + 8']
  },
  {
    level: DifficultyLevel.ADVANCED,
    title: 'Advanced',
    description: 'BODMAS with Brackets (1-100)',
    icon: Star,
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    examples: ['(8 + 2) × 5', '24 ÷ (3 + 1)', '(15 - 5) × (4 + 2)']
  },
  {
    level: DifficultyLevel.EXPERT,
    title: 'Expert',
    description: 'Nested Brackets + Exponents',
    icon: Crown,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    examples: ['3² + (4 × 2)', '((6 + 2) × 3) ÷ 4', '5² - (3 × 4)']
  }
];

export default function PracticeScreen() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const loadUserStats = async () => {
      const stats = await StorageManager.getUserStats();
      setUserStats(stats);
    };
    loadUserStats();
  }, []);

  const startPractice = (difficulty: DifficultyLevel) => {
    router.push({
      pathname: '/game',
      params: { mode: 'practice', difficulty }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Level</Text>
        <Text style={styles.subtitle}>
          Master BODMAS step by step
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {difficultyLevels.map((level, index) => {
          const IconComponent = level.icon;
          
          return (
            <TouchableOpacity
              key={level.level}
              style={[styles.levelCard, { backgroundColor: level.bgColor }]}
              onPress={() => startPractice(level.level)}
            >
              <View style={styles.levelHeader}>
                <View style={[styles.iconContainer, { backgroundColor: level.color }]}>
                  <IconComponent size={28} color="#FFFFFF" />
                </View>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
                <ArrowRight size={24} color={level.color} />
              </View>

              <View style={styles.examplesContainer}>
                <Text style={styles.examplesLabel}>Examples:</Text>
                <View style={styles.examplesList}>
                  {level.examples.map((example, idx) => (
                    <View key={idx} style={styles.exampleChip}>
                      <Text style={[styles.exampleText, { color: level.color }]}>
                        {example}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          {userStats ? (
            <View style={styles.progressGrid}>
              <View style={styles.progressCard}>
                <Text style={styles.progressNumber}>{userStats.gamesPlayed}</Text>
                <Text style={styles.progressLabel}>Games Played</Text>
              </View>
              <View style={styles.progressCard}>
                <Text style={styles.progressNumber}>{userStats.bestStreak}</Text>
                <Text style={styles.progressLabel}>Best Streak</Text>
              </View>
              <View style={styles.progressCard}>
                <Text style={styles.progressNumber}>
                  {userStats.averageTime ? `${userStats.averageTime.toFixed(1)}s` : '0s'}
                </Text>
                <Text style={styles.progressLabel}>Avg Time</Text>
              </View>
              <View style={styles.progressCard}>
                <Text style={styles.progressNumber}>{userStats.level}</Text>
                <Text style={styles.progressLabel}>Level</Text>
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading your progress...</Text>
            </View>
          )}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  levelCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
    marginLeft: 16,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  examplesContainer: {
    marginTop: 8,
  },
  examplesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  exampleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});