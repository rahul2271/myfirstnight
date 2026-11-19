'use client';

import { useEffect } from 'react';
import { track, TrackItem } from '../lib/analytics';

export function TrackView({ item, currency }: { item: TrackItem; currency?: string }) {
  useEffect(() => {
    // consent may be granted a moment after load, so retry once
    track('view_item', { items: [item], currency });
    const retry = () => track('view_item', { items: [item], currency });
    window.addEventListener('mfn-consent', retry, { once: true });
    return () => window.removeEventListener('mfn-consent', retry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);
  return null;
}
