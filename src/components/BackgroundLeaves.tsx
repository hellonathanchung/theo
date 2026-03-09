export function BackgroundLeaves() {
  return (
    <div style={wrapper} aria-hidden="true">
      {/* Top-left cluster */}
      <div style={{ ...pos, top: -20, left: 0 }}>
        <div style={{ ...sway, animation: 'leafSway1 8s ease-in-out infinite' }}>
          <svg width="150" height="180" viewBox="0 0 150 180" fill="none">
            <path d="M40 170C40 170 8 120 12 65C16 10 55 2 70 0C70 0 68 25 65 50C62 80 55 110 40 170Z" fill="currentColor" opacity="0.10" />
            <path d="M70 0C68 30 62 65 40 170" stroke="currentColor" strokeWidth="0.8" opacity="0.06" />
            <path d="M58 30C50 38 44 50 40 65" stroke="currentColor" strokeWidth="0.4" opacity="0.04" />
            <path d="M62 55C52 60 46 72 42 90" stroke="currentColor" strokeWidth="0.4" opacity="0.04" />
          </svg>
        </div>
      </div>

      <div style={{ ...pos, top: 40, left: 40, transform: 'rotate(30deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 11s ease-in-out infinite' }}>
          <svg width="90" height="120" viewBox="0 0 90 120" fill="none">
            <path d="M25 115C25 115 5 70 12 35C19 0 45 0 45 0C45 0 40 30 36 55C32 80 25 115 25 115Z" fill="currentColor" opacity="0.08" />
            <path d="M45 0C42 25 35 60 25 115" stroke="currentColor" strokeWidth="0.5" opacity="0.05" />
          </svg>
        </div>
      </div>

      <div style={{ ...pos, top: 110, left: -15, transform: 'rotate(-20deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 13s ease-in-out infinite' }}>
          <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
            <path d="M22 105C22 105 2 65 8 30C14 0 38 2 40 0C40 0 38 28 35 48C32 68 22 105 22 105Z" fill="currentColor" opacity="0.07" />
          </svg>
        </div>
      </div>

      {/* Top-right cluster */}
      <div style={{ ...pos, top: -15, right: 5, left: 'auto', transform: 'scaleX(-1)' }}>
        <div style={{ ...sway, animation: 'leafSway2 9s ease-in-out infinite' }}>
          <svg width="140" height="170" viewBox="0 0 150 180" fill="none">
            <path d="M40 170C40 170 8 120 12 65C16 10 55 2 70 0C70 0 68 25 65 50C62 80 55 110 40 170Z" fill="currentColor" opacity="0.10" />
            <path d="M70 0C68 30 62 65 40 170" stroke="currentColor" strokeWidth="0.8" opacity="0.06" />
            <path d="M58 30C50 38 44 50 40 65" stroke="currentColor" strokeWidth="0.4" opacity="0.04" />
          </svg>
        </div>
      </div>

      <div style={{ ...pos, top: 65, right: 10, left: 'auto', transform: 'scaleX(-1) rotate(25deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 12s ease-in-out infinite' }}>
          <svg width="85" height="110" viewBox="0 0 90 120" fill="none">
            <path d="M25 115C25 115 5 70 12 35C19 0 45 0 45 0C45 0 40 30 36 55C32 80 25 115 25 115Z" fill="currentColor" opacity="0.07" />
            <path d="M45 0C42 25 35 60 25 115" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
          </svg>
        </div>
      </div>

      {/* Mid-left — eucalyptus style round leaf */}
      <div style={{ ...pos, top: '38%', left: -5, transform: 'rotate(15deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 15s ease-in-out infinite' }}>
          <svg width="70" height="95" viewBox="0 0 60 80" fill="none">
            <ellipse cx="22" cy="30" rx="18" ry="26" fill="currentColor" opacity="0.05" />
            <path d="M22 4C22 30 22 56 22 80" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
          </svg>
        </div>
      </div>

      {/* Mid-right — eucalyptus style */}
      <div style={{ ...pos, top: '42%', right: -3, left: 'auto', transform: 'scaleX(-1) rotate(-12deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 14s ease-in-out infinite' }}>
          <svg width="65" height="90" viewBox="0 0 60 80" fill="none">
            <ellipse cx="22" cy="30" rx="18" ry="26" fill="currentColor" opacity="0.05" />
            <path d="M22 4C22 30 22 56 22 80" stroke="currentColor" strokeWidth="0.5" opacity="0.04" />
          </svg>
        </div>
      </div>

      {/* Bottom-left */}
      <div style={{ ...pos, bottom: 80, left: 0, top: 'auto', transform: 'rotate(165deg)' }}>
        <div style={{ ...sway, animation: 'leafSway3 10s ease-in-out infinite' }}>
          <svg width="130" height="155" viewBox="0 0 150 180" fill="none">
            <path d="M40 170C40 170 8 120 12 65C16 10 55 2 70 0C70 0 68 25 65 50C62 80 55 110 40 170Z" fill="currentColor" opacity="0.08" />
            <path d="M70 0C68 30 62 65 40 170" stroke="currentColor" strokeWidth="0.8" opacity="0.05" />
          </svg>
        </div>
      </div>

      <div style={{ ...pos, bottom: 140, left: 30, top: 'auto', transform: 'rotate(145deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 12s ease-in-out infinite' }}>
          <svg width="70" height="95" viewBox="0 0 90 120" fill="none">
            <path d="M25 115C25 115 5 70 12 35C19 0 45 0 45 0C45 0 40 30 36 55C32 80 25 115 25 115Z" fill="currentColor" opacity="0.06" />
          </svg>
        </div>
      </div>

      {/* Bottom-right */}
      <div style={{ ...pos, bottom: 65, right: 5, left: 'auto', top: 'auto', transform: 'scaleX(-1) rotate(170deg)' }}>
        <div style={{ ...sway, animation: 'leafSway1 13s ease-in-out infinite' }}>
          <svg width="120" height="145" viewBox="0 0 150 180" fill="none">
            <path d="M40 170C40 170 8 120 12 65C16 10 55 2 70 0C70 0 68 25 65 50C62 80 55 110 40 170Z" fill="currentColor" opacity="0.08" />
            <path d="M70 0C68 30 62 65 40 170" stroke="currentColor" strokeWidth="0.8" opacity="0.05" />
            <path d="M62 55C52 60 46 72 42 90" stroke="currentColor" strokeWidth="0.4" opacity="0.03" />
          </svg>
        </div>
      </div>

      <div style={{ ...pos, bottom: 130, right: 25, left: 'auto', top: 'auto', transform: 'scaleX(-1) rotate(155deg)' }}>
        <div style={{ ...sway, animation: 'leafSway2 11s ease-in-out infinite' }}>
          <svg width="65" height="85" viewBox="0 0 60 80" fill="none">
            <ellipse cx="22" cy="30" rx="18" ry="26" fill="currentColor" opacity="0.05" />
            <path d="M22 4C22 30 22 56 22 80" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
          </svg>
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
  color: '#66BB6A',
};

const pos: React.CSSProperties = {
  position: 'absolute',
};

const sway: React.CSSProperties = {
  transformOrigin: 'bottom center',
};
