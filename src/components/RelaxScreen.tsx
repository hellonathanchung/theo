import { FunFacts } from './FunFacts.tsx';
import { DinoGame } from './DinoGame.tsx';
import { BubbleGame } from './BubbleGame.tsx';
import { useTimer } from '../hooks/useTimer.ts';
import { formatDuration } from '../utils/format.ts';
import type { useContractions } from '../hooks/useContractions.ts';

interface Props {
  app: ReturnType<typeof useContractions>;
}

export function RelaxScreen({ app }: Props) {
  const elapsed = useTimer(app.isActive, app.activeStart);

  return (
    <div style={container}>
      <h2 style={titleStyle}>Relax</h2>

      {/* Compact contraction timer */}
      <div style={timerBar}>
        <div style={timerLeft}>
          {app.isActive ? (
            <>
              <div style={liveDot} />
              <span style={timerText}>{formatDuration(elapsed)}</span>
            </>
          ) : (
            <span style={timerTextIdle}>
              {app.contractions.length > 0
                ? `${app.contractions.length} contraction${app.contractions.length !== 1 ? 's' : ''}`
                : 'No contractions yet'}
            </span>
          )}
        </div>
        <button
          onClick={app.isActive ? app.stopContraction : app.startContraction}
          style={{
            ...timerBtn,
            background: app.isActive ? '#E57373' : 'var(--terracotta)',
          }}
        >
          {app.isActive ? 'Stop' : 'Start'}
        </button>
      </div>

      <div style={scrollArea}>
        <div style={section}>
          <FunFacts />
        </div>

        <div style={divider} />

        <div style={section}>
          <DinoGame />
        </div>

        <div style={divider} />

        <div style={section}>
          <BubbleGame />
        </div>

        <div style={footerNote}>
          <p>Take a deep breath. You're doing amazing. 🌿</p>
        </div>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: '20px 0 0',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  padding: '0 20px 8px',
  color: 'var(--text-primary)',
};

const timerBar: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '0 16px 12px',
  padding: '10px 14px',
  background: 'var(--warm-beige)',
  borderRadius: 14,
  animation: 'fadeIn 0.3s ease',
};

const timerLeft: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const liveDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: '#E57373',
  animation: 'breathe 1.5s ease-in-out infinite',
  flexShrink: 0,
};

const timerText: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--text-primary)',
};

const timerTextIdle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
};

const timerBtn: React.CSSProperties = {
  padding: '8px 20px',
  borderRadius: 10,
  color: 'white',
  fontSize: 14,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.2s',
};

const scrollArea: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '0 16px',
};

const section: React.CSSProperties = {
  marginBottom: 8,
};

const divider: React.CSSProperties = {
  height: 1,
  background: 'var(--warm-beige)',
  margin: '8px 0 16px',
};

const footerNote: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 14,
  color: 'var(--text-muted)',
  padding: '16px 0 24px',
  lineHeight: 1.6,
};
