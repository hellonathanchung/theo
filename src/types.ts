export interface Contraction {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number | null;
}

export type Preset = '5-1-1' | '4-1-1' | 'custom';

export interface Settings {
  preset: Preset;
  frequencyMinutes: number;
  durationSeconds: number;
  timeWindowMinutes: number;
  notificationsEnabled: boolean;
  hapticEnabled: boolean;
}

export interface AppState {
  contractions: Contraction[];
  settings: Settings;
  isActive: boolean;
  activeStart: number | null;
}
