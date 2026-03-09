import { useState } from 'react';
import type { Preset } from '../types.ts';

interface Props {
  onComplete: (preset: Preset) => void;
}

const PRESETS: { id: Exclude<Preset, 'custom'>; label: string; desc: string }[] = [
  {
    id: '5-1-1',
    label: '5-1-1',
    desc: 'Contractions 5 min apart, lasting 1 min, for 1 hour. Most common guideline for first-time parents.',
  },
  {
    id: '4-1-1',
    label: '4-1-1',
    desc: 'Contractions 4 min apart, lasting 1 min, for 1 hour. Often recommended for second+ pregnancies or faster labor.',
  },
  {
    id: '3-1-1',
    label: '3-1-1',
    desc: 'Contractions 3 min apart, lasting 1 min, for 1 hour. Used when your provider advises closer monitoring.',
  },
];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<Exclude<Preset, 'custom'>>('5-1-1');

  const next = () => {
    if (step < 2) setStep(step + 1);
    else onComplete(selectedPreset);
  };

  const skip = () => onComplete(selectedPreset);

  return (
    <div style={container}>
      {/* Sliding viewport */}
      <div style={viewport}>
        <div
          style={{
            display: 'flex',
            width: '300%',
            height: '100%',
            transform: `translateX(${step * -33.333}%)`,
            transition: 'transform 0.4s ease',
          }}
        >
          {/* Screen 1: Welcome */}
          <div style={screen}>
            <div style={screenContent}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>&#x1F33F;</div>
              <h1 style={appName}>Theo</h1>
              <p style={tagline}>A calm contraction timer for your journey</p>
              <div style={spacer} />
              <p style={disclaimerNote}>
                Theo is an informational tool, not a medical device.
                Always follow your care provider's guidance.
              </p>
            </div>
          </div>

          {/* Screen 2: Choose Rule */}
          <div style={screen}>
            <div style={screenContent}>
              <h2 style={screenTitle}>Choose an alert rule</h2>
              <p style={screenSubtitle}>
                Your provider may recommend one. You can always change this later in Settings.
              </p>

              <div style={presetList}>
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPreset(p.id)}
                    style={{
                      ...presetCard,
                      background: selectedPreset === p.id ? 'var(--terracotta)' : 'var(--warm-beige)',
                      color: selectedPreset === p.id ? 'var(--cream)' : 'var(--text-primary)',
                    }}
                  >
                    <span style={presetLabel}>{p.label}</span>
                    <span style={{
                      ...presetDesc,
                      color: selectedPreset === p.id ? 'rgba(245,250,245,0.85)' : 'var(--text-secondary)',
                    }}>
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Screen 3: How It Works */}
          <div style={screen}>
            <div style={screenContent}>
              <h2 style={screenTitle}>How it works</h2>

              <div style={stepsContainer}>
                <div style={stepItem}>
                  <div style={stepNum}>1</div>
                  <div>
                    <div style={stepTitle}>Tap Start</div>
                    <div style={stepDesc}>when a contraction begins</div>
                  </div>
                </div>
                <div style={stepItem}>
                  <div style={stepNum}>2</div>
                  <div>
                    <div style={stepTitle}>Tap Stop</div>
                    <div style={stepDesc}>when it ends</div>
                  </div>
                </div>
                <div style={stepItem}>
                  <div style={stepNum}>3</div>
                  <div>
                    <div style={stepTitle}>Theo tracks the pattern</div>
                    <div style={stepDesc}>and alerts you when it's time to go</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={bottomBar}>
        {/* Dots */}
        <div style={dotsRow}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                ...dotStyle,
                background: step === i ? 'var(--terracotta)' : 'var(--warm-beige)',
                width: step === i ? 24 : 8,
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={btnRow}>
          {step < 2 && (
            <button onClick={skip} style={skipBtnStyle}>Skip</button>
          )}
          <button onClick={next} style={nextBtn}>
            {step === 2 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'var(--cream)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 300,
};

const viewport: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
};

const screen: React.CSSProperties = {
  width: '33.333%',
  height: '100%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 24px',
};

const screenContent: React.CSSProperties = {
  textAlign: 'center',
  width: '100%',
  maxWidth: 340,
};

const appName: React.CSSProperties = {
  fontSize: 40,
  fontWeight: 300,
  color: 'var(--text-primary)',
  letterSpacing: 2,
  marginBottom: 8,
};

const tagline: React.CSSProperties = {
  fontSize: 16,
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
};

const spacer: React.CSSProperties = { height: 32 };

const disclaimerNote: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  padding: '0 16px',
};

const screenTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 8,
};

const screenSubtitle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  marginBottom: 24,
};

const presetList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  textAlign: 'left',
};

const presetCard: React.CSSProperties = {
  padding: '16px',
  borderRadius: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  transition: 'all 0.25s ease',
  textAlign: 'left',
};

const presetLabel: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
};

const presetDesc: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.4,
};

const stepsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  textAlign: 'left',
  marginTop: 16,
};

const stepItem: React.CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

const stepNum: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'var(--terracotta)',
  color: 'var(--cream)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  fontWeight: 600,
  flexShrink: 0,
};

const stepTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginTop: 4,
};

const stepDesc: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  marginTop: 2,
};

const bottomBar: React.CSSProperties = {
  padding: '16px 24px 32px',
  flexShrink: 0,
};

const dotsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 6,
  marginBottom: 20,
};

const dotStyle: React.CSSProperties = {
  height: 8,
  borderRadius: 4,
  transition: 'all 0.3s ease',
};

const btnRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
};

const skipBtnStyle: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--text-muted)',
  padding: '14px 20px',
};

const nextBtn: React.CSSProperties = {
  flex: 1,
  padding: '14px',
  background: 'var(--terracotta)',
  color: 'var(--cream)',
  borderRadius: 12,
  fontSize: 16,
  fontWeight: 600,
  transition: 'background 0.2s',
};
