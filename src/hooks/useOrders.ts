import { useEffect, useState } from 'react';
import { getOrderById, getOrders } from '../data/dataService';
import type { Order, OrderFilter } from '../types';

/**
 * Load the order list for the given filter
 */
export function useOrders(filter: OrderFilter) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getOrders({ status: filter }).then((result) => {
      if (cancelled) return;
      setOrders(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [filter]);

  return { orders, loading };
}

/**
 * Load a single order by id
 */
export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getOrderById(orderId).then((result) => {
      if (cancelled) return;
      setOrder(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return { order, setOrder, loading };
}
