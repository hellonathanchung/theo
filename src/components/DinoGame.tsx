import { useRef, useEffect, useState, useCallback } from 'react';

// Game constants
const CANVAS_W = 340;
const CANVAS_H = 180;
const GROUND_Y = 145;
const GRAVITY = 0.6;
const JUMP_FORCE = -11;
const BASE_SPEED = 3.5;
const SPEED_INCREMENT = 0.0008;
const OBSTACLE_GAP_MIN = 90;
const OBSTACLE_GAP_MAX = 180;

interface Obstacle {
  x: number;
  w: number;
  h: number;
  type: 'rock' | 'flower' | 'bush';
}

interface Cloud {
  x: number;
  y: number;
  w: number;
}

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    running: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('theo_dino_high') || '0'),
    sproutY: GROUND_Y,
    sproutVy: 0,
    jumping: false,
    obstacles: [] as Obstacle[],
    clouds: [] as Cloud[],
    frame: 0,
    speed: BASE_SPEED,
    nextObstacle: 120,
    gameOver: false,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayHigh, setDisplayHigh] = useState(stateRef.current.highScore);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.score = 0;
    s.sproutY = GROUND_Y;
    s.sproutVy = 0;
    s.jumping = false;
    s.obstacles = [];
    s.clouds = [
      { x: 60, y: 25, w: 40 },
      { x: 180, y: 15, w: 50 },
      { x: 290, y: 35, w: 35 },
    ];
    s.frame = 0;
    s.speed = BASE_SPEED;
    s.nextObstacle = 80;
    s.gameOver = false;
    s.running = true;
    setDisplayScore(0);
    setIsGameOver(false);
    setGameStarted(true);
  }, []);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (!s.running && !s.gameOver) {
      resetGame();
      return;
    }
    if (s.gameOver) {
      resetGame();
      return;
    }
    if (!s.jumping) {
      s.sproutVy = JUMP_FORCE;
      s.jumping = true;
    }
  }, [resetGame]);

  // Draw functions
  const drawSprout = useCallback((ctx: CanvasRenderingContext2D, y: number, frame: number) => {
    const x = 40;
    // Pot (body)
    ctx.fillStyle = '#A5D6A7';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 16, 16, 18, 3);
    ctx.fill();

    // Face
    ctx.fillStyle = '#2E3B2E';
    // Eyes
    ctx.beginPath();
    ctx.arc(x - 3, y - 9, 1.5, 0, Math.PI * 2);
    ctx.arc(x + 3, y - 9, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.beginPath();
    ctx.arc(x, y - 5, 3, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();

    // Stem
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 16);
    const sway = Math.sin(frame * 0.1) * 2;
    ctx.quadraticCurveTo(x + sway, y - 26, x + sway * 0.5, y - 30);
    ctx.stroke();

    // Leaf
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(x + sway * 0.5 + 4, y - 29, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + sway * 0.5 - 4, y - 31, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Legs (simple running animation)
    ctx.strokeStyle = '#5A6B5A';
    ctx.lineWidth = 2;
    const legPhase = frame * 0.2;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.lineTo(x - 4 + Math.sin(legPhase) * 4, y + 8);
    ctx.moveTo(x + 4, y + 2);
    ctx.lineTo(x + 4 + Math.sin(legPhase + Math.PI) * 4, y + 8);
    ctx.stroke();
  }, []);

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obs: Obstacle) => {
    if (obs.type === 'rock') {
      ctx.fillStyle = '#8A9B8A';
      ctx.beginPath();
      ctx.moveTo(obs.x, GROUND_Y + 2);
      ctx.lineTo(obs.x + obs.w * 0.3, GROUND_Y - obs.h);
      ctx.lineTo(obs.x + obs.w * 0.7, GROUND_Y - obs.h + 4);
      ctx.lineTo(obs.x + obs.w, GROUND_Y + 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = '#A5B6A5';
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w * 0.3, GROUND_Y - obs.h);
      ctx.lineTo(obs.x + obs.w * 0.5, GROUND_Y - obs.h + 3);
      ctx.lineTo(obs.x + obs.w * 0.35, GROUND_Y - obs.h + 8);
      ctx.fill();
    } else if (obs.type === 'flower') {
      // Stem
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w / 2, GROUND_Y + 2);
      ctx.lineTo(obs.x + obs.w / 2, GROUND_Y - obs.h + 6);
      ctx.stroke();
      // Petals
      ctx.fillStyle = '#E57373';
      for (let a = 0; a < 5; a++) {
        const angle = (a / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(
          obs.x + obs.w / 2 + Math.cos(angle) * 5,
          GROUND_Y - obs.h + 3 + Math.sin(angle) * 5,
          4, 3, angle, 0, Math.PI * 2
        );
        ctx.fill();
      }
      // Center
      ctx.fillStyle = '#FFEB3B';
      ctx.beginPath();
      ctx.arc(obs.x + obs.w / 2, GROUND_Y - obs.h + 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Bush
      ctx.fillStyle = '#81C784';
      ctx.beginPath();
      ctx.arc(obs.x + obs.w * 0.3, GROUND_Y - obs.h * 0.5, obs.w * 0.35, 0, Math.PI * 2);
      ctx.arc(obs.x + obs.w * 0.7, GROUND_Y - obs.h * 0.5, obs.w * 0.35, 0, Math.PI * 2);
      ctx.arc(obs.x + obs.w * 0.5, GROUND_Y - obs.h * 0.7, obs.w * 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Darker spots
      ctx.fillStyle = '#66BB6A';
      ctx.beginPath();
      ctx.arc(obs.x + obs.w * 0.4, GROUND_Y - obs.h * 0.55, obs.w * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.fillStyle = 'rgba(232, 240, 232, 0.7)';
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.w * 0.3, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.w * 0.25, cloud.y - 5, cloud.w * 0.25, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.w * 0.5, cloud.y, cloud.w * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      const s = stateRef.current;
      // Clear
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      grad.addColorStop(0, '#F5FAF5');
      grad.addColorStop(1, '#E8F0E8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Ground
      ctx.fillStyle = '#C8E6C9';
      ctx.fillRect(0, GROUND_Y + 8, CANVAS_W, CANVAS_H - GROUND_Y);
      ctx.strokeStyle = '#A5D6A7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 8);
      ctx.lineTo(CANVAS_W, GROUND_Y + 8);
      ctx.stroke();

      // Ground detail — grass tufts
      ctx.strokeStyle = '#81C784';
      ctx.lineWidth = 1;
      for (let gx = 10; gx < CANVAS_W; gx += 25) {
        const offset = (gx * 7 + s.frame * s.speed * 0.5) % CANVAS_W;
        const px = (CANVAS_W - offset) % CANVAS_W;
        ctx.beginPath();
        ctx.moveTo(px, GROUND_Y + 8);
        ctx.lineTo(px - 2, GROUND_Y + 4);
        ctx.moveTo(px, GROUND_Y + 8);
        ctx.lineTo(px + 2, GROUND_Y + 3);
        ctx.stroke();
      }

      // Clouds
      s.clouds.forEach((c) => drawCloud(ctx, c));

      if (s.running && !s.gameOver) {
        s.frame++;
        s.speed = BASE_SPEED + s.frame * SPEED_INCREMENT;

        // Move clouds
        s.clouds.forEach((c) => { c.x -= s.speed * 0.15; });
        s.clouds = s.clouds.filter((c) => c.x + c.w > -20);
        if (s.clouds.length < 3 && Math.random() < 0.005) {
          s.clouds.push({ x: CANVAS_W + 20, y: 15 + Math.random() * 30, w: 30 + Math.random() * 25 });
        }

        // Physics
        s.sproutVy += GRAVITY;
        s.sproutY += s.sproutVy;
        if (s.sproutY >= GROUND_Y) {
          s.sproutY = GROUND_Y;
          s.sproutVy = 0;
          s.jumping = false;
        }

        // Spawn obstacles
        s.nextObstacle--;
        if (s.nextObstacle <= 0) {
          const types: Obstacle['type'][] = ['rock', 'flower', 'bush'];
          const type = types[Math.floor(Math.random() * types.length)];
          const h = type === 'rock' ? 16 + Math.random() * 12 : type === 'flower' ? 20 + Math.random() * 10 : 14 + Math.random() * 8;
          const w = type === 'bush' ? 22 + Math.random() * 10 : 14 + Math.random() * 8;
          s.obstacles.push({ x: CANVAS_W + 10, w, h, type });
          s.nextObstacle = OBSTACLE_GAP_MIN + Math.random() * (OBSTACLE_GAP_MAX - OBSTACLE_GAP_MIN);
        }

        // Move obstacles
        s.obstacles.forEach((o) => { o.x -= s.speed; });
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > -20);

        // Collision detection
        const sproutBox = { x: 32, y: s.sproutY - 30, w: 16, h: 38 };
        for (const o of s.obstacles) {
          const obsBox = { x: o.x, y: GROUND_Y - o.h, w: o.w, h: o.h + 2 };
          if (
            sproutBox.x < obsBox.x + obsBox.w &&
            sproutBox.x + sproutBox.w > obsBox.x &&
            sproutBox.y + sproutBox.h > obsBox.y &&
            sproutBox.y < obsBox.y + obsBox.h
          ) {
            s.gameOver = true;
            s.running = false;
            if (s.score > s.highScore) {
              s.highScore = s.score;
              localStorage.setItem('theo_dino_high', String(s.highScore));
              setDisplayHigh(s.highScore);
            }
            setIsGameOver(true);
            break;
          }
        }

        // Score
        s.score = Math.floor(s.frame / 6);
        if (s.frame % 6 === 0) setDisplayScore(s.score);
      }

      // Draw obstacles
      s.obstacles.forEach((o) => drawObstacle(ctx, o));

      // Draw sprout
      drawSprout(ctx, s.sproutY, s.running ? s.frame : 0);

      // Game over overlay
      if (s.gameOver) {
        ctx.fillStyle = 'rgba(245, 250, 245, 0.6)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = '#2E3B2E';
        ctx.font = '600 18px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', CANVAS_W / 2, CANVAS_H / 2 - 10);
        ctx.font = '13px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#5A6B5A';
        ctx.fillText('Tap to play again', CANVAS_W / 2, CANVAS_H / 2 + 12);
      }

      // Start screen
      if (!s.running && !s.gameOver) {
        ctx.fillStyle = '#2E3B2E';
        ctx.font = '600 16px -apple-system, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Tap to Start!', CANVAS_W / 2, CANVAS_H / 2 - 5);
        ctx.font = '12px -apple-system, system-ui, sans-serif';
        ctx.fillStyle = '#8A9B8A';
        ctx.fillText('Help Sprout jump over obstacles', CANVAS_W / 2, CANVAS_H / 2 + 14);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawSprout, drawObstacle, drawCloud]);

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  return (
    <div style={container}>
      <div style={headerRow}>
        <span style={titleLabel}>SPROUT JUMP</span>
        <div style={scoresRow}>
          <span style={scoreLabel}>{String(displayScore).padStart(4, '0')}</span>
          <span style={highLabel}>HI {String(displayHigh).padStart(4, '0')}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={jump}
        onTouchStart={(e) => { e.preventDefault(); jump(); }}
        style={canvasStyle}
      />
      {!gameStarted && (
        <div style={hint}>Tap the screen or press Space to jump</div>
      )}
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
  fontVariantNumeric: 'tabular-nums',
};

const highLabel: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  fontVariantNumeric: 'tabular-nums',
};

const canvasStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 16,
  border: '1px solid var(--warm-beige)',
  touchAction: 'none',
  cursor: 'pointer',
};

const hint: React.CSSProperties = {
  textAlign: 'center',
  fontSize: 12,
  color: 'var(--text-muted)',
  marginTop: 8,
};
