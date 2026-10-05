import type { Order } from '../types';
import { formatRelativeTime, isOverdue } from '../utils/format';
import { getPriorityColor, getStatusColor, getStatusLabel } from '../utils/labels';
import { ClockIcon, OrderTypeIcon } from '../utils/icons';
import { LazyImage } from './LazyImage';

interface OrderCardProps {
  order: Order;
  onSelect: (orderId: string) => void;
}

export function OrderCard({ order, onSelect }: OrderCardProps) {
  const isLate = order.status !== 'completed' && isOverdue(order.dueDate);
  const thumbnail = order.photos[0]?.thumbnail;

  return (
    <article
      className="order-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(order.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(order.id);
        }
      }}
    >
      <div className="order-card-header">
        <div className="order-type-badge">
          <OrderTypeIcon orderType={order.orderType} />
          <span>{order.orderTypeLabel}</span>
        </div>
        <span className={`status-badge ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      <div className="order-card-body">
        <h3 className="order-number">{order.orderNumber}</h3>
        <p className="customer-name">{order.customerName}</p>
        <p className="order-preview">{order.description}</p>
      </div>

      <div className="order-card-footer">
        <div className={`due-date${isLate ? ' overdue' : ''}`}>
          <ClockIcon />
          <span>{formatRelativeTime(order.dueDate)}</span>
        </div>
        {order.priority === 'high' && (
          <span className={`priority-badge ${getPriorityColor(order.priority)}`}>
            Срочно
          </span>
        )}
        {thumbnail && (
          <div className="order-thumbnail">
            <LazyImage src={thumbnail} alt="Order preview" />
          </div>
        )}
      </div>
    </article>
  );
}
