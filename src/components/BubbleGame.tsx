import { useRef, useEffect, useState, useCallback } from 'react';

const CANVAS_W = 340;
const CANVAS_H = 220;
const SPAWN_RATE = 0.025;
const MAX_BUBBLES = 15;

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  speed: number;
  color: string;
  wobbleOffset: number;
  wobbleSpeed: number;
  opacity: number;
  popping: boolean;
  popFrame: number;
}

const COLORS = [
  'rgba(129, 199, 132, 0.6)',  // green
  'rgba(165, 214, 167, 0.6)',  // light green
  'rgba(200, 230, 201, 0.5)',  // pale green
  'rgba(76, 175, 80, 0.5)',    // deep green
  'rgba(156, 204, 101, 0.5)',  // lime
  'rgba(174, 213, 129, 0.5)',  // light lime
];

export function BubbleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    bubbles: [] as Bubble[],
    nextId: 0,
    score: 0,
    frame: 0,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('theo_bubble_high') || '0')
  );

  const popBubble = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const s = stateRef.current;
    // Find closest bubble to tap
    let closest: Bubble | null = null;
    let closestDist = Infinity;
    for (const b of s.bubbles) {
      if (b.popping) continue;
      const dx = b.x - x;
      const dy = b.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < b.r + 10 && dist < closestDist) {
        closest = b;
        closestDist = dist;
      }
    }
    if (closest) {
      closest.popping = true;
      closest.popFrame = 0;
      s.score++;
      setDisplayScore(s.score);
      if (s.score > parseInt(localStorage.getItem('theo_bubble_high') || '0')) {
        localStorage.setItem('theo_bubble_high', String(s.score));
        setHighScore(s.score);
      }
    }
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      const s = stateRef.current;
      s.frame++;

      // Clear
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Background gradient (underwater feel)
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, '#E8F0E8');
      grad.addColorStop(1, '#F5FAF5');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Spawn bubbles from bottom
      if (s.bubbles.filter(b => !b.popping).length < MAX_BUBBLES && Math.random() < SPAWN_RATE) {
        const r = 14 + Math.random() * 20;
        s.bubbles.push({
          id: s.nextId++,
          x: r + Math.random() * (CANVAS_W - r * 2),
          y: CANVAS_H + r,
          r,
          speed: 0.3 + Math.random() * 0.6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.02,
          opacity: 1,
          popping: false,
          popFrame: 0,
        });
      }

      // Update bubbles
      for (const b of s.bubbles) {
        if (b.popping) {
          b.popFrame++;
          b.opacity = Math.max(0, 1 - b.popFrame / 12);
          b.r += 1.5; // Expand
        } else {
          b.y -= b.speed;
          b.x += Math.sin(s.frame * b.wobbleSpeed + b.wobbleOffset) * 0.4;
        }
      }

      // Remove off-screen or fully popped
      s.bubbles = s.bubbles.filter(b =>
        b.popping ? b.popFrame < 12 : b.y + b.r > -10
      );

      // Draw bubbles
      for (const b of s.bubbles) {
        ctx.globalAlpha = b.opacity;

        // Main bubble
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Shine highlight
        if (!b.popping) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.ellipse(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.3, b.r * 0.2, -0.5, 0, Math.PI * 2);
          ctx.fill();

          // Border
          ctx.strokeStyle = 'rgba(76, 175, 80, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Pop sparkles
          const sparkles = 6;
          ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
          for (let i = 0; i < sparkles; i++) {
            const angle = (i / sparkles) * Math.PI * 2;
            const dist = b.r * 0.8 + b.popFrame * 2;
            const sx = b.x + Math.cos(angle) * dist;
            const sy = b.y + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(sx, sy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Instruction text when no bubbles popped yet
      if (s.score === 0 && s.frame > 60) {
        ctx.fillStyle = '#8A9B8A';
        ctx.font = '14px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Tap the bubbles!', CANVAS_W / 2, CANVAS_H / 2);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={container}>
      <div style={headerRow}>
        <span style={titleLabel}>BUBBLE POP</span>
        <div style={scoresRow}>
          <span style={scoreLabel}>{displayScore} popped</span>
          <button
            onClick={() => {
              if (highScore > 0 && confirm('Reset high score?')) {
                localStorage.removeItem('theo_bubble_high');
                setHighScore(0);
              }
            }}
            style={highBtn}
          >
            HI {highScore}
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={(e) => popBubble(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          e.preventDefault();
          const touch = e.touches[0];
          popBubble(touch.clientX, touch.clientY);
        }}
        style={canvasStyle}
      />
    </div>
  );
}

const container: React.CSSProperties = {
  padding: '0',
};

const headerRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
};

const titleLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
};

const scoresRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
};

const scoreLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const highBtn: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: 4,
};

const canvasStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid var(--warm-beige)',
  touchAction: 'none',
  cursor: 'pointer',
};
