import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { theme } from '../styles/theme';
import { AppSettings } from '../types';
import { storageService } from '../services/storageService';

export const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    birthingCenterName: '',
    birthingCenterAddress: '',
    partnerPhoneNumber: '',
    doctorName: '',
    doctorPhoneNumber: '',
    alertThresholdMinutes: 5
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await storageService.getSettings();
    setSettings(saved);
  };

  const handleSaveSettings = async () => {
    try {
      await storageService.saveSettings(settings);
      Alert.alert('Success', 'Settings saved successfully', [
        { text: 'OK', onPress: () => {} }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings', [
        { text: 'OK', onPress: () => {} }
      ]);
    }
  };

  const updateSetting = (key: keyof AppSettings, value: string | number) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Birthing Center</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Center Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Community Birth Center"
            value={settings.birthingCenterName}
            onChangeText={(value) =>
              updateSetting('birthingCenterName', value)
            }
            placeholderTextColor={theme.colors.lightText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 123 Main St, City, State"
            value={settings.birthingCenterAddress}
            onChangeText={(value) =>
              updateSetting('birthingCenterAddress', value)
            }
            placeholderTextColor={theme.colors.lightText}
            multiline
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Partner Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            value={settings.partnerPhoneNumber}
            onChangeText={(value) =>
              updateSetting('partnerPhoneNumber', value)
            }
            placeholderTextColor={theme.colors.lightText}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Doctor Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your doctor's name"
            value={settings.doctorName}
            onChangeText={(value) => updateSetting('doctorName', value)}
            placeholderTextColor={theme.colors.lightText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Doctor Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Doctor's phone number"
            value={settings.doctorPhoneNumber}
            onChangeText={(value) =>
              updateSetting('doctorPhoneNumber', value)
            }
            placeholderTextColor={theme.colors.lightText}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Threshold</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Alert when contractions are this many minutes apart
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Minutes"
            value={settings.alertThresholdMinutes.toString()}
            onChangeText={(value) =>
              updateSetting('alertThresholdMinutes', parseInt(value) || 5)
            }
            placeholderTextColor={theme.colors.lightText}
            keyboardType="number-pad"
          />
          <Text style={styles.helperText}>
            Default is 5 minutes (4-1-1 rule)
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>theo v1.0.0</Text>
        <Text style={styles.footerText}>
          Free, ad-free contractions tracker for labor monitoring
        </Text>
      </View>
    </ScrollView>
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
  section: {
    marginBottom: theme.spacing.xl,
    backgroundColor: 'rgba(232, 213, 242, 0.2)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.medium,
    color: theme.colors.accent,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.small,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.typography.regular,
    color: theme.colors.text,
  },
  helperText: {
    ...theme.typography.tiny,
    color: theme.colors.lightText,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  saveButtonText: {
    ...theme.typography.medium,
    color: 'white',
  },
  footer: {
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.small,
    color: theme.colors.lightText,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
});
