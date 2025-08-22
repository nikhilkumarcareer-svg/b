import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { SolutionStep } from '@/types/game';
import { CircleCheck as CheckCircle } from 'lucide-react-native';

interface SolutionStepsProps {
  steps: SolutionStep[];
  currentStep: number;
}

export default function SolutionSteps({ steps, currentStep }: SolutionStepsProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Solution Steps</Text>
      
      {steps.map((step, index) => (
        <View
          key={step.step}
          style={[
            styles.stepCard,
            index <= currentStep && styles.stepCardActive,
            index < currentStep && styles.stepCardCompleted
          ]}
        >
          <View style={styles.stepHeader}>
            <View style={[
              styles.stepNumber,
              index <= currentStep && styles.stepNumberActive,
              index < currentStep && styles.stepNumberCompleted
            ]}>
              {index < currentStep ? (
                <CheckCircle size={16} color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.stepNumberText,
                  index <= currentStep && styles.stepNumberTextActive
                ]}>
                  {step.step}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepDescription,
              index <= currentStep && styles.stepDescriptionActive
            ]}>
              {step.description}
            </Text>
          </View>
          
          {index <= currentStep && (
            <View style={styles.stepContent}>
              <Text style={styles.stepExpression}>
                {step.expression}
              </Text>
              <Text style={styles.stepResult}>
                = {step.result}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E5E7EB',
  },
  stepCardActive: {
    borderLeftColor: '#4F46E5',
    backgroundColor: '#F0F9FF',
  },
  stepCardCompleted: {
    borderLeftColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberActive: {
    backgroundColor: '#4F46E5',
  },
  stepNumberCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  stepNumberTextActive: {
    color: '#FFFFFF',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  stepDescriptionActive: {
    color: '#1F2937',
    fontWeight: '600',
  },
  stepContent: {
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  stepExpression: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#1F2937',
    textAlign: 'center',
  },
  stepResult: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
});