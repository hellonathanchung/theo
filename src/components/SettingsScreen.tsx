import { useState } from 'react';
import type { Preset } from '../types.ts';
import type { useContractions } from '../hooks/useContractions.ts';
import { DisclaimerModal } from './DisclaimerModal.tsx';

interface Props {
  app: ReturnType<typeof useContractions>;
}

const PRESETS: { id: Preset; label: string; shortDesc: string; longDesc: string; freq: number; dur: number; window: number }[] = [
  {
    id: '5-1-1', label: '5-1-1', shortDesc: '5m / 1m / 1hr',
    longDesc: 'Contractions 5 minutes apart, lasting 1 minute, for 1 hour. Most common guideline for first-time parents.',
    freq: 5, dur: 60, window: 60,
  },
  {
    id: '4-1-1', label: '4-1-1', shortDesc: '4m / 1m / 1hr',
    longDesc: 'Contractions 4 minutes apart, lasting 1 minute, for 1 hour. Often recommended for second+ pregnancies.',
    freq: 4, dur: 60, window: 60,
  },
  {
    id: '3-1-1', label: '3-1-1', shortDesc: '3m / 1m / 1hr',
    longDesc: 'Contractions 3 minutes apart, lasting 1 minute, for 1 hour. Used when your healthcare provider advises closer monitoring.',
    freq: 3, dur: 60, window: 60,
  },
  {
    id: 'custom', label: 'Custom', shortDesc: 'Your rules',
    longDesc: 'Adjust each threshold below to match your care provider\'s guidance.',
    freq: 0, dur: 0, window: 0,
  },
];

export function SettingsScreen({ app }: Props) {
  const { settings, updateSettings } = app;
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const selectPreset = (p: typeof PRESETS[number]) => {
    if (p.id === 'custom') {
      updateSettings({ preset: 'custom' });
    } else {
      updateSettings({
        preset: p.id,
        frequencyMinutes: p.freq,
        durationSeconds: p.dur,
        timeWindowMinutes: p.window,
      });
    }
  };

  const activePreset = PRESETS.find((p) => p.id === settings.preset);

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={titleStyle}>Settings</h2>

      {/* Preset picker — 2x2 grid */}
      <div style={sectionLabel}>ALERT RULE</div>
      <div style={presetGrid}>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPreset(p)}
            style={{
              ...presetBtn,
              background: settings.preset === p.id ? 'var(--terracotta)' : 'var(--warm-beige)',
              color: settings.preset === p.id ? 'var(--cream)' : 'var(--text-secondary)',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{p.label}</span>
            <span style={{ fontSize: 10, marginTop: 2, opacity: 0.8 }}>
              {p.shortDesc}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation of selected preset */}
      <div key={settings.preset} style={{ ...presetDesc, animation: 'fadeIn 0.3s ease' }}>
        {activePreset?.longDesc}
      </div>

      {/* Custom thresholds — only editable in custom mode */}
      <div style={sectionLabel}>THRESHOLDS</div>

      <SettingRow label="Contractions apart" desc="How many minutes between contractions">
        <Stepper
          value={settings.frequencyMinutes}
          unit="min"
          disabled={settings.preset !== 'custom'}
          onDec={() => updateSettings({ frequencyMinutes: Math.max(1, settings.frequencyMinutes - 1) })}
          onInc={() => updateSettings({ frequencyMinutes: Math.min(15, settings.frequencyMinutes + 1) })}
        />
      </SettingRow>

      <SettingRow label="Contraction duration" desc="How long each contraction lasts">
        <Stepper
          value={settings.durationSeconds}
          unit="sec"
          disabled={settings.preset !== 'custom'}
          onDec={() => updateSettings({ durationSeconds: Math.max(20, settings.durationSeconds - 10) })}
          onInc={() => updateSettings({ durationSeconds: Math.min(120, settings.durationSeconds + 10) })}
        />
      </SettingRow>

      <SettingRow label="Time window" desc="How long the pattern must hold">
        <Stepper
          value={settings.timeWindowMinutes}
          unit="min"
          disabled={settings.preset !== 'custom'}
          onDec={() => updateSettings({ timeWindowMinutes: Math.max(15, settings.timeWindowMinutes - 15) })}
          onInc={() => updateSettings({ timeWindowMinutes: Math.min(120, settings.timeWindowMinutes + 15) })}
        />
      </SettingRow>

      {/* Toggles */}
      <div style={{ ...sectionLabel, marginTop: 24 }}>PREFERENCES</div>

      <SettingRow label="Notifications" desc="Alert when it's time to go">
        <Toggle
          checked={settings.notificationsEnabled}
          onChange={(v) => {
            if (v && 'Notification' in window && Notification.permission !== 'granted') {
              Notification.requestPermission();
            }
            updateSettings({ notificationsEnabled: v });
          }}
        />
      </SettingRow>

      <SettingRow label="Vibration" desc="Haptic feedback on tap">
        <Toggle
          checked={settings.hapticEnabled}
          onChange={(v) => updateSettings({ hapticEnabled: v })}
        />
      </SettingRow>

      <SettingRow label="Track intensity" desc="Note mild, moderate, or strong after each contraction">
        <Toggle
          checked={settings.intensityEnabled}
          onChange={(v) => updateSettings({ intensityEnabled: v })}
        />
      </SettingRow>

      {/* Support */}
      <div style={{ ...sectionLabel, marginTop: 24 }}>SUPPORT</div>
      <div style={supportSection}>
        <div style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
          Support Theo
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
          Theo is free and ad-free. If it helped during your journey, consider supporting us.
        </div>
        <a
          href="https://venmo.com/hellonathanchung"
          target="_blank"
          rel="noopener noreferrer"
          style={donateBtn}
        >
          Support on Venmo
        </a>
      </div>

      {/* Disclaimer */}
      <div style={disclaimer}>
        Theo is a timing tool, not medical advice.<br />
        Always consult your care provider.<br />
        <button
          onClick={() => setShowDisclaimer(true)}
          style={disclaimerLink}
        >
          Full Disclaimer
        </button>
      </div>

      <div style={version}>Theo v1.1.0</div>

      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
    </div>
  );
}

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div style={rowStyle}>
      <div style={{ flex: 1, marginRight: 16 }}>
        <div style={{ fontSize: 15, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}

function Stepper({
  value,
  unit,
  disabled,
  onDec,
  onInc,
}: {
  value: number;
  unit: string;
  disabled?: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: disabled ? 0.5 : 1 }}>
      <button onClick={disabled ? undefined : onDec} style={{ ...stepBtn, cursor: disabled ? 'default' : 'pointer' }}>−</button>
      <div style={{ textAlign: 'center', minWidth: 48 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{unit}</div>
      </div>
      <button onClick={disabled ? undefined : onInc} style={{ ...stepBtn, cursor: disabled ? 'default' : 'pointer' }}>+</button>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        background: checked ? 'var(--warm-amber)' : 'var(--warm-beige)',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: checked ? 'var(--terracotta)' : 'var(--text-muted)',
          position: 'absolute',
          top: 3,
          left: checked ? 23 : 3,
          transition: 'left 0.2s, background 0.2s',
        }}
      />
    </button>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  padding: '0 20px 8px',
  color: 'var(--text-primary)',
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
  padding: '12px 20px 4px',
};

const presetGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  padding: '8px 20px',
};

const presetBtn: React.CSSProperties = {
  padding: '12px 8px',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'all 0.2s',
};

const presetDesc: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  padding: '4px 20px 12px',
  lineHeight: 1.5,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 20px',
  borderBottom: '1px solid var(--warm-beige)',
};

const stepBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: '50%',
  background: 'var(--warm-beige)',
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--terracotta)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const supportSection: React.CSSProperties = {
  padding: '12px 20px',
};

const donateBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 24px',
  background: 'var(--warm-beige)',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--terracotta)',
  textDecoration: 'none',
  transition: 'background 0.2s',
};

const disclaimer: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 12,
  color: 'var(--text-muted)',
  padding: '32px 20px 8px',
  lineHeight: 1.6,
};

const disclaimerLink: React.CSSProperties = {
  color: 'var(--terracotta)',
  textDecoration: 'underline',
  fontSize: 12,
  marginTop: 4,
  display: 'inline-block',
};

const version: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 11,
  color: 'var(--text-muted)',
  padding: '8px 0',
  opacity: 0.6,
};
