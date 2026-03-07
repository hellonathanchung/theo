import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { theme } from './styles/theme';

type Screen = 'home' | 'history' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'history' && <HistoryScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'home' && styles.navButtonActive
          ]}
          onPress={() => setCurrentScreen('home')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📍</Text>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'home' && styles.navButtonTextActive
            ]}
          >
            Track
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'history' && styles.navButtonActive
          ]}
          onPress={() => setCurrentScreen('history')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>📋</Text>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'history' && styles.navButtonTextActive
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'settings' && styles.navButtonActive
          ]}
          onPress={() => setCurrentScreen('settings')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'settings' && styles.navButtonTextActive
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.primary,
  },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.accent,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  navButtonText: {
    ...theme.typography.small,
    color: theme.colors.text,
  },
  navButtonTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});
