import { useTimer, useTimeSinceLast } from '../hooks/useTimer.ts';
import { formatDuration, formatTime, formatInterval } from '../utils/format.ts';
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

  const urgency = app.getUrgencyState();
  const buttonBg =
    urgency === 'approaching'
      ? 'var(--soft-coral)'
      : app.isActive
        ? 'var(--terracotta)'
        : 'var(--warm-amber)';

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
          <div style={emptyText}>Tap the button to start timing</div>
        ) : (
          <>
            <div style={sectionHeader}>RECENT</div>
            {recent.map((c) => (
              <RecentRow key={c.id} contraction={c} all={app.contractions} />
            ))}
          </>
        )}
      </div>

      {/* Clear timers */}
      {app.contractions.length > 0 && !app.isActive && (
        <div style={{ padding: '8px 20px 0', flexShrink: 0 }}>
          <button
            onClick={() => {
              if (confirm('Clear all contractions?')) {
                app.clearAll();
              }
            }}
            style={clearBtn}
          >
            Clear Timers
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
            transform: app.isActive ? 'scale(1.05)' : 'scale(1)',
            boxShadow: app.isActive
              ? '0 8px 32px rgba(76, 175, 80, 0.4)'
              : '0 4px 16px rgba(129, 199, 132, 0.3)',
          }}
        >
          <span style={{ fontSize: 14, opacity: 0.9, letterSpacing: 1 }}>
            {app.isActive ? 'TAP TO' : 'TAP TO'}
          </span>
          <span style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>
            {app.isActive ? 'Stop' : 'Start'}
          </span>
        </button>
      </div>
    </div>
  );
}

function RecentRow({ contraction: c, all }: { contraction: Contraction; all: Contraction[] }) {
  const idx = all.findIndex((a) => a.id === c.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const interval = prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;

  return (
    <div style={rowStyle}>
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
    </div>
  );
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

const emptyText: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: 15,
  marginTop: 24,
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
  padding: '10px 0',
  borderBottom: '1px solid var(--warm-beige)',
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

const clearBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: 'var(--warm-beige)',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-muted)',
  transition: 'background 0.2s',
};
