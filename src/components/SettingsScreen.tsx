import type { Preset } from '../types.ts';
import type { useContractions } from '../hooks/useContractions.ts';

interface Props {
  app: ReturnType<typeof useContractions>;
}

const PRESETS: { id: Preset; label: string; desc: string; freq: number; dur: number; window: number }[] = [
  { id: '5-1-1', label: '5-1-1', desc: '5 min apart, 1 min long, 1 hour', freq: 5, dur: 60, window: 60 },
  { id: '4-1-1', label: '4-1-1', desc: '4 min apart, 1 min long, 1 hour', freq: 4, dur: 60, window: 60 },
  { id: 'custom', label: 'Custom', desc: 'Set your own thresholds', freq: 0, dur: 0, window: 0 },
];

export function SettingsScreen({ app }: Props) {
  const { settings, updateSettings } = app;

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

  return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={titleStyle}>Settings</h2>

      {/* Preset picker */}
      <div style={sectionLabel}>ALERT RULE</div>
      <div style={presetRow}>
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
              {p.id === 'custom' ? 'Your rules' : `${p.freq}m / ${p.dur / 60}m / ${p.window}m`}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation of selected preset */}
      <div style={presetDesc}>
        {settings.preset === '5-1-1' && (
          <>Contractions <strong>5 minutes apart</strong>, lasting <strong>1 minute</strong>, for <strong>1 hour</strong>. Most common guideline from OBs.</>
        )}
        {settings.preset === '4-1-1' && (
          <>Contractions <strong>4 minutes apart</strong>, lasting <strong>1 minute</strong>, for <strong>1 hour</strong>. More conservative — used by some providers.</>
        )}
        {settings.preset === 'custom' && (
          <>Adjust each threshold below to match your care provider's guidance.</>
        )}
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

      {/* Disclaimer */}
      <div style={disclaimer}>
        Theo is a timing tool, not medical advice.<br />
        Always consult your care provider.
      </div>

      <div style={version}>Theo v1.0.0</div>
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

const presetRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: '8px 20px',
};

const presetBtn: React.CSSProperties = {
  flex: 1,
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

const disclaimer: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 12,
  color: 'var(--text-muted)',
  padding: '32px 20px 8px',
  lineHeight: 1.6,
};

const version: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 11,
  color: 'var(--text-muted)',
  padding: '8px 0',
  opacity: 0.6,
};
