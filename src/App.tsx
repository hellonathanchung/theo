import { useState, useEffect } from 'react';
import './index.css';
import { useContractions } from './hooks/useContractions.ts';
import { TimerScreen } from './components/TimerScreen.tsx';
import { HistoryScreen } from './components/HistoryScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { RelaxScreen } from './components/RelaxScreen.tsx';
import { AlertBanner } from './components/AlertBanner.tsx';
import { Onboarding } from './components/Onboarding.tsx';
import { BackgroundLeaves } from './components/BackgroundLeaves.tsx';
import { loadOnboardingComplete, saveOnboardingComplete } from './utils/storage.ts';
import type { Preset } from './types.ts';

type Tab = 'timer' | 'history' | 'relax' | 'settings';

const PRESET_VALUES: Record<Exclude<Preset, 'custom'>, { frequencyMinutes: number; durationSeconds: number; timeWindowMinutes: number }> = {
  '5-1-1': { frequencyMinutes: 5, durationSeconds: 60, timeWindowMinutes: 60 },
  '4-1-1': { frequencyMinutes: 4, durationSeconds: 60, timeWindowMinutes: 60 },
  '3-1-1': { frequencyMinutes: 3, durationSeconds: 60, timeWindowMinutes: 60 },
};

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export function App() {
  const [tab, setTab] = useState<Tab>('timer');
  const [showOnboarding, setShowOnboarding] = useState(() => !loadOnboardingComplete());
  const [showStalePrompt, setShowStalePrompt] = useState(false);
  const app = useContractions();

  // Request notification permission after onboarding
  useEffect(() => {
    if (!showOnboarding && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [showOnboarding]);

  // Check if session is stale (24+ hours since last contraction)
  useEffect(() => {
    if (showOnboarding || app.contractions.length === 0) return;
    const lastContraction = app.contractions[app.contractions.length - 1];
    const lastTime = lastContraction.endTime ?? lastContraction.startTime;
    if (Date.now() - lastTime > TWENTY_FOUR_HOURS) {
      setShowStalePrompt(true);
    }
  }, []); // Only on mount

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
      <BackgroundLeaves />

      {app.alertMessage && (
        <AlertBanner message={app.alertMessage} onDismiss={app.dismissAlert} />
      )}

      {/* Stale session prompt — shown when returning after 24+ hours */}
      {showStalePrompt && (
        <div style={staleOverlay}>
          <div style={staleCard}>
            <span style={{ fontSize: 32 }}>👋</span>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: '8px 0 4px' }}>
              Welcome back!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
              It's been a while since your last contraction. Would you like to start a new session?
            </p>
            <button
              onClick={() => {
                app.newSession();
                setShowStalePrompt(false);
              }}
              style={staleBtn}
            >
              Start New Session
            </button>
            <button
              onClick={() => setShowStalePrompt(false)}
              style={staleBtnSecondary}
            >
              Keep Current Session
            </button>
          </div>
        </div>
      )}

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div key={tab} style={{ height: '100%', animation: 'fadeIn 0.25s ease' }}>
          {tab === 'timer' && <TimerScreen app={app} />}
          {tab === 'history' && <HistoryScreen app={app} />}
          {tab === 'relax' && <RelaxScreen app={app} />}
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

const staleOverlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(46, 59, 46, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: 24,
  animation: 'fadeInOverlay 0.3s ease',
};

const staleCard: React.CSSProperties = {
  background: 'var(--cream)',
  borderRadius: 20,
  padding: '28px 24px',
  maxWidth: 320,
  width: '100%',
  textAlign: 'center',
  animation: 'fadeIn 0.3s ease',
};

const staleBtn: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: 12,
  background: 'var(--terracotta)',
  color: 'white',
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 10,
  border: 'none',
  cursor: 'pointer',
};

const staleBtnSecondary: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  background: 'transparent',
  color: 'var(--text-muted)',
  fontSize: 14,
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};
