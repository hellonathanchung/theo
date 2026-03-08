import { useMemo } from 'react';
import { formatDuration, formatTime, formatInterval } from '../utils/format.ts';
import type { useContractions } from '../hooks/useContractions.ts';

interface Props {
  app: ReturnType<typeof useContractions>;
}

export function HistoryScreen({ app }: Props) {
  const reversed = useMemo(() => [...app.contractions].reverse(), [app.contractions]);

  const stats = useMemo(() => {
    const c = app.contractions;
    if (c.length === 0) return null;

    const durations = c.filter((x) => x.duration).map((x) => x.duration!);
    const avgDur = durations.reduce((a, b) => a + b, 0) / durations.length;

    const intervals: number[] = [];
    for (let i = 1; i < c.length; i++) {
      const prev = c[i - 1];
      if (prev.endTime) intervals.push((c[i].startTime - prev.endTime) / 1000);
    }
    const avgInt = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;

    return { count: c.length, avgDur, avgInt };
  }, [app.contractions]);

  return (
    <div style={{ padding: '20px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={titleStyle}>History</h2>

      {stats && (
        <div style={statsRow}>
          <div style={statItem}>
            <div style={statValue}>{stats.count}</div>
            <div style={statLabel}>TOTAL</div>
          </div>
          <div style={statDivider} />
          <div style={statItem}>
            <div style={statValue}>{formatDuration(stats.avgDur)}</div>
            <div style={statLabel}>AVG DURATION</div>
          </div>
          <div style={statDivider} />
          <div style={statItem}>
            <div style={statValue}>{stats.avgInt > 0 ? formatInterval(stats.avgInt) : '--'}</div>
            <div style={statLabel}>AVG APART</div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {reversed.length === 0 ? (
          <div style={emptyStyle}>
            No contractions recorded yet.<br />
            Head to the Track tab to get started.
          </div>
        ) : (
          reversed.map((c, i) => {
            const realIdx = app.contractions.length - 1 - i;
            const prev = realIdx > 0 ? app.contractions[realIdx - 1] : null;
            const interval = prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;

            return (
              <div key={c.id} style={{ ...rowStyle, background: i % 2 === 0 ? 'transparent' : 'var(--warm-beige)' }}>
                <span style={numStyle}>#{app.contractions.length - i}</span>
                <span style={timeStyle}>{formatTime(c.startTime)}</span>
                <div style={detailStyle}>
                  <span style={valStyle}>{c.duration ? formatDuration(c.duration) : '--'}</span>
                  <span style={lblStyle}>duration</span>
                </div>
                <div style={detailStyle}>
                  <span style={{ ...valStyle, color: 'var(--terracotta)' }}>
                    {interval !== null ? formatInterval(interval) : '--'}
                  </span>
                  <span style={lblStyle}>apart</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {app.contractions.length > 0 && (
        <div style={{ padding: '12px 20px', flexShrink: 0 }}>
          <button
            onClick={() => {
              if (confirm('Start a new session? This will clear all recorded contractions.')) {
                app.clearAll();
              }
            }}
            style={clearBtn}
          >
            New Session
          </button>
        </div>
      )}
    </div>
  );
}

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  padding: '0 20px 12px',
  color: 'var(--text-primary)',
};

const statsRow: React.CSSProperties = {
  display: 'flex',
  background: 'var(--warm-beige)',
  borderRadius: 16,
  margin: '0 16px 16px',
  padding: '16px 0',
};

const statItem: React.CSSProperties = { flex: 1, textAlign: 'center' };
const statValue: React.CSSProperties = { fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' };
const statLabel: React.CSSProperties = { fontSize: 10, color: 'var(--text-muted)', marginTop: 4, letterSpacing: 0.5 };
const statDivider: React.CSSProperties = { width: 1, background: 'var(--soft-peach)', margin: '4px 0' };

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: 15,
  marginTop: 48,
  lineHeight: 1.6,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 12px',
  borderRadius: 8,
};

const numStyle: React.CSSProperties = { width: 36, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 };
const timeStyle: React.CSSProperties = { width: 66, fontSize: 13, color: 'var(--text-secondary)' };
const detailStyle: React.CSSProperties = { flex: 1, textAlign: 'center' };
const valStyle: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 500 };
const lblStyle: React.CSSProperties = { display: 'block', fontSize: 10, color: 'var(--text-muted)', marginTop: 1 };

const clearBtn: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'var(--warm-beige)',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 500,
  color: 'var(--terracotta)',
  transition: 'background 0.2s',
};
