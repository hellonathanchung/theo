import { useState } from 'react';
import type { Contraction, Intensity } from '../types.ts';
import { formatDuration, formatTime } from '../utils/format.ts';

interface Props {
  contraction: Contraction;
  interval: number | null;
  onUpdate: (id: string, updates: Partial<Contraction>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  readOnly?: boolean;
}

const INTENSITIES: { id: Intensity; label: string; dots: number; color: string }[] = [
  { id: 'mild', label: 'Mild', dots: 1, color: 'var(--warm-amber)' },
  { id: 'moderate', label: 'Moderate', dots: 2, color: 'var(--soft-coral)' },
  { id: 'strong', label: 'Strong', dots: 3, color: 'var(--terracotta)' },
];

export function ContractionDetailModal({ contraction: c, interval, onUpdate, onDelete, onClose, readOnly }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const adjustTime = (field: 'startTime' | 'endTime', deltaMs: number) => {
    if (readOnly) return;
    const newTime = (c[field] ?? 0) + deltaMs;
    onUpdate(c.id, { [field]: newTime });
  };

  const formatTimeOfDay = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <span style={headerTitle}>Contraction Details</span>
          <button onClick={onClose} style={closeBtn}>Done</button>
        </div>

        {/* Times */}
        <div style={section}>
          <div style={fieldRow}>
            <span style={fieldLabel}>Started</span>
            <div style={timeControls}>
              {!readOnly && <button onClick={() => adjustTime('startTime', -60000)} style={adjBtn}>-1m</button>}
              <span style={fieldValue}>{formatTimeOfDay(c.startTime)}</span>
              {!readOnly && <button onClick={() => adjustTime('startTime', 60000)} style={adjBtn}>+1m</button>}
            </div>
          </div>

          {c.endTime && (
            <div style={fieldRow}>
              <span style={fieldLabel}>Ended</span>
              <div style={timeControls}>
                {!readOnly && <button onClick={() => adjustTime('endTime', -60000)} style={adjBtn}>-1m</button>}
                <span style={fieldValue}>{formatTimeOfDay(c.endTime)}</span>
                {!readOnly && <button onClick={() => adjustTime('endTime', 60000)} style={adjBtn}>+1m</button>}
              </div>
            </div>
          )}

          <div style={fieldRow}>
            <span style={fieldLabel}>Duration</span>
            <span style={fieldValue}>{c.duration ? formatDuration(c.duration) : '--'}</span>
          </div>

          {interval !== null && (
            <div style={fieldRow}>
              <span style={fieldLabel}>Apart</span>
              <span style={{ ...fieldValue, color: 'var(--terracotta)' }}>{formatDuration(interval)}</span>
            </div>
          )}
        </div>

        {/* Intensity */}
        <div style={section}>
          <div style={sectionLabel}>INTENSITY</div>
          <div style={intensityRow}>
            {INTENSITIES.map((item) => (
              <button
                key={item.id}
                onClick={() => !readOnly && onUpdate(c.id, { intensity: item.id })}
                style={{
                  ...intensityBtn,
                  background: c.intensity === item.id ? item.color : 'var(--warm-beige)',
                  color: c.intensity === item.id ? 'var(--cream)' : 'var(--text-secondary)',
                  opacity: readOnly && c.intensity !== item.id ? 0.4 : 1,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Delete */}
        {!readOnly && (
          <div style={{ padding: '8px 0' }}>
            {confirmDelete ? (
              <div style={confirmRow}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Delete this contraction?</span>
                <button
                  onClick={() => { onDelete(c.id); onClose(); }}
                  style={{ ...deleteBtn, background: '#e57373', color: '#fff' }}
                >
                  Yes, Delete
                </button>
                <button onClick={() => setConfirmDelete(false)} style={cancelBtn}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} style={deleteBtn}>
                Delete Contraction
              </button>
            )}
          </div>
        )}
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
  zIndex: 100,
  animation: 'fadeInOverlay 0.2s ease',
  padding: 20,
};

const modal: React.CSSProperties = {
  width: '100%',
  maxWidth: 380,
  background: 'var(--cream)',
  borderRadius: 20,
  padding: '0 20px 20px',
  animation: 'fadeIn 0.3s ease',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 0 16px',
  borderBottom: '1px solid var(--warm-beige)',
};

const headerTitle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: 'var(--text-primary)',
};

const closeBtn: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: 'var(--terracotta)',
  padding: '4px 8px',
};

const section: React.CSSProperties = {
  padding: '16px 0',
  borderBottom: '1px solid var(--warm-beige)',
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: 1.5,
  marginBottom: 10,
};

const fieldRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
};

const fieldLabel: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
};

const fieldValue: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  color: 'var(--text-primary)',
  fontVariantNumeric: 'tabular-nums',
};

const timeControls: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const adjBtn: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--terracotta)',
  padding: '4px 8px',
  borderRadius: 8,
  background: 'var(--warm-beige)',
};

const intensityRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
};

const intensityBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 8px',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
  textAlign: 'center',
  transition: 'all 0.2s',
};

const deleteBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 500,
  color: '#e57373',
  background: 'transparent',
  border: '1px solid #e57373',
};

const confirmRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'center',
};

const cancelBtn: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-muted)',
  padding: '8px 16px',
};
