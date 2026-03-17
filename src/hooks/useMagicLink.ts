import { useState, useEffect } from 'react';
import {
  parsePartnerLink,
  getOrCreateDeviceId,
  type PartnerPayload,
  type ParseError,
} from '../utils/shareLink.ts';

export type MagicLinkState =
  | { status: 'none' }
  | { status: 'error'; error: ParseError }
  | { status: 'ready'; payload: PartnerPayload };

/**
 * On mount, checks window.location.search for a ?join= partner link.
 * Parses and validates it, then strips it from the URL.
 */
export function useMagicLink(): MagicLinkState {
  const [state, setState] = useState<MagicLinkState>({ status: 'none' });

  useEffect(() => {
    const search = window.location.search;
    if (!search.includes('join=')) return;

    const deviceId = getOrCreateDeviceId();
    const result = parsePartnerLink(search, deviceId);

    // Strip the ?join= param from the URL without triggering a page reload
    const url = new URL(window.location.href);
    url.searchParams.delete('join');
    window.history.replaceState(null, '', url.toString());

    if (result.ok) {
      setState({ status: 'ready', payload: result.payload });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, []);

  return state;
}
