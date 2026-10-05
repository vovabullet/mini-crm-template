import type { OrderFilter } from '../types';
import { useOrders } from '../hooks/useOrders';
import { EmptyStateIcon } from '../utils/icons';
import { FilterChips } from './FilterChips';
import { OrderCard } from './OrderCard';

interface OrderListProps {
  filter: OrderFilter;
  onFilterChange: (filter: OrderFilter) => void;
  onSelectOrder: (orderId: string) => void;
}

export function OrderList({ filter, onFilterChange, onSelectOrder }: OrderListProps) {
  const { orders, loading } = useOrders(filter);

  return (
    <div className="view">
      <header className="app-header">
        <h1>Мои заказы</h1>
        <FilterChips active={filter} onChange={onFilterChange} />
      </header>

      <main className="order-list-container">
        {!loading && orders.length === 0 ? (
          <div className="empty-state">
            <EmptyStateIcon />
            <h3>Заказов не найдено</h3>
            <p>Попробуйте изменить фильтр</p>
          </div>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onSelect={onSelectOrder} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
