import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

// Only set notification handler on native platforms
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const notificationService = {
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') return; // Skip on web
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  },

  async sendLaborAlert(averageInterval: number): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('🚗 Time to Go! (Web: notifications disabled)');
      return;
    }
    
    try {
      const minutes = Math.floor(averageInterval / 60);
      const seconds = Math.floor(averageInterval % 60);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚗 Time to Go!',
          body: `Contractions are ${minutes}m ${seconds}s apart. Head to the birthing center.`,
          sound: 'default',
          badge: 1,
          data: {
            type: 'labor_alert'
          }
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending labor alert:', error);
    }
  },

  async sendContractionReminder(duration: number): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('💙 Contraction tracked (Web: notifications disabled)');
      return;
    }
    
    try {
      const mins = Math.floor(duration / 60);
      const secs = Math.floor(duration % 60);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💙 Contraction Tracked',
          body: `Duration: ${mins}m ${secs}s. Breathe deeply.`,
          sound: 'default',
          data: {
            type: 'contraction_tracked'
          }
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending contraction reminder:', error);
    }
  },

  async sendQuickeningAlert(): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('⚡ Contractions quickening (Web: notifications disabled)');
      return;
    }
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⚡ Contractions Quickening',
          body: 'Contractions are getting closer. Keep breathing.',
          sound: 'default',
          data: {
            type: 'quickening_alert'
          }
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error sending quickening alert:', error);
    }
  }
};
