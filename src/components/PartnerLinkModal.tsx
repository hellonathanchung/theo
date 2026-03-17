import type { Contraction } from '../types.ts';
import type { PartnerPayload, ParseError } from '../utils/shareLink.ts';
import {
  mergeContractions,
  detectTemporalOverlap,
  detectTimeMismatch,
  encodePartnerLink,
} from '../utils/shareLink.ts';
import { formatTime } from '../utils/format.ts';

interface Props {
  // Error state — link was invalid, expired, etc.
  error?: ParseError;
  // Success state — valid payload
  payload?: PartnerPayload;
  // Current local contractions (may be empty)
  localContractions: Contraction[];
  onMerge: (merged: Contraction[]) => void;
  onReplace: (incoming: Contraction[]) => void;
  onDismiss: () => void;
}

export function PartnerLinkModal({
  error,
  payload,
  localContractions,
  onMerge,
  onReplace,
  onDismiss,
}: Props) {
  const hasLocal = localContractions.length > 0;
  const incoming = payload?.contractions ?? [];
  const hasMismatch = hasLocal && detectTimeMismatch(localContractions, incoming);
  const hasBothTracking = hasLocal && detectTemporalOverlap(localContractions, incoming);

  // After merging, generate a new shareable link so the other partner
  // can also get the combined data.
  const [mergedLink, setMergedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMerge = () => {
    const merged = mergeContractions(localContractions, incoming);
    onMerge(merged);
    const link = encodePartnerLink(merged);
    setMergedLink(link);
  };

  const handleCopy = async () => {
    if (!mergedLink) return;
    try {
      await navigator.clipboard.writeText(mergedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text
    }
  };

  // ── Show merged-link follow-up ──────────────────────────────────────────────
  if (mergedLink) {
    return (
      <Overlay onDismiss={onDismiss}>
        <span style={{ fontSize: 32 }}>🔗</span>
        <h3 style={titleStyle}>Data combined!</h3>
        <p style={bodyStyle}>
          You now have all {mergeContractions(localContractions, incoming).length} contractions.
          Share this new link with your partner so they're up to date too.
        </p>
        <button onClick={handleCopy} style={primaryBtn}>
          {copied ? '✓ Copied!' : 'Copy link for partner'}
        </button>
        <button onClick={onDismiss} style={ghostBtn}>
          Done
        </button>
      </Overlay>
    );
  }

  // ── Error states ────────────────────────────────────────────────────────────
  if (error) {
    const messages: Record<ParseError, { icon: string; title: string; body: string }> = {
      self: {
        icon: '😅',
        title: "That's your own link",
        body: 'This link was generated on this device. To share with your partner, send them this link — they need to open it on their own device.',
      },
      expired: {
        icon: '⏰',
        title: 'Link expired',
        body: 'This link is older than 6 hours. Ask your partner to generate a fresh one from their Settings screen.',
      },
      empty: {
        icon: '📭',
        title: "Partner hasn't started yet",
        body: "Your partner's link was shared before they recorded any contractions. Ask them to share again once they've started tracking.",
      },
      invalid: {
        icon: '⚠️',
        title: 'Invalid link',
        body: 'This link appears to be corrupted or incomplete. Ask your partner to share a new one.',
      },
    };

    const { icon, title, body } = messages[error];

    return (
      <Overlay onDismiss={onDismiss}>
        <span style={{ fontSize: 32 }}>{icon}</span>
        <h3 style={titleStyle}>{title}</h3>
        <p style={bodyStyle}>{body}</p>
        <button onClick={onDismiss} style={primaryBtn}>
          Got it
        </button>
      </Overlay>
    );
  }

  // ── Valid payload ───────────────────────────────────────────────────────────
  if (!payload) return null;

  const incomingCount = incoming.length;
  const localCount = localContractions.length;
  const mergedCount = mergeContractions(localContractions, incoming).length;
  const incomingFirst = incoming[0];
  const generatedAgo = Math.round((Date.now() - payload.generatedAt) / 60000);

  // Both partners have been tracking the same session independently → merge is the clear call
  if (hasBothTracking) {
    return (
      <Overlay onDismiss={onDismiss}>
        <span style={{ fontSize: 32 }}>🤝</span>
        <h3 style={titleStyle}>Both tracking the same session</h3>
        <p style={bodyStyle}>
          It looks like you and your partner have both been timing contractions. Combining will give
          you {mergedCount} total entries ({localCount} yours + {incomingCount} partner's, duplicates
          removed).
        </p>
        <button onClick={handleMerge} style={primaryBtn}>
          Combine both ({mergedCount} contractions)
        </button>
        <button onClick={() => onReplace(incoming)} style={secondaryBtn}>
          Use partner's data only ({incomingCount})
        </button>
        <button onClick={onDismiss} style={ghostBtn}>
          Keep mine ({localCount})
        </button>
      </Overlay>
    );
  }

  // Local data from a very different time window → mismatch warning
  if (hasMismatch) {
    return (
      <Overlay onDismiss={onDismiss}>
        <span style={{ fontSize: 32 }}>🕐</span>
        <h3 style={titleStyle}>Different time windows</h3>
        <p style={bodyStyle}>
          Your current data and your partner's data are from different time periods. Your partner's
          link was shared {generatedAgo}m ago and starts at{' '}
          {incomingFirst ? formatTime(incomingFirst.startTime) : '—'}.
        </p>
        <p style={{ ...bodyStyle, marginTop: 8 }}>
          You can still merge or replace — just double-check this is the right session.
        </p>
        <button onClick={handleMerge} style={primaryBtn}>
          Merge anyway ({mergedCount} total)
        </button>
        <button onClick={() => onReplace(incoming)} style={secondaryBtn}>
          Replace with partner's data ({incomingCount})
        </button>
        <button onClick={onDismiss} style={ghostBtn}>
          Keep mine
        </button>
      </Overlay>
    );
  }

  // User has no local data — simple import
  if (!hasLocal) {
    return (
      <Overlay onDismiss={onDismiss}>
        <span style={{ fontSize: 32 }}>📲</span>
        <h3 style={titleStyle}>Partner shared their data</h3>
        <p style={bodyStyle}>
          Import {incomingCount} contraction{incomingCount !== 1 ? 's' : ''} from your partner's
          session (shared {generatedAgo}m ago).
        </p>
        <button onClick={() => onReplace(incoming)} style={primaryBtn}>
          Import partner's data
        </button>
        <button onClick={onDismiss} style={ghostBtn}>
          Ignore
        </button>
      </Overlay>
    );
  }

  // User has local data but no overlap — partner's data is from a nearby but non-overlapping window
  return (
    <Overlay onDismiss={onDismiss}>
      <span style={{ fontSize: 32 }}>📲</span>
      <h3 style={titleStyle}>Partner shared their data</h3>
      <p style={bodyStyle}>
        Your partner shared {incomingCount} contraction{incomingCount !== 1 ? 's' : ''} (link from{' '}
        {generatedAgo}m ago). You currently have {localCount} recorded.
      </p>
      <button onClick={handleMerge} style={primaryBtn}>
        Merge ({mergedCount} total)
      </button>
      <button onClick={() => onReplace(incoming)} style={secondaryBtn}>
        Replace with partner's data
      </button>
      <button onClick={onDismiss} style={ghostBtn}>
        Keep mine
      </button>
    </Overlay>
  );
}

// ── Internal helpers ──────────────────────────────────────────────────────────

import { useState } from 'react';

function Overlay({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onDismiss()}>
      <div style={cardStyle}>{children}</div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(46, 59, 46, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  padding: 24,
  animation: 'fadeInOverlay 0.3s ease',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--cream)',
  borderRadius: 20,
  padding: '28px 24px',
  maxWidth: 340,
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  animation: 'fadeIn 0.3s ease',
};

const titleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: 'var(--text-primary)',
  margin: '8px 0 4px',
};

const bodyStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  marginBottom: 20,
};

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: 12,
  background: 'var(--terracotta)',
  color: 'white',
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 10,
  border: 'none',
  cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  background: 'var(--warm-beige)',
  color: 'var(--text-secondary)',
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 10,
  border: 'none',
  cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  background: 'transparent',
  color: 'var(--text-muted)',
  fontSize: 14,
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
};
