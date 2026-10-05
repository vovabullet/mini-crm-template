export type OrderStatus = 'new' | 'in-progress' | 'completed';

export type OrderPriority = 'high' | 'medium' | 'low';

export type OrderType = 'confectionery' | 'auto' | 'plumbing' | (string & {});

export type OrderFilter = 'all' | OrderStatus;

export type ToastType = 'success' | 'error' | 'info';

export interface OrderPhoto {
  id: string;
  url: string;
  thumbnail: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  orderTypeLabel: string;
  status: OrderStatus;
  priority: OrderPriority;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  dueDate: string;
  description: string;
  specialInstructions?: string;
  photos: OrderPhoto[];
  address?: string;
}

export interface OrderFilters {
  status?: OrderFilter;
}
