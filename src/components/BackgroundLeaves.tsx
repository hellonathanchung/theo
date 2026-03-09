// Realistic botanical leaf SVG paths
const LeafA = ({ size = 1, opacity = 0.1 }: { size?: number; opacity?: number }) => (
  <svg width={80 * size} height={140 * size} viewBox="0 0 80 140" fill="none">
    {/* Pointed oval leaf with stem */}
    <path
      d="M40 8C40 8 12 30 8 65C4 100 30 125 40 130C50 125 76 100 72 65C68 30 40 8 40 8Z"
      fill="currentColor" opacity={opacity}
    />
    {/* Center vein */}
    <path d="M40 12C40 40 40 90 40 130" stroke="currentColor" strokeWidth="0.8" opacity={opacity * 0.6} />
    {/* Side veins */}
    <path d="M40 35C32 42 22 50 16 55" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    <path d="M40 35C48 42 58 50 64 55" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    <path d="M40 55C30 62 20 72 14 78" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    <path d="M40 55C50 62 60 72 66 78" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    <path d="M40 75C32 82 24 90 18 96" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    <path d="M40 75C48 82 56 90 62 96" stroke="currentColor" strokeWidth="0.4" opacity={opacity * 0.4} />
    {/* Stem */}
    <path d="M40 130L40 140" stroke="currentColor" strokeWidth="1" opacity={opacity * 0.7} />
  </svg>
);

const LeafB = ({ size = 1, opacity = 0.1 }: { size?: number; opacity?: number }) => (
  <svg width={50 * size} height={130 * size} viewBox="0 0 50 130" fill="none">
    {/* Long narrow leaf */}
    <path
      d="M25 5C25 5 8 25 5 55C2 85 18 110 25 120C32 110 48 85 45 55C42 25 25 5 25 5Z"
      fill="currentColor" opacity={opacity}
    />
    <path d="M25 8C25 35 25 80 25 120" stroke="currentColor" strokeWidth="0.6" opacity={opacity * 0.5} />
    <path d="M25 30C19 38 12 46 8 50" stroke="currentColor" strokeWidth="0.3" opacity={opacity * 0.35} />
    <path d="M25 30C31 38 38 46 42 50" stroke="currentColor" strokeWidth="0.3" opacity={opacity * 0.35} />
    <path d="M25 55C18 63 12 72 8 78" stroke="currentColor" strokeWidth="0.3" opacity={opacity * 0.35} />
    <path d="M25 55C32 63 38 72 42 78" stroke="currentColor" strokeWidth="0.3" opacity={opacity * 0.35} />
    <path d="M25 120L25 130" stroke="currentColor" strokeWidth="0.8" opacity={opacity * 0.6} />
  </svg>
);

const Branch = ({ size = 1, opacity = 0.08 }: { size?: number; opacity?: number }) => (
  <svg width={100 * size} height={160 * size} viewBox="0 0 100 160" fill="none">
    {/* Stem */}
    <path d="M50 0C48 30 46 80 50 160" stroke="currentColor" strokeWidth="1.2" opacity={opacity * 0.7} />
    {/* Small leaves along stem */}
    <path d="M48 20C40 12 28 10 25 14C22 18 30 26 40 28C46 24 48 20 48 20Z" fill="currentColor" opacity={opacity} />
    <path d="M50 40C58 30 70 26 74 30C78 34 68 44 58 44C52 42 50 40 50 40Z" fill="currentColor" opacity={opacity} />
    <path d="M48 65C38 56 26 54 22 58C18 62 28 72 38 72C44 68 48 65 48 65Z" fill="currentColor" opacity={opacity} />
    <path d="M50 90C60 80 72 76 76 80C80 84 70 94 60 94C54 92 50 90 50 90Z" fill="currentColor" opacity={opacity} />
    <path d="M48 115C38 106 26 104 22 108C18 112 28 122 38 122C44 118 48 115 48 115Z" fill="currentColor" opacity={opacity} />
  </svg>
);

export function BackgroundLeaves() {
  return (
    <div style={wrapper} aria-hidden="true">
      {/* Top-left */}
      <div style={{ ...pos, top: -30, left: -10, transform: 'rotate(-25deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 8s ease-in-out infinite' }}>
          <LeafA size={1.3} opacity={0.09} />
        </div>
      </div>
      <div style={{ ...pos, top: 20, left: 30, transform: 'rotate(15deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 11s ease-in-out infinite' }}>
          <LeafB size={0.9} opacity={0.07} />
        </div>
      </div>

      {/* Top-right */}
      <div style={{ ...pos, top: -25, right: -5, left: 'auto', transform: 'rotate(20deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 9s ease-in-out infinite' }}>
          <LeafA size={1.2} opacity={0.09} />
        </div>
      </div>
      <div style={{ ...pos, top: 35, right: 20, left: 'auto', transform: 'rotate(-15deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 12s ease-in-out infinite' }}>
          <LeafB size={0.85} opacity={0.06} />
        </div>
      </div>

      {/* Mid-left branch */}
      <div style={{ ...pos, top: '35%', left: -20, transform: 'rotate(5deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 14s ease-in-out infinite' }}>
          <Branch size={0.8} opacity={0.06} />
        </div>
      </div>

      {/* Mid-right branch */}
      <div style={{ ...pos, top: '40%', right: -22, left: 'auto', transform: 'scaleX(-1) rotate(-5deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 13s ease-in-out infinite' }}>
          <Branch size={0.75} opacity={0.055} />
        </div>
      </div>

      {/* Bottom-left */}
      <div style={{ ...pos, bottom: 60, left: -8, top: 'auto', transform: 'rotate(175deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 10s ease-in-out infinite' }}>
          <LeafA size={1.1} opacity={0.08} />
        </div>
      </div>
      <div style={{ ...pos, bottom: 110, left: 35, top: 'auto', transform: 'rotate(155deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 12s ease-in-out infinite' }}>
          <LeafB size={0.8} opacity={0.06} />
        </div>
      </div>

      {/* Bottom-right */}
      <div style={{ ...pos, bottom: 50, right: -5, left: 'auto', top: 'auto', transform: 'rotate(-170deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 13s ease-in-out infinite' }}>
          <LeafA size={1.15} opacity={0.08} />
        </div>
      </div>
      <div style={{ ...pos, bottom: 120, right: 25, left: 'auto', top: 'auto', transform: 'rotate(-150deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 11s ease-in-out infinite' }}>
          <LeafB size={0.75} opacity={0.055} />
        </div>
      </div>
    </div>
  );
}

const wrapper: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  overflow: 'hidden',
  color: '#5B9A5B',
};

const pos: React.CSSProperties = {
  position: 'absolute',
};

const sway: React.CSSProperties = {
  transformOrigin: 'bottom center',
};
