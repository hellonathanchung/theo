import { useState, useEffect } from 'react';
import './index.css';
import { useContractions } from './hooks/useContractions.ts';
import { TimerScreen } from './components/TimerScreen.tsx';
import { HistoryScreen } from './components/HistoryScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { RelaxScreen } from './components/RelaxScreen.tsx';
import { AlertBanner } from './components/AlertBanner.tsx';
import { Onboarding } from './components/Onboarding.tsx';
import { loadOnboardingComplete, saveOnboardingComplete } from './utils/storage.ts';
import type { Preset } from './types.ts';

type Tab = 'timer' | 'history' | 'relax' | 'settings';

const PRESET_VALUES: Record<Exclude<Preset, 'custom'>, { frequencyMinutes: number; durationSeconds: number; timeWindowMinutes: number }> = {
  '5-1-1': { frequencyMinutes: 5, durationSeconds: 60, timeWindowMinutes: 60 },
  '4-1-1': { frequencyMinutes: 4, durationSeconds: 60, timeWindowMinutes: 60 },
  '3-1-1': { frequencyMinutes: 3, durationSeconds: 60, timeWindowMinutes: 60 },
};

export function App() {
  const [tab, setTab] = useState<Tab>('timer');
  const [showOnboarding, setShowOnboarding] = useState(() => !loadOnboardingComplete());
  const app = useContractions();

  // Request notification permission after onboarding
  useEffect(() => {
    if (!showOnboarding && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [showOnboarding]);

  const handleOnboardingComplete = (preset: Preset) => {
    saveOnboardingComplete();
    if (preset !== 'custom') {
      app.updateSettings({ preset, ...PRESET_VALUES[preset] });
    }
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const urgency = app.getUrgencyState();
  const bgColor =
    urgency === 'active'
      ? 'var(--soft-peach)'
      : urgency === 'approaching'
        ? 'var(--soft-coral)'
        : 'var(--cream)';

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: bgColor,
        transition: 'background 1.5s ease',
      }}
    >
      {app.alertMessage && (
        <AlertBanner message={app.alertMessage} onDismiss={app.dismissAlert} />
      )}

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div key={tab} style={{ height: '100%', animation: 'fadeIn 0.25s ease' }}>
          {tab === 'timer' && <TimerScreen app={app} />}
          {tab === 'history' && <HistoryScreen app={app} />}
          {tab === 'relax' && <RelaxScreen />}
          {tab === 'settings' && <SettingsScreen app={app} />}
        </div>
      </main>

      <nav style={navStyle} className="safe-bottom">
        {(['timer', 'history', 'relax', 'settings'] as Tab[]).map((t) => {
          const icons: Record<Tab, string> = { timer: '⏱', history: '📋', relax: '🌿', settings: '⚙️' };
          const labels: Record<Tab, string> = { timer: 'Track', history: 'History', relax: 'Relax', settings: 'Settings' };
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...navBtnStyle,
                color: tab === t ? 'var(--terracotta)' : 'var(--text-muted)',
                borderTop: tab === t ? '2px solid var(--terracotta)' : '2px solid transparent',
              }}
            >
              <span style={{ fontSize: 20 }}>{icons[t]}</span>
              <span style={{ fontSize: 10, marginTop: 2 }}>{labels[t]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  borderTop: '1px solid var(--warm-beige)',
  background: 'var(--cream)',
  flexShrink: 0,
};

const navBtnStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '8px 0 6px',
  transition: 'color 0.2s',
};
