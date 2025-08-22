import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Trophy, 
  Medal, 
  Award,
  Crown,
  Filter
} from 'lucide-react-native';
import { DifficultyLevel, LeaderboardEntry } from '@/types/game';

// Mock leaderboard data - in production this would come from Firebase
const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    playerName: 'MathWizard',
    score: 2450,
    difficulty: DifficultyLevel.EXPERT,
    timestamp: new Date(),
    country: 'IN'
  },
  {
    id: '2', 
    playerName: 'NumberNinja',
    score: 2180,
    difficulty: DifficultyLevel.EXPERT,
    timestamp: new Date(),
    country: 'US'
  },
  {
    id: '3',
    playerName: 'BodmasKing',
    score: 1950,
    difficulty: DifficultyLevel.ADVANCED,
    timestamp: new Date(),
    country: 'UK'
  },
  {
    id: '4',
    playerName: 'EquationMaster',
    score: 1720,
    difficulty: DifficultyLevel.ADVANCED,
    timestamp: new Date(),
    country: 'CA'
  },
  {
    id: '5',
    playerName: 'CalcGenius',
    score: 1580,
    difficulty: DifficultyLevel.INTERMEDIATE,
    timestamp: new Date(),
    country: 'AU'
  }
];

export default function LeaderboardScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EXPERT);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedDifficulty]);

  const loadLeaderboard = () => {
    // Filter by difficulty and sort by score
    const filtered = mockLeaderboardData
      .filter(entry => entry.difficulty === selectedDifficulty)
      .sort((a, b) => b.score - a.score);
    
    setLeaderboardData(filtered);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown size={24} color="#F59E0B" />;
      case 2:
        return <Trophy size={24} color="#9CA3AF" />;
      case 3:
        return <Medal size={24} color="#CD7C2F" />;
      default:
        return <Award size={24} color="#6B7280" />;
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return '#10B981';
      case DifficultyLevel.INTERMEDIATE:
        return '#F59E0B';
      case DifficultyLevel.ADVANCED:
        return '#8B5CF6';
      case DifficultyLevel.EXPERT:
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Global Rankings</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {Object.values(DifficultyLevel).map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterChip,
                selectedDifficulty === difficulty && styles.filterChipActive,
                { borderColor: getDifficultyColor(difficulty) }
              ]}
              onPress={() => setSelectedDifficulty(difficulty)}
            >
              <Text style={[
                styles.filterText,
                selectedDifficulty === difficulty && { color: getDifficultyColor(difficulty) }
              ]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {leaderboardData.length === 0 ? (
          <View style={styles.emptyState}>
            <Trophy size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No rankings yet</Text>
            <Text style={styles.emptyDescription}>
              Be the first to set a score in {selectedDifficulty} mode!
            </Text>
          </View>
        ) : (
          leaderboardData.map((entry, index) => (
            <View key={entry.id} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                {getRankIcon(index + 1)}
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{entry.playerName}</Text>
                <Text style={styles.playerCountry}>{entry.country}</Text>
              </View>

              <View style={styles.scoreContainer}>
                <Text style={styles.playerScore}>{entry.score.toLocaleString()}</Text>
                <Text style={styles.scoreLabel}>points</Text>
              </View>
            </View>
          ))
        )}

        <View style={styles.actionSection}>
          <Text style={styles.actionTitle}>Ready to compete?</Text>
          <TouchableOpacity 
            style={styles.challengeButton}
            onPress={() => router.push({
              pathname: '/game',
              params: { mode: 'challenge', difficulty: selectedDifficulty }
            })}
          >
            <Text style={styles.challengeButtonText}>Start Challenge</Text>
          </TouchableOpacity>
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
  filterContainer: {
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  playerCountry: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  challengeButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});