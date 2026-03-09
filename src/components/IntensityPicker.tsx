import type { Intensity } from '../types.ts';

interface Props {
  onSelect: (intensity: Intensity) => void;
  onSkip: () => void;
}

const INTENSITIES: { id: Intensity; label: string; dots: number; color: string }[] = [
  { id: 'mild', label: 'Mild', dots: 1, color: 'var(--warm-amber)' },
  { id: 'moderate', label: 'Moderate', dots: 2, color: 'var(--soft-coral)' },
  { id: 'strong', label: 'Strong', dots: 3, color: 'var(--terracotta)' },
];

export function IntensityPicker({ onSelect, onSkip }: Props) {
  return (
    <div style={overlay}>
      <div style={sheet}>
        <div style={title}>How did that feel?</div>

        <div style={row}>
          {INTENSITIES.map((item) => (
            <button key={item.id} onClick={() => onSelect(item.id)} style={optionBtn}>
              <div style={dotsRow}>
                {Array.from({ length: item.dots }).map((_, i) => (
                  <div key={i} style={{ ...dot, background: item.color }} />
                ))}
              </div>
              <span style={optionLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onSkip} style={skipBtn}>
          Skip
        </button>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 100,
  animation: 'fadeInOverlay 0.2s ease',
};

const sheet: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  background: 'var(--cream)',
  borderRadius: '20px 20px 0 0',
  padding: '24px 20px 32px',
  animation: 'slideUp 0.3s ease',
};

const title: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 20,
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
};

const optionBtn: React.CSSProperties = {
  flex: 1,
  padding: '16px 8px',
  borderRadius: 16,
  background: 'var(--warm-beige)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  transition: 'all 0.2s',
};

const dotsRow: React.CSSProperties = {
  display: 'flex',
  gap: 4,
  justifyContent: 'center',
  height: 12,
  alignItems: 'center',
};

const dot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
};

const optionLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const skipBtn: React.CSSProperties = {
  display: 'block',
  margin: '16px auto 0',
  fontSize: 14,
  color: 'var(--text-muted)',
  padding: '8px 16px',
};
