import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Coins, Target, Chrome as Home, RotateCcw } from 'lucide-react-native';

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  const score = parseInt(params.score as string) || 0;
  const streak = parseInt(params.streak as string) || 0;
  const coinsEarned = parseInt(params.coinsEarned as string) || 0;
  const difficulty = params.difficulty as string;

  const getPerformanceMessage = () => {
    if (score >= 1000) return "Outstanding! You're a BODMAS master!";
    if (score >= 500) return "Excellent work! Keep it up!";
    if (score >= 250) return "Good job! You're improving!";
    if (score >= 100) return "Nice effort! Practice makes perfect!";
    return "Keep practicing! You'll get there!";
  };

  const getScoreColor = () => {
    if (score >= 1000) return '#10B981';
    if (score >= 500) return '#8B5CF6';
    if (score >= 250) return '#F59E0B';
    return '#6B7280';
  };

  const playAgain = () => {
    router.replace({
      pathname: '/game',
      params: { mode: 'practice', difficulty }
    });
  };

  const goHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
      >
        <Trophy size={64} color="#FCD34D" />
        <Text style={styles.headerTitle}>Game Complete!</Text>
        <Text style={styles.headerSubtitle}>{getPerformanceMessage()}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Your Score</Text>
          <View style={[styles.scoreCard, { borderColor: getScoreColor() }]}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {score}
            </Text>
            <Text style={styles.scoreLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={24} color="#4F46E5" />
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>

            <View style={styles.statCard}>
              <Coins size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{coinsEarned}</Text>
              <Text style={styles.statLabel}>Coins Earned</Text>
            </View>

            <View style={styles.statCard}>
              <Star size={24} color="#8B5CF6" />
              <Text style={styles.statValue}>{difficulty}</Text>
              <Text style={styles.statLabel}>Difficulty</Text>
            </View>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>New Achievements</Text>
          {streak >= 5 && (
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Star size={24} color="#F59E0B" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>On Fire!</Text>
                <Text style={styles.achievementDescription}>
                  Got 5 correct answers in a row
                </Text>
              </View>
            </View>
          )}
          
          {score >= 1000 && (
            <View style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Trophy size={24} color="#10B981" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>Math Prodigy</Text>
                <Text style={styles.achievementDescription}>
                  Scored 1000 points in a single game
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.playAgainButton} onPress={playAgain}>
            <RotateCcw size={20} color="#FFFFFF" />
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={goHome}>
            <Home size={20} color="#4F46E5" />
            <Text style={styles.homeText}>Home</Text>
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 40,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4F46E5',
    gap: 8,
  },
  homeText: {
    color: '#4F46E5',
    fontSize: 18,
    fontWeight: 'bold',
  },
});