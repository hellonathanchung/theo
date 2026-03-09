import { FunFacts } from './FunFacts.tsx';
import { DinoGame } from './DinoGame.tsx';

export function RelaxScreen() {
  return (
    <div style={container}>
      <h2 style={titleStyle}>Relax</h2>

      <div style={scrollArea}>
        <div style={section}>
          <FunFacts />
        </div>

        <div style={divider} />

        <div style={section}>
          <DinoGame />
        </div>

        <div style={footerNote}>
          <p>Take a deep breath. You're doing amazing. 🌿</p>
        </div>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: '20px 0',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  padding: '0 20px 12px',
  color: 'var(--text-primary)',
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
