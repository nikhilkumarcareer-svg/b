import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  Play, 
  Brain, 
  Zap, 
  Trophy, 
  Gift,
  Coins,
  Target,
  Clock
} from 'lucide-react-native';
import { StorageManager } from '@/utils/storage';
import { UserStats } from '@/types/game';

export default function HomeScreen() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [canClaimDailyReward, setCanClaimDailyReward] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const stats = await StorageManager.getUserStats();
    const canClaim = await StorageManager.checkDailyReward();
    setUserStats(stats);
    setCanClaimDailyReward(canClaim);
  };

  const claimDailyReward = async () => {
    const reward = await StorageManager.claimDailyReward();
    if (reward > 0) {
      Alert.alert('Daily Reward!', `You earned ${reward} coins!`);
      loadUserData();
    }
  };

  const startGame = (mode: string, difficulty?: string) => {
    router.push({
      pathname: '/game',
      params: { mode, difficulty: difficulty || 'beginner' }
    });
  };

  if (!userStats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>BODMAS Math Master</Text>
          <Text style={styles.subtitle}>Level {userStats.level}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Coins size={20} color="#FCD34D" />
              <Text style={styles.statText}>{userStats.coins}</Text>
            </View>
            <View style={styles.statItem}>
              <Trophy size={20} color="#FCD34D" />
              <Text style={styles.statText}>{userStats.totalScore}</Text>
            </View>
            <View style={styles.statItem}>
              <Target size={20} color="#FCD34D" />
              <Text style={styles.statText}>{userStats.bestStreak}</Text>
            </View>
          </View>

          {canClaimDailyReward && (
            <TouchableOpacity style={styles.dailyReward} onPress={claimDailyReward}>
              <Gift size={20} color="#FFFFFF" />
              <Text style={styles.dailyRewardText}>Claim Daily Reward!</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Modes</Text>
          
          <TouchableOpacity 
            style={[styles.modeCard, styles.practiceCard]}
            onPress={() => router.push('/mode-selection')}
          >
            <Brain size={32} color="#4F46E5" />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Practice Mode</Text>
              <Text style={styles.modeDescription}>
                Learn at your own pace with no time pressure
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeCard, styles.challengeCard]}
            onPress={() => startGame('challenge')}
          >
            <Zap size={32} color="#EF4444" />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Challenge Mode</Text>
              <Text style={styles.modeDescription}>
                60-second rapid fire math challenge
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modeCard, styles.zenCard]}
            onPress={() => startGame('zen')}
          >
            <Clock size={32} color="#10B981" />
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Zen Mode</Text>
              <Text style={styles.modeDescription}>
                Peaceful practice without distractions
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStats}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatNumber}>{userStats.gamesPlayed}</Text>
              <Text style={styles.quickStatLabel}>Games Played</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatNumber}>
                {userStats.averageTime ? `${userStats.averageTime.toFixed(1)}s` : '0s'}
              </Text>
              <Text style={styles.quickStatLabel}>Avg Time</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatNumber}>
                {userStats.achievements.filter(a => a.unlocked).length}
              </Text>
              <Text style={styles.quickStatLabel}>Achievements</Text>
            </View>
          </View>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dailyReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  dailyRewardText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  practiceCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  challengeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  zenCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  modeContent: {
    marginLeft: 16,
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickStatCard: {
    flex: 1,
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
  quickStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});