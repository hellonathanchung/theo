import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { theme } from '../styles/theme';
import { Contraction } from '../types';
import { storageService } from '../services/storageService';
import { analysisService } from '../services/analysisService';

export const HistoryScreen: React.FC = () => {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadContractions();
  }, []);

  const loadContractions = async () => {
    setRefreshing(true);
    const saved = await storageService.getContractions();
    setContractions(saved.reverse()); // Show newest first
    setRefreshing(false);
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const dateStr = date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric'
    });
    return `${dateStr} ${time}`;
  };

  const getIntervalFromPrevious = (index: number): number | null => {
    if (index === contractions.length - 1) return null;
    const current = contractions[index];
    const previous = contractions[index + 1];
    return (current.startTime - previous.startTime) / 1000;
  };

  const handleDeleteContraction = async (id: string) => {
    await storageService.deleteContraction(id);
    await loadContractions();
  };

  const handleClearHistory = async () => {
    await storageService.clearContractions();
    setContractions([]);
  };

  const renderContractionItem = ({ item, index }: { item: Contraction; index: number }) => {
    const interval = getIntervalFromPrevious(index);
    const duration = analysisService.formatDuration(item.duration);
    const intervalStr = interval
      ? analysisService.formatInterval(interval)
      : null;

    const isQuick = interval && interval < 300;

    return (
      <View style={[
        styles.contractionCard,
        isQuick && styles.contractionCardQuick
      ]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTime}>
              {formatDateTime(item.startTime)}
            </Text>
            <Text style={styles.cardDuration}>
              Duration: {duration}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteContraction(item.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {intervalStr && (
          <Text style={[
            styles.intervalText,
            isQuick && styles.intervalTextQuick
          ]}>
            {isQuick ? '⚡' : '✓'} Interval: {intervalStr}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contraction History</Text>

      {contractions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No contractions tracked yet</Text>
          <Text style={styles.emptySubtext}>Start tracking from the home screen</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={contractions}
            renderItem={renderContractionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            style={styles.list}
            onRefresh={loadContractions}
            refreshing={refreshing}
          />

          <View style={styles.footer}>
            <Text style={styles.countText}>
              {contractions.length} Contraction{contractions.length !== 1 ? 's' : ''} Tracked
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.large,
    color: theme.colors.accent,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  contractionCard: {
    backgroundColor: 'rgba(232, 213, 242, 0.3)',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  contractionCardQuick: {
    borderLeftColor: theme.colors.warning,
    backgroundColor: 'rgba(244, 177, 131, 0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardTime: {
    ...theme.typography.regular,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  cardDuration: {
    ...theme.typography.small,
    color: theme.colors.accent,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  deleteButtonText: {
    ...theme.typography.large,
    color: 'white',
  },
  intervalText: {
    ...theme.typography.small,
    color: theme.colors.lightText,
    marginTop: theme.spacing.sm,
  },
  intervalTextQuick: {
    color: theme.colors.warning,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.medium,
    color: theme.colors.lightText,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.small,
    color: theme.colors.lightText,
  },
  footer: {
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  countText: {
    ...theme.typography.small,
    color: theme.colors.lightText,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  clearButtonText: {
    ...theme.typography.medium,
    color: 'white',
  },
});
