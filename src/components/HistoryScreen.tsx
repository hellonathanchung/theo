import { useState, useMemo } from 'react';
import { formatDuration, formatTime, formatInterval } from '../utils/format.ts';
import { ContractionDetailModal } from './ContractionDetailModal.tsx';
import type { Contraction, Session } from '../types.ts';
import type { useContractions } from '../hooks/useContractions.ts';

interface Props {
  app: ReturnType<typeof useContractions>;
}

export function HistoryScreen({ app }: Props) {
  const reversed = useMemo(() => [...app.contractions].reverse(), [app.contractions]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [selectedContraction, setSelectedContraction] = useState<Contraction | null>(null);
  const [selectedReadOnly, setSelectedReadOnly] = useState(false);

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

  const getInterval = (contractions: Contraction[], c: Contraction) => {
    const idx = contractions.findIndex((a) => a.id === c.id);
    const prev = idx > 0 ? contractions[idx - 1] : null;
    return prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;
  };

  const getSessionStats = (session: Session) => {
    const c = session.contractions;
    const durations = c.filter((x) => x.duration).map((x) => x.duration!);
    const avgDur = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    const intervals: number[] = [];
    for (let i = 1; i < c.length; i++) {
      const prev = c[i - 1];
      if (prev.endTime) intervals.push((c[i].startTime - prev.endTime) / 1000);
    }
    const avgInt = intervals.length > 0 ? intervals.reduce((a, b) => a + b, 0) / intervals.length : 0;
    return { count: c.length, avgDur, avgInt };
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ padding: '20px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={titleStyle}>History</h2>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
        {/* Current session */}
        {stats && (
          <>
            <div style={sessionLabel}>CURRENT SESSION</div>
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

            {reversed.map((c, i) => {
              const realIdx = app.contractions.length - 1 - i;
              const prev = realIdx > 0 ? app.contractions[realIdx - 1] : null;
              const interval = prev?.endTime ? (c.startTime - prev.endTime) / 1000 : null;

              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedContraction(c); setSelectedReadOnly(false); }}
                  style={{
                    ...rowStyle,
                    background: i % 2 === 0 ? 'transparent' : 'var(--warm-beige)',
                    animation: `fadeIn 0.3s ease ${Math.min(i * 0.05, 0.3)}s both`,
                  }}
                >
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
                  {c.intensity && <div style={intensityDot(c.intensity)} />}
                </button>
              );
            })}
          </>
        )}

        {app.contractions.length === 0 && app.sessions.length === 0 && (
          <div style={emptyStyle}>
            No contractions recorded yet.<br />
            Head to the Track tab to get started.
          </div>
        )}

        {/* Past sessions */}
        {app.sessions.length > 0 && (
          <>
            <div style={{ ...sessionLabel, marginTop: stats ? 24 : 0 }}>PAST SESSIONS</div>
            {app.sessions.map((session) => {
              const sStats = getSessionStats(session);
              const isExpanded = expandedSession === session.id;

              return (
                <div key={session.id} style={sessionCard}>
                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    style={sessionHeader}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={sessionDate}>{formatDate(session.startedAt)}</div>
                      <div style={sessionMeta}>
                        {sStats.count} contractions &middot; avg {formatDuration(sStats.avgDur)} &middot;{' '}
                        {sStats.avgInt > 0 ? `${formatInterval(sStats.avgInt)} apart` : '--'}
                      </div>
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      &#9660;
                    </span>
                  </button>

                  {isExpanded && (
                    <div style={{ animation: 'fadeIn 0.25s ease' }}>
                      {[...session.contractions].reverse().map((c, i) => {
                        const interval = getInterval(session.contractions, c);
                        return (
                          <button
                            key={c.id}
                            onClick={() => { setSelectedContraction(c); setSelectedReadOnly(true); }}
                            style={{
                              ...rowStyle,
                              background: i % 2 === 0 ? 'transparent' : 'var(--warm-beige)',
                              fontSize: 13,
                            }}
                          >
                            <span style={numStyle}>#{session.contractions.length - i}</span>
                            <span style={timeStyle}>{formatTime(c.startTime)}</span>
                            <div style={detailStyle}>
                              <span style={{ ...valStyle, fontSize: 14 }}>{c.duration ? formatDuration(c.duration) : '--'}</span>
                              <span style={lblStyle}>duration</span>
                            </div>
                            <div style={detailStyle}>
                              <span style={{ ...valStyle, fontSize: 14, color: 'var(--terracotta)' }}>
                                {interval !== null ? formatInterval(interval) : '--'}
                              </span>
                              <span style={lblStyle}>apart</span>
                            </div>
                            {c.intensity && <div style={intensityDot(c.intensity)} />}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => {
                          if (confirm('Delete this past session?')) {
                            app.deleteSession(session.id);
                            setExpandedSession(null);
                          }
                        }}
                        style={deleteSessionBtn}
                      >
                        Delete Session
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Contraction detail modal */}
      {selectedContraction && (
        <ContractionDetailModal
          contraction={selectedContraction}
          interval={null}
          onUpdate={(id, updates) => {
            if (!selectedReadOnly) {
              app.updateContraction(id, updates);
              const updated = app.contractions.find((c) => c.id === id);
              if (updated) setSelectedContraction({ ...updated, ...updates });
            }
          }}
          onDelete={(id) => {
            if (!selectedReadOnly) {
              app.deleteContraction(id);
              setSelectedContraction(null);
            }
          }}
          onClose={() => setSelectedContraction(null)}
          readOnly={selectedReadOnly}
        />
      )}
    </div>
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
    marginLeft: 4,
  };
}

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  padding: '0 20px 12px',
  color: 'var(--text-primary)',
};

const sessionLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
  marginBottom: 8,
  padding: '0 4px',
};

const statsRow: React.CSSProperties = {
  display: 'flex',
  background: 'var(--warm-beige)',
  borderRadius: 16,
  marginBottom: 12,
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
  width: '100%',
  textAlign: 'left',
};

const numStyle: React.CSSProperties = { width: 36, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 };
const timeStyle: React.CSSProperties = { width: 66, fontSize: 13, color: 'var(--text-secondary)' };
const detailStyle: React.CSSProperties = { flex: 1, textAlign: 'center' };
const valStyle: React.CSSProperties = { display: 'block', fontSize: 15, fontWeight: 500 };
const lblStyle: React.CSSProperties = { display: 'block', fontSize: 10, color: 'var(--text-muted)', marginTop: 1 };

const sessionCard: React.CSSProperties = {
  borderRadius: 12,
  border: '1px solid var(--warm-beige)',
  marginBottom: 8,
  overflow: 'hidden',
};

const sessionHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '14px 16px',
  width: '100%',
  textAlign: 'left',
};

const sessionDate: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const sessionMeta: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-muted)',
  marginTop: 2,
};

const deleteSessionBtn: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: 13,
  color: '#e57373',
  textAlign: 'center',
  borderTop: '1px solid var(--warm-beige)',
};
