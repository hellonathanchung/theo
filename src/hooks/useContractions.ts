import { useState, useCallback, useEffect } from 'react';
import type { Contraction, Settings } from '../types.ts';
import { loadContractions, saveContractions, loadSettings, saveSettings, loadActiveState, saveActiveState } from '../utils/storage.ts';
import { evaluateContractions, getAlertMessage } from '../utils/alerts.ts';

export function useContractions() {
  const [contractions, setContractions] = useState<Contraction[]>(loadContractions);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [isActive, setIsActive] = useState(false);
  const [activeStart, setActiveStart] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState(0);

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

  const startContraction = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setActiveStart(now);
    saveActiveState(true, now);

    if (navigator.vibrate) navigator.vibrate(50);
  }, []);

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

    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  }, [activeStart, settings, lastAlertTime]);

  const clearAll = useCallback(() => {
    setContractions([]);
    setAlertMessage(null);
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
    isActive,
    activeStart,
    alertMessage,
    settings,
    startContraction,
    stopContraction,
    clearAll,
    dismissAlert,
    updateSettings,
    getUrgencyState,
  };
}
