interface Props {
  message: string;
  onDismiss: () => void;
}

export function AlertBanner({ message, onDismiss }: Props) {
  return (
    <div style={banner} className="safe-top">
      <p style={msgStyle}>{message}</p>
      <button onClick={onDismiss} style={dismissBtn}>OK</button>
    </div>
  );
}

const banner: React.CSSProperties = {
  background: 'var(--soft-coral)',
  padding: '16px 20px',
  paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  animation: 'slideDown 0.4s ease',
  flexShrink: 0,
};

const msgStyle: React.CSSProperties = {
  flex: 1,
  fontSize: 14,
  color: 'var(--cream)',
  fontWeight: 500,
  lineHeight: 1.4,
};

const dismissBtn: React.CSSProperties = {
  padding: '8px 18px',
  background: 'var(--cream)',
  borderRadius: 20,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--terracotta)',
  flexShrink: 0,
};
