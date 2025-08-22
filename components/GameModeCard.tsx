import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  backgroundColor: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function GameModeCard({
  title,
  description,
  icon: Icon,
  color,
  backgroundColor,
  onPress,
  disabled = false
}: GameModeCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        disabled && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Icon size={32} color="#FFFFFF" />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});