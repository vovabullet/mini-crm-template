import { useCallback, useEffect, useState } from 'react';

function readOrderIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('order');
}

interface RouteState {
  orderId?: string;
  fromList?: boolean;
}

/**
 * Minimal History-API router: the selected order lives in the `?order=` query
 * parameter, so browser back/forward and deep links keep working.
 */
export function useRoute() {
  const [orderId, setOrderId] = useState<string | null>(readOrderIdFromUrl);

  useEffect(() => {
    const handlePopState = () => setOrderId(readOrderIdFromUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openOrder = useCallback((id: string) => {
    window.history.pushState({ orderId: id, fromList: true } satisfies RouteState, '', `?order=${id}`);
    setOrderId(id);
  }, []);

  const closeOrder = useCallback(() => {
    const state = window.history.state as RouteState | null;
    if (state?.fromList) {
      window.history.back();
      return;
    }
    window.history.replaceState({} satisfies RouteState, '', window.location.pathname);
    setOrderId(null);
  }, []);

  return { orderId, openOrder, closeOrder };
}
