import type { Order, OrderFilter, OrderFilters, OrderStatus } from '../types';
import { MOCK_ORDERS } from './mockOrders';

const STORAGE_KEY = 'minicrm_orders';
const FILTER_KEY = 'minicrm_filter';

/**
 * Initialize with mock data if storage is empty
 */
export function initializeMockData(): void {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ORDERS));
  }
}

function readOrders(): Order[] {
  initializeMockData();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Order[];
  } catch {
    return [];
  }
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

/**
 * Get all orders with optional status filtering
 */
export async function getOrders(filters: OrderFilters = {}): Promise<Order[]> {
  const orders = readOrders();

  let filtered = orders;
  if (filters.status && filters.status !== 'all') {
    filtered = orders.filter((order) => order.status === filters.status);
  }

  return [...filtered].sort((a, b) => {
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

/**
 * Get a single order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const orders = readOrders();
  return orders.find((order) => order.id === id) ?? null;
}

/**
 * Update order status and stamp the matching timestamp
 */
export async function updateOrderStatus(
  id: string,
  newStatus: OrderStatus,
): Promise<Order | null> {
  const orders = readOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) return null;

  const order = orders[index];
  order.status = newStatus;

  const now = new Date().toISOString();
  if (newStatus === 'in-progress' && !order.startedAt) {
    order.startedAt = now;
  } else if (newStatus === 'completed') {
    order.completedAt = now;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  return order;
}

/**
 * Save filter preference
 */
export function saveFilter(filter: OrderFilter): void {
  localStorage.setItem(FILTER_KEY, filter);
}

/**
 * Get saved filter preference
 */
export function getSavedFilter(): OrderFilter {
  return (localStorage.getItem(FILTER_KEY) as OrderFilter) ?? 'all';
}
