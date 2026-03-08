import { useState, useEffect } from 'react';
import './index.css';
import { useContractions } from './hooks/useContractions.ts';
import { TimerScreen } from './components/TimerScreen.tsx';
import { HistoryScreen } from './components/HistoryScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { AlertBanner } from './components/AlertBanner.tsx';

type Tab = 'timer' | 'history' | 'settings';

export function App() {
  const [tab, setTab] = useState<Tab>('timer');
  const app = useContractions();

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
        {tab === 'timer' && <TimerScreen app={app} />}
        {tab === 'history' && <HistoryScreen app={app} />}
        {tab === 'settings' && <SettingsScreen app={app} />}
      </main>

      <nav style={navStyle} className="safe-bottom">
        {(['timer', 'history', 'settings'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...navBtnStyle,
              color: tab === t ? 'var(--terracotta)' : 'var(--text-muted)',
              borderTop: tab === t ? '2px solid var(--terracotta)' : '2px solid transparent',
            }}
          >
            <span style={{ fontSize: 22 }}>
              {t === 'timer' ? '⏱' : t === 'history' ? '📋' : '⚙️'}
            </span>
            <span style={{ fontSize: 11, marginTop: 2, textTransform: 'capitalize' }}>
              {t === 'timer' ? 'Track' : t}
            </span>
          </button>
        ))}
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
