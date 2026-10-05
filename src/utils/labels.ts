import type { OrderPriority, OrderStatus } from '../types';

/**
 * CSS class for a status badge
 */
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    'new': 'status-new',
    'in-progress': 'status-in-progress',
    'completed': 'status-completed',
  };
  return colors[status] ?? 'status-new';
}

/**
 * Human readable status label
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    'new': 'Новый',
    'in-progress': 'В работе',
    'completed': 'Завершён',
  };
  return labels[status] ?? status;
}

/**
 * CSS class for a priority badge
 */
export function getPriorityColor(priority: OrderPriority): string {
  const colors: Record<OrderPriority, string> = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };
  return colors[priority] ?? 'priority-medium';
}

/**
 * Human readable priority label
 */
export function getPriorityLabel(priority: OrderPriority): string {
  const labels: Record<OrderPriority, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };
  return labels[priority] ?? priority;
}

/**
 * Filter chip labels
 */
export const FILTER_LABELS: Record<string, string> = {
  all: 'Все',
  'new': 'Новые',
  'in-progress': 'В работе',
  completed: 'Завершённые',
};
