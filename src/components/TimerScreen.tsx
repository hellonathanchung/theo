import { useState } from 'react';
import { useTimer, useTimeSinceLast } from '../hooks/useTimer.ts';
import { formatDuration, formatTime, formatInterval } from '../utils/format.ts';
import { IntensityPicker } from './IntensityPicker.tsx';
import { ContractionDetailModal } from './ContractionDetailModal.tsx';
import type { Contraction } from '../types.ts';
import type { useContractions } from '../hooks/useContractions.ts';

interface Props {
  app: ReturnType<typeof useContractions>;
}

export function TimerScreen({ app }: Props) {
  const elapsed = useTimer(app.isActive, app.activeStart);
  const lastContraction = app.contractions[app.contractions.length - 1] ?? null;
  const timeSinceLast = useTimeSinceLast(app.isActive, lastContraction?.endTime ?? null);
  const recent = app.contractions.slice(-5).reverse();
  const [selectedContraction, setSelectedContraction] = useState<Contraction | null>(null);

  const urgency = app.getUrgencyState();
  const buttonBg =
    urgency === 'approaching'
      ? 'var(--soft-coral)'
      : app.isActive
        ? 'var(--terracotta)'
        : 'var(--warm-amber)';

  const getInterval = (c: Contraction) => {
    const idx = app.contractions.findIndex((a) => a.id === c.id);
    const prev = idx > 0 ? app.contractions[idx - 1] : null;
    return prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;
  };

  return (
    <div style={container}>
      {/* Counter */}
      {app.contractions.length > 0 && (
        <div style={counterStyle}>
          {app.contractions.length} contraction{app.contractions.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Timer display */}
      <div style={timerSection}>
        <div style={timerLabel}>
          {app.isActive ? 'CONTRACTION DURATION' : 'TIME SINCE LAST'}
        </div>
        <div style={timerValue}>
          {app.isActive
            ? formatDuration(elapsed)
            : lastContraction?.endTime
              ? formatDuration(timeSinceLast)
              : '--:--'}
        </div>
      </div>

      {/* Recent contractions */}
      <div style={recentSection}>
        {recent.length === 0 ? (
          <div style={emptyState}>
            <div style={emptyTitle}>Ready when you are</div>
            <div style={emptyDesc}>
              Tap the button below when a contraction starts.
              Theo will track the pattern for you.
            </div>
          </div>
        ) : (
          <>
            <div style={sectionHeader}>RECENT</div>
            {recent.map((c, i) => (
              <RecentRow
                key={c.id}
                contraction={c}
                all={app.contractions}
                isNewest={i === 0}
                onTap={() => setSelectedContraction(c)}
              />
            ))}
          </>
        )}
      </div>

      {/* New Session */}
      {app.contractions.length > 0 && !app.isActive && (
        <div style={{ padding: '8px 20px 0', flexShrink: 0 }}>
          <button
            onClick={() => {
              if (confirm('Save and start a new session?')) {
                app.newSession();
              }
            }}
            style={newSessionBtn}
          >
            New Session
          </button>
        </div>
      )}

      {/* Big button — pinned to bottom for thumb reach */}
      <div style={buttonWrapper}>
        <button
          onClick={app.isActive ? app.stopContraction : app.startContraction}
          style={{
            ...bigButton,
            background: buttonBg,
            animation: app.isActive ? 'breathe 2s ease-in-out infinite' : 'none',
            transform: app.isActive ? undefined : 'scale(1)',
            boxShadow: app.isActive
              ? undefined
              : '0 4px 16px rgba(129, 199, 132, 0.3)',
          }}
        >
          <span style={{ fontSize: 14, opacity: 0.9, letterSpacing: 1 }}>
            TAP TO
          </span>
          <span style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>
            {app.isActive ? 'Stop' : 'Start'}
          </span>
        </button>
      </div>

      {/* Intensity picker */}
      {app.pendingIntensityId && (
        <IntensityPicker
          onSelect={(intensity) => app.setIntensity(app.pendingIntensityId!, intensity)}
          onSkip={app.dismissIntensityPrompt}
        />
      )}

      {/* Contraction detail modal */}
      {selectedContraction && (
        <ContractionDetailModal
          contraction={selectedContraction}
          interval={getInterval(selectedContraction)}
          onUpdate={(id, updates) => {
            app.updateContraction(id, updates);
            // Refresh the selected contraction with updated data
            const updated = app.contractions.find((c) => c.id === id);
            if (updated) setSelectedContraction({ ...updated, ...updates });
          }}
          onDelete={(id) => {
            app.deleteContraction(id);
            setSelectedContraction(null);
          }}
          onClose={() => setSelectedContraction(null)}
        />
      )}
    </div>
  );
}

function RecentRow({
  contraction: c,
  all,
  isNewest,
  onTap,
}: {
  contraction: Contraction;
  all: Contraction[];
  isNewest: boolean;
  onTap: () => void;
}) {
  const idx = all.findIndex((a) => a.id === c.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const interval = prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;

  return (
    <button onClick={onTap} style={{
      ...rowStyle,
      background: isNewest ? 'var(--warm-beige)' : 'transparent',
      animation: 'fadeIn 0.3s ease',
    }}>
      <span style={rowTime}>{formatTime(c.startTime)}</span>
      <div style={rowDetail}>
        <span style={rowValue}>{c.duration ? formatDuration(c.duration) : '--'}</span>
        <span style={rowLabel}>duration</span>
      </div>
      <div style={rowDetail}>
        <span style={{ ...rowValue, color: 'var(--terracotta)' }}>
          {interval !== null ? formatInterval(interval) : '--'}
        </span>
        <span style={rowLabel}>apart</span>
      </div>
      {c.intensity && (
        <div style={intensityDot(c.intensity)} />
      )}
    </button>
  );
}

function intensityDot(intensity: string): React.CSSProperties {
  const colors: Record<string, string> = {
    mild: 'var(--warm-amber)',
    moderate: 'var(--soft-coral)',
    strong: 'var(--terracotta)',
  };
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: colors[intensity] ?? 'var(--text-muted)',
    flexShrink: 0,
    marginLeft: 8,
  };
}

const container: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '16px 0 0',
};

const counterStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 13,
  color: 'var(--text-muted)',
  letterSpacing: 1,
  padding: '0 0 4px',
};

const timerSection: React.CSSProperties = {
  textAlign: 'center',
  padding: '16px 0',
};

const timerLabel: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  letterSpacing: 1.5,
  marginBottom: 4,
};

const timerValue: React.CSSProperties = {
  fontSize: 56,
  fontWeight: 200,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--text-primary)',
};

const buttonWrapper: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '8px 0 12px',
  flexShrink: 0,
};

const bigButton: React.CSSProperties = {
  width: 160,
  height: 160,
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--cream)',
  transition: 'all 0.4s ease',
  border: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
};

const recentSection: React.CSSProperties = {
  flex: 1,
  padding: '0 20px',
  overflow: 'auto',
};

const emptyState: React.CSSProperties = {
  textAlign: 'center',
  marginTop: 24,
  padding: '0 16px',
};

const emptyTitle: React.CSSProperties = {
  fontSize: 16,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  fontWeight: 500,
};

const emptyDesc: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
};

const sectionHeader: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
  marginBottom: 8,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 8px',
  borderBottom: '1px solid var(--warm-beige)',
  borderRadius: 8,
  width: '100%',
  textAlign: 'left',
};

const rowTime: React.CSSProperties = {
  width: 70,
  fontSize: 14,
  color: 'var(--text-secondary)',
};

const rowDetail: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
};

const rowValue: React.CSSProperties = {
  display: 'block',
  fontSize: 16,
  fontWeight: 500,
};

const rowLabel: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  color: 'var(--text-muted)',
  marginTop: 1,
};

const newSessionBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: 'var(--warm-beige)',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  transition: 'background 0.2s',
};
