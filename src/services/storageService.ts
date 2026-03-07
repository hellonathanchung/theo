import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contraction, AppSettings } from '../types';

const CONTRACTIONS_KEY = 'theo_contractions';
const SETTINGS_KEY = 'theo_settings';

const defaultSettings: AppSettings = {
  birthingCenterName: '',
  birthingCenterAddress: '',
  partnerPhoneNumber: '',
  doctorName: '',
  doctorPhoneNumber: '',
  alertThresholdMinutes: 5
};

export const storageService = {
  // Contractions
  async saveContraction(contraction: Contraction): Promise<void> {
    try {
      const existing = await this.getContractions();
      const updated = [...existing, contraction];
      await AsyncStorage.setItem(CONTRACTIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving contraction:', error);
      throw error;
    }
  },

  async getContractions(): Promise<Contraction[]> {
    try {
      const data = await AsyncStorage.getItem(CONTRACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving contractions:', error);
      return [];
    }
  },

  async clearContractions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONTRACTIONS_KEY);
    } catch (error) {
      console.error('Error clearing contractions:', error);
      throw error;
    }
  },

  async deleteContraction(id: string): Promise<void> {
    try {
      const contractions = await this.getContractions();
      const filtered = contractions.filter(c => c.id !== id);
      await AsyncStorage.setItem(CONTRACTIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting contraction:', error);
      throw error;
    }
  },

  // Settings
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : defaultSettings;
    } catch (error) {
      console.error('Error retrieving settings:', error);
      return defaultSettings;
    }
  }
};
