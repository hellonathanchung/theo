import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';
import { Contraction, ContractionAnalysis } from '../types';
import { storageService } from '../services/storageService';
import { analysisService } from '../services/analysisService';
import { notificationService } from '../services/notificationService';

export const HomeScreen: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [contractionStartTime, setContractionStartTime] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<ContractionAnalysis | null>(null);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<ContractionAnalysis | null>(null);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    loadContractions();
    notificationService.initialize();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadContractions();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadContractions = async () => {
    const saved = await storageService.getContractions();
    setContractions(saved);
    const newAnalysis = analysisService.analyzeContractions(saved);
    setAnalysis(newAnalysis);

    // Alert if just crossed into time to go
    if (
      newAnalysis?.isTimeToGo &&
      lastAnalysis &&
      !lastAnalysis.isTimeToGo
    ) {
      await notificationService.sendLaborAlert(newAnalysis.averageInterval);
    }

    if (
      newAnalysis &&
      lastAnalysis &&
      newAnalysis.averageInterval < 600 &&
      lastAnalysis.averageInterval >= 600
    ) {
      await notificationService.sendQuickeningAlert();
    }

    setLastAnalysis(newAnalysis);
  };

  const handleStartContraction = () => {
    setIsTracking(true);
    setContractionStartTime(Date.now());
    pulseAnimation();
  };

  const handleEndContraction = async () => {
    setIsTracking(false);
    fadeAnim.setValue(1);

    if (contractionStartTime) {
      const endTime = Date.now();
      const duration = (endTime - contractionStartTime) / 1000;

      const newContraction: Contraction = {
        id: Date.now().toString(),
        startTime: contractionStartTime,
        endTime,
        duration
      };

      await storageService.saveContraction(newContraction);
      await notificationService.sendContractionReminder(duration);
      await loadContractions();
      setContractionStartTime(null);
    }
  };

  const pulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const getBackgroundColor = () => {
    if (!analysis) return theme.colors.background;
    
    const urgency = analysisService.getUrgencyLevel(analysis);
    switch (urgency) {
      case 'go':
        return theme.colors.danger;
      case 'quickening':
        return theme.colors.warning;
      case 'monitor':
        return theme.colors.primary;
      default:
        return theme.colors.background;
    }
  };

  const getStatusMessage = () => {
    if (!analysis) return 'No contractions tracked yet';
    
    const urgency = analysisService.getUrgencyLevel(analysis);
    switch (urgency) {
      case 'go':
        return '🚗 Time to Go to Birthing Center!';
      case 'quickening':
        return '⚡ Contractions Getting Closer';
      case 'monitor':
        return '💙 Keep Monitoring';
      default:
        return '✨ Contractions Starting';
    }
  };

  const elapsedTime = isTracking && contractionStartTime
    ? analysisService.formatDuration((Date.now() - contractionStartTime) / 1000)
    : '';

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.content}>
        <Text style={styles.title}>theo</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusMessage}>{getStatusMessage()}</Text>
        </View>

        {analysis && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Avg Interval</Text>
              <Text style={styles.statValue}>
                {analysisService.formatInterval(analysis.averageInterval)}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Tracked</Text>
              <Text style={styles.statValue}>{contractions.length}</Text>
            </View>

            {analysis.lastContraction && (
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Last Duration</Text>
                <Text style={styles.statValue}>
                  {analysisService.formatDuration(analysis.lastContraction.duration)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartContraction}
          >
            <Text style={styles.buttonText}>Start Contraction</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.elapsedTime}>{elapsedTime}</Text>
            <TouchableOpacity
              style={[styles.button, styles.endButton]}
              onPress={handleEndContraction}
            >
              <Text style={styles.buttonText}>End Contraction</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
  },
  title: {
    ...theme.typography.large,
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
  },
  statusContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  statusMessage: {
    ...theme.typography.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.xl,
    flexWrap: 'wrap',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    minWidth: '30%',
  },
  statLabel: {
    ...theme.typography.small,
    color: theme.colors.lightText,
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.medium,
    color: theme.colors.accent,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  button: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: theme.colors.success,
  },
  endButton: {
    backgroundColor: theme.colors.accent,
  },
  buttonText: {
    ...theme.typography.medium,
    color: 'white',
  },
  elapsedTime: {
    ...theme.typography.large,
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
  },
});
