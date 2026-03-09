import { useState, useEffect, useCallback } from 'react';

const FACTS = [
  { emoji: '👶', text: 'Babies can recognize their mother\'s voice from inside the womb — they\'ve been listening for months!' },
  { emoji: '💪', text: 'The uterus is the strongest muscle in the human body by weight. You\'re literally superhuman right now.' },
  { emoji: '🌊', text: 'Contractions work like ocean waves — they build, peak, and recede. Each one brings you closer.' },
  { emoji: '🧒', text: 'Newborns can see about 8–12 inches — just far enough to see your face while being held.' },
  { emoji: '❤️', text: 'A baby\'s heart beats about 120–160 times per minute — roughly twice as fast as yours.' },
  { emoji: '🤏', text: 'Babies are born with about 300 bones. Some fuse together, leaving adults with just 206.' },
  { emoji: '👃', text: 'Newborns have a strong sense of smell and can recognize their mother\'s scent right after birth.' },
  { emoji: '🫧', text: 'Babies practice breathing in the womb by inhaling and exhaling amniotic fluid.' },
  { emoji: '🌙', text: 'Most babies are born between midnight and 6 AM. Night owls from the start!' },
  { emoji: '🎵', text: 'Babies can hear and remember music played during the third trimester. Your playlist matters!' },
  { emoji: '😊', text: 'Laughing during labor can help release endorphins — natural painkillers your body makes.' },
  { emoji: '🧠', text: 'A newborn\'s brain is about 25% of its adult size and doubles in the first year.' },
  { emoji: '✨', text: 'The hormone oxytocin that drives contractions is the same "love hormone" released during hugs.' },
  { emoji: '👣', text: 'Every baby is born with unique fingerprints — they develop in the womb around 3 months.' },
  { emoji: '🌱', text: 'Fun fact: babies can taste what their mother eats! Flavors pass through to amniotic fluid.' },
  { emoji: '😴', text: 'Newborns sleep 14–17 hours a day, but rarely more than 2–3 hours at a stretch.' },
  { emoji: '👁️', text: 'Most babies are born with blue or grey eyes. Their permanent color can take up to a year to develop.' },
  { emoji: '🤝', text: 'A baby\'s grip is strong enough to support their own body weight. Tiny but mighty!' },
  { emoji: '🫁', text: 'Deep, slow breathing during contractions helps deliver more oxygen to your baby.' },
  { emoji: '🌍', text: 'About 385,000 babies are born every day worldwide. You\'re part of something amazing.' },
  { emoji: '🦷', text: 'Baby teeth start forming in the womb — they\'re just hidden under the gums at birth.' },
  { emoji: '🧬', text: 'Your baby has already developed their own unique DNA by the time of conception — one of a kind!' },
  { emoji: '💤', text: 'Between contractions is the perfect time to rest. Even a few seconds of relaxation helps.' },
  { emoji: '🎈', text: 'Babies can hiccup in the womb! Those little rhythmic bumps you might have felt were hiccups.' },
  { emoji: '🌸', text: 'You\'re doing incredible work right now. Every contraction is a step closer to meeting your baby.' },
  { emoji: '🐘', text: 'Human pregnancy is 9 months, but elephants carry their babies for 22 months. You\'ve got this!' },
  { emoji: '🦘', text: 'Kangaroo babies are born the size of a jellybean and crawl into mom\'s pouch. Nature is wild!' },
  { emoji: '🏊', text: 'Babies are natural swimmers — they instinctively hold their breath underwater for a few months after birth.' },
  { emoji: '😂', text: 'Babies start smiling socially around 6–8 weeks. That first real smile is worth everything.' },
  { emoji: '🎤', text: 'Babies babble in the rhythm of their native language. They\'re learning to talk before they can speak!' },
];

export function FunFacts() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const [fading, setFading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [shared, setShared] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextFact = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % FACTS.length);
      setFading(false);
    }, 300);
  }, []);

  const prevFact = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + FACTS.length) % FACTS.length);
      setFading(false);
    }, 300);
  }, []);

  const shareFact = useCallback(async () => {
    const fact = FACTS[index];
    const shareText = `${fact.emoji} ${fact.text}\n\n— from Theo, a contraction timer app`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Last resort: select trick
    }
  }, [index]);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextFact();
    } else if (isRightSwipe) {
      prevFact();
    }
  };

  // Auto-rotate every 12 seconds (only when expanded)
  useEffect(() => {
    if (collapsed) return;
    const interval = setInterval(nextFact, 12000);
    return () => clearInterval(interval);
  }, [nextFact, collapsed]);

  const fact = FACTS[index];

  return (
    <div style={container}>
      {/* Header — always visible, acts as toggle */}
      <button onClick={() => setCollapsed(!collapsed)} style={headerRow}>
        <span style={headerLabel}>DID YOU KNOW?</span>
        <span style={{
          ...chevron,
          transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
        }}>
          ▾
        </span>
      </button>

      {/* Collapsible content */}
      {!collapsed && (
        <div style={{ animation: 'fadeIn 0.25s ease' }}>
          {/* Nav row */}
          <div style={navRow}>
            <button onClick={prevFact} style={navBtn}>← Prev</button>
            <button onClick={shareFact} style={shareBtn}>
              {shared ? '✓ Copied!' : '↗ Share'}
            </button>
            <button onClick={nextFact} style={navBtn}>Next →</button>
          </div>

          {/* Fact card */}
          <div
            style={{
              ...cardStyle,
              opacity: fading ? 0 : 1,
              transform: fading ? 'translateY(4px)' : 'translateY(0)',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <span style={emojiStyle}>{fact.emoji}</span>
            <p style={textStyle}>{fact.text}</p>
          </div>

          {/* Dots */}
          <div style={dotsRow}>
            {Array.from({ length: Math.min(5, FACTS.length) }, (_, i) => {
              const dotIdx = (Math.floor(index / 5) * 5 + i) % FACTS.length;
              return (
                <div
                  key={i}
                  style={{
                    ...dotStyle,
                    background: dotIdx === index ? 'var(--terracotta)' : 'var(--warm-beige)',
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const container: React.CSSProperties = {
  padding: '0 0 16px',
};

const headerRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
  width: '100%',
  padding: '6px 0',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const headerLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
};

const chevron: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  transition: 'transform 0.25s ease',
};

const navRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
};

const navBtn: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--terracotta)',
  fontWeight: 500,
};

const shareBtn: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  fontWeight: 500,
  padding: '4px 12px',
  borderRadius: 8,
  background: 'var(--warm-beige)',
  transition: 'all 0.2s ease',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--warm-beige)',
  borderRadius: 16,
  padding: '20px 16px',
  textAlign: 'center',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  minHeight: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  cursor: 'grab',
  userSelect: 'none',
  touchAction: 'pan-y',
};

const emojiStyle: React.CSSProperties = {
  fontSize: 28,
};

const textStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  maxWidth: 280,
};

const dotsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 4,
  marginTop: 8,
};

const dotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  transition: 'background 0.3s ease',
};
