import { Contraction, ContractionAnalysis } from '../types';

export const analysisService = {
  analyzeContractions(contractions: Contraction[]): ContractionAnalysis | null {
    if (contractions.length === 0) return null;

    const lastContraction = contractions[contractions.length - 1];
    
    if (contractions.length === 1) {
      return {
        averageInterval: 0,
        lastContraction,
        isTimeToGo: false,
        consecutiveQuickContractions: 0
      };
    }

    // Calculate intervals between contractions
    const intervals: number[] = [];
    for (let i = 1; i < contractions.length; i++) {
      const interval = (contractions[i].startTime - contractions[i - 1].startTime) / 1000;
      intervals.push(interval);
    }

    // Calculate average interval (in seconds)
    const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // Check if time to go: < 5 minutes (300 seconds)
    const isTimeToGo = averageInterval < 300;

    // Count consecutive quick contractions (last few contractions < 5 min apart)
    let consecutiveQuickContractions = 0;
    for (let i = intervals.length - 1; i >= 0; i--) {
      if (intervals[i] < 300) {
        consecutiveQuickContractions++;
      } else {
        break;
      }
    }

    return {
      averageInterval,
      lastContraction,
      isTimeToGo,
      consecutiveQuickContractions
    };
  },

  getUrgencyLevel(analysis: ContractionAnalysis | null): 'calm' | 'monitor' | 'quickening' | 'go' {
    if (!analysis) return 'calm';
    
    if (analysis.isTimeToGo) return 'go';
    if (analysis.averageInterval < 600) return 'quickening'; // < 10 minutes
    if (analysis.averageInterval < 900) return 'monitor'; // < 15 minutes
    return 'calm';
  },

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  formatInterval(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }
};
