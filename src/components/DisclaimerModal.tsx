interface Props {
  onClose: () => void;
}

export function DisclaimerModal({ onClose }: Props) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={title}>Medical Disclaimer</h3>

        <div style={body}>
          <p style={paragraph}>
            Theo is an informational timing tool designed to help you track contraction
            patterns. It is <strong>not a medical device</strong> and has not been evaluated
            by the FDA or any other regulatory body.
          </p>
          <p style={paragraph}>
            This app does not provide medical advice, diagnosis, or treatment. The alerts
            and guidelines provided (such as the 5-1-1, 4-1-1, and 3-1-1 rules) are
            general references only and may not apply to your specific situation.
          </p>
          <p style={paragraph}>
            Always follow the specific guidance of your <strong>healthcare provider,
            obstetrician, or midwife</strong>. Every pregnancy is different, and your
            care team knows your situation best.
          </p>
          <p style={paragraph}>
            If you are experiencing a medical emergency, <strong>call 911</strong> (or your
            local emergency number) immediately.
          </p>
        </div>

        <button onClick={onClose} style={closeBtn}>Got It</button>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  animation: 'fadeInOverlay 0.2s ease',
  padding: 20,
};

const modal: React.CSSProperties = {
  width: '100%',
  maxWidth: 380,
  background: 'var(--cream)',
  borderRadius: 20,
  padding: '24px 20px',
  animation: 'fadeIn 0.3s ease',
};

const title: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: 16,
  textAlign: 'center',
};

const body: React.CSSProperties = {
  maxHeight: '50vh',
  overflow: 'auto',
};

const paragraph: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  marginBottom: 12,
};

const closeBtn: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: 'var(--terracotta)',
  color: 'var(--cream)',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 600,
  marginTop: 8,
  transition: 'background 0.2s',
};
