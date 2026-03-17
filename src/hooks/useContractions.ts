import { useState, useCallback, useEffect } from 'react';
import type { Contraction, Settings, Session, Intensity } from '../types.ts';
import {
  loadContractions, saveContractions,
  loadSettings, saveSettings,
  loadActiveState, saveActiveState,
  loadSessions, saveSessions,
} from '../utils/storage.ts';
import { evaluateContractions, getAlertMessage } from '../utils/alerts.ts';

export function useContractions() {
  const [contractions, setContractions] = useState<Contraction[]>(loadContractions);
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [isActive, setIsActive] = useState(false);
  const [activeStart, setActiveStart] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [pendingIntensityId, setPendingIntensityId] = useState<string | null>(null);

  // Restore active state on mount (e.g. app was backgrounded during a contraction)
  useEffect(() => {
    const saved = loadActiveState();
    if (saved.isActive && saved.activeStart) {
      setIsActive(true);
      setActiveStart(saved.activeStart);
    }
  }, []);

  // Persist contractions
  useEffect(() => {
    saveContractions(contractions);
  }, [contractions]);

  // Persist settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist sessions
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const startContraction = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setActiveStart(now);
    saveActiveState(true, now);

    if (settings.hapticEnabled && navigator.vibrate) navigator.vibrate(50);
  }, [settings.hapticEnabled]);

  const stopContraction = useCallback(() => {
    if (!activeStart) return;

    const now = Date.now();
    const duration = (now - activeStart) / 1000;
    const newContraction: Contraction = {
      id: crypto.randomUUID(),
      startTime: activeStart,
      endTime: now,
      duration,
    };

    setContractions((prev) => {
      const updated = [...prev, newContraction];

      // Check alert after adding
      const completed = updated.filter((c) => c.endTime !== null);
      const result = evaluateContractions(completed, settings);

      if (result.triggered && now - lastAlertTime > 15 * 60 * 1000) {
        const msg = getAlertMessage();
        setAlertMessage(msg);
        setLastAlertTime(now);

        // Send notification if enabled
        if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Theo', { body: msg, icon: '/icon-192.png' });
        }
      }

      return updated;
    });

    setIsActive(false);
    setActiveStart(null);
    saveActiveState(false, null);

    // Show intensity picker if enabled
    if (settings.intensityEnabled) {
      setPendingIntensityId(newContraction.id);
    }

    if (settings.hapticEnabled && navigator.vibrate) navigator.vibrate([50, 50, 50]);
  }, [activeStart, settings, lastAlertTime]);

  // Session management
  const newSession = useCallback(() => {
    if (contractions.length > 0) {
      const session: Session = {
        id: crypto.randomUUID(),
        startedAt: contractions[0].startTime,
        endedAt: contractions[contractions.length - 1].endTime ?? Date.now(),
        contractions: [...contractions],
      };
      setSessions((prev) => [session, ...prev]);
    }
    setContractions([]);
    setAlertMessage(null);
    setPendingIntensityId(null);
  }, [contractions]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Intensity
  const setIntensity = useCallback((id: string, intensity: Intensity) => {
    setContractions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, intensity } : c))
    );
    setPendingIntensityId(null);
  }, []);

  const dismissIntensityPrompt = useCallback(() => {
    setPendingIntensityId(null);
  }, []);

  // Edit/delete individual contractions
  const updateContraction = useCallback((id: string, updates: Partial<Contraction>) => {
    setContractions((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };
        // Recalculate duration if start/end times changed
        if (updated.startTime && updated.endTime) {
          updated.duration = (updated.endTime - updated.startTime) / 1000;
        }
        return updated;
      })
    );
  }, []);

  const deleteContraction = useCallback((id: string) => {
    setContractions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const replaceContractions = useCallback((next: Contraction[]) => {
    setContractions(next);
    setAlertMessage(null);
    setPendingIntensityId(null);
  }, []);

  const dismissAlert = useCallback(() => {
    setAlertMessage(null);
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const completed = contractions.filter((c) => c.endTime !== null);

  // Determine urgency state for color transitions
  const getUrgencyState = useCallback((): 'resting' | 'active' | 'approaching' => {
    if (isActive) return 'active';
    if (completed.length < 3) return 'resting';
    const result = evaluateContractions(completed, settings);
    if (result.triggered || result.approaching) return 'approaching';
    return 'resting';
  }, [isActive, completed, settings]);

  return {
    contractions: completed,
    sessions,
    isActive,
    activeStart,
    alertMessage,
    settings,
    pendingIntensityId,
    startContraction,
    stopContraction,
    newSession,
    deleteSession,
    setIntensity,
    dismissIntensityPrompt,
    updateContraction,
    deleteContraction,
    replaceContractions,
    dismissAlert,
    updateSettings,
    getUrgencyState,
  };
}
