import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { User, Settings as SettingsIcon, Volume2, Smartphone, Moon, CircleHelp as HelpCircle, Star, Info, Shield, RotateCcw, Trophy } from 'lucide-react-native';
import { StorageManager } from '../../utils/storage';
import { UserStats } from '../../types/game';

export default function SettingsScreen() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationsEnabled, setVibrationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadUserStats();
    loadSettings();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await StorageManager.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await StorageManager.getSettings();
      setSoundEnabled(settings.soundEnabled);
      setVibrationsEnabled(settings.vibrationsEnabled);
      setDarkMode(settings.darkMode);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const settings = await StorageManager.getSettings();
      const updatedSettings = { ...settings, [key]: value };
      await StorageManager.saveSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update setting:', error);
    }
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
    updateSetting('soundEnabled', value);
  };

  const handleVibrationsToggle = (value: boolean) => {
    setVibrationsEnabled(value);
    updateSetting('vibrationsEnabled', value);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    updateSetting('darkMode', value);
  };

  const showProfileDetails = () => {
    if (!userStats) return;
    
    Alert.alert(
      'Player Profile',
      `Level: ${userStats.level}\nTotal Points: ${userStats.totalScore}\nGames Played: ${userStats.gamesPlayed}\nBest Streak: ${userStats.bestStreak}`,
      [{ text: 'OK' }]
    );
  };

  const showHowToPlay = () => {
    Alert.alert(
      'How to Play',
      'BODMAS is the order of operations:\n\nB - Brackets first\nO - Orders (powers/roots)\nD - Division\nM - Multiplication\nA - Addition\nS - Subtraction\n\nSolve expressions following this order!',
      [{ text: 'Got it!' }]
    );
  };

  const showRateApp = () => {
    Alert.alert(
      'Rate Our App',
      'Enjoying BODMAS Math Master? Please rate us on the app store!',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => console.log('Open app store') }
      ]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About',
      'BODMAS Math Master v1.0.0\n\nA fun way to practice order of operations!',
      [{ text: 'OK' }]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'We respect your privacy. This app stores data locally on your device only.',
      [{ text: 'OK' }]
    );
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageManager.resetUserStats();
              await loadUserStats();
              Alert.alert('Success', 'Progress has been reset.');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset progress.');
            }
          }
        }
      ]
    );
  };

  if (!userStats) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <TouchableOpacity style={styles.profileCard} onPress={showProfileDetails}>
        <View style={styles.profileIcon}>
          <User size={24} color="#4F46E5" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Math Student</Text>
          <Text style={styles.profileStats}>{userStats.totalScore} total points</Text>
        </View>
      </TouchableOpacity>

      {/* Game Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Volume2 size={20} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingSubtitle}>Play sounds for game events</Text>
            </View>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
            thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Smartphone size={20} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Vibrations</Text>
              <Text style={styles.settingSubtitle}>Haptic feedback for interactions</Text>
            </View>
          </View>
          <Switch
            value={vibrationsEnabled}
            onValueChange={handleVibrationsToggle}
            trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
            thumbColor={vibrationsEnabled ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Moon size={20} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Use dark theme</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
            thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={showHowToPlay}>
          <HelpCircle size={20} color="#666" />
          <Text style={styles.menuText}>How to Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={showRateApp}>
          <Star size={20} color="#666" />
          <Text style={styles.menuText}>Rate App</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={showAbout}>
          <Info size={20} color="#666" />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={showPrivacyPolicy}>
          <Shield size={20} color="#666" />
          <Text style={styles.menuText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={resetProgress}>
          <RotateCcw size={20} color="#EF4444" />
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Reset Progress</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievementItem}>
          <Trophy size={20} color="#F59E0B" />
          <Text style={styles.achievementText}>No recent achievements</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  achievementText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    fontStyle: 'italic',
  },
});