import type { Contraction, Settings, Session } from '../types.ts';

const CONTRACTIONS_KEY = 'theo_contractions';
const SETTINGS_KEY = 'theo_settings';
const ACTIVE_KEY = 'theo_active';
const SESSIONS_KEY = 'theo_sessions';
const ONBOARDING_KEY = 'theo_onboarding_complete';

const DEFAULT_SETTINGS: Settings = {
  preset: '5-1-1' as const,
  frequencyMinutes: 5,
  durationSeconds: 60,
  timeWindowMinutes: 60,
  notificationsEnabled: true,
  hapticEnabled: true,
  intensityEnabled: true,
};

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
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle newly added fields (e.g. intensityEnabled)
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
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

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadOnboardingComplete(): boolean {
  try {
    // Existing users (who already have settings saved) skip onboarding
    if (localStorage.getItem(SETTINGS_KEY)) return true;
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function hasExistingData(): boolean {
  return localStorage.getItem(SETTINGS_KEY) !== null;
}
