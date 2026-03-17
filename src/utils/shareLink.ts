import type { Contraction } from '../types.ts';

const DEVICE_ID_KEY = 'theo_device_id';
const LINK_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export interface PartnerPayload {
  version: 1;
  deviceId: string;
  generatedAt: number;
  contractions: Contraction[];
}

export function encodePartnerLink(contractions: Contraction[]): string {
  const deviceId = getOrCreateDeviceId();
  const payload: PartnerPayload = {
    version: 1,
    deviceId,
    generatedAt: Date.now(),
    contractions,
  };
  const json = JSON.stringify(payload);
  const encoded = btoa(encodeURIComponent(json));
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?join=${encoded}`;
}

export type ParseError = 'invalid' | 'expired' | 'self' | 'empty';

export type ParseResult =
  | { ok: true; payload: PartnerPayload }
  | { ok: false; error: ParseError };

export function parsePartnerLink(search: string, localDeviceId: string): ParseResult {
  const params = new URLSearchParams(search);
  const encoded = params.get('join');
  if (!encoded) return { ok: false, error: 'invalid' };

  try {
    const json = decodeURIComponent(atob(encoded));
    const payload = JSON.parse(json) as PartnerPayload;

    if (
      payload.version !== 1 ||
      typeof payload.deviceId !== 'string' ||
      typeof payload.generatedAt !== 'number' ||
      !Array.isArray(payload.contractions)
    ) {
      return { ok: false, error: 'invalid' };
    }

    if (payload.deviceId === localDeviceId) {
      return { ok: false, error: 'self' };
    }

    if (Date.now() - payload.generatedAt > LINK_EXPIRY_MS) {
      return { ok: false, error: 'expired' };
    }

    if (payload.contractions.length === 0) {
      return { ok: false, error: 'empty' };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, error: 'invalid' };
  }
}

/**
 * Merge two contraction arrays, deduplicating by id and sorting by start time.
 */
export function mergeContractions(local: Contraction[], incoming: Contraction[]): Contraction[] {
  const map = new Map<string, Contraction>();
  for (const c of [...local, ...incoming]) {
    map.set(c.id, c);
  }
  return Array.from(map.values()).sort((a, b) => a.startTime - b.startTime);
}

/**
 * Check if two contraction arrays overlap in time — i.e., both parties
 * have been tracking the same labor event independently.
 */
export function detectTemporalOverlap(local: Contraction[], incoming: Contraction[]): boolean {
  if (local.length === 0 || incoming.length === 0) return false;

  const localStart = Math.min(...local.map((c) => c.startTime));
  const localEnd = Math.max(...local.map((c) => c.endTime ?? c.startTime));
  const incomingStart = Math.min(...incoming.map((c) => c.startTime));
  const incomingEnd = Math.max(...incoming.map((c) => c.endTime ?? c.startTime));

  // Overlap if ranges intersect
  return localStart <= incomingEnd && incomingStart <= localEnd;
}

/**
 * Check if the incoming contractions are from a significantly different
 * time period than the current session (potential mismatch).
 */
export function detectTimeMismatch(local: Contraction[], incoming: Contraction[]): boolean {
  if (local.length === 0 || incoming.length === 0) return false;

  const THREE_HOURS = 3 * 60 * 60 * 1000;
  const localLatest = Math.max(...local.map((c) => c.endTime ?? c.startTime));
  const incomingLatest = Math.max(...incoming.map((c) => c.endTime ?? c.startTime));

  return Math.abs(localLatest - incomingLatest) > THREE_HOURS;
}
