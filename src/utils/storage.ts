import type { Contraction, Settings } from '../types.ts';

const CONTRACTIONS_KEY = 'theo_contractions';
const SETTINGS_KEY = 'theo_settings';
const ACTIVE_KEY = 'theo_active';

export function loadContractions(): Contraction[] {
  try {
    const raw = localStorage.getItem(CONTRACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveContractions(contractions: Contraction[]): void {
  localStorage.setItem(CONTRACTIONS_KEY, JSON.stringify(contractions));
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          preset: '5-1-1' as const,
          frequencyMinutes: 5,
          durationSeconds: 60,
          timeWindowMinutes: 60,
          notificationsEnabled: true,
          hapticEnabled: true,
        };
  } catch {
    return {
      frequencyMinutes: 5,
      durationSeconds: 60,
      timeWindowMinutes: 60,
      notificationsEnabled: true,
      hapticEnabled: true,
    };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadActiveState(): { isActive: boolean; activeStart: number | null } {
  try {
    const raw = localStorage.getItem(ACTIVE_KEY);
    return raw ? JSON.parse(raw) : { isActive: false, activeStart: null };
  } catch {
    return { isActive: false, activeStart: null };
  }
}

export function saveActiveState(isActive: boolean, activeStart: number | null): void {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify({ isActive, activeStart }));
}
