import { useState } from 'react';
import { OrderDetail } from './components/OrderDetail';
import { OrderList } from './components/OrderList';
import { ToastProvider } from './context/ToastProvider';
import { saveFilter, getSavedFilter } from './data/dataService';
import { useRoute } from './hooks/useRoute';
import type { OrderFilter } from './types';

export default function App() {
  const { orderId, openOrder, closeOrder } = useRoute();
  const [filter, setFilter] = useState<OrderFilter>(getSavedFilter);

  const handleFilterChange = (nextFilter: OrderFilter) => {
    setFilter(nextFilter);
    saveFilter(nextFilter);
  };

  return (
    <ToastProvider>
      {orderId ? (
        <OrderDetail key={orderId} orderId={orderId} onBack={closeOrder} />
      ) : (
        <OrderList
          filter={filter}
          onFilterChange={handleFilterChange}
          onSelectOrder={openOrder}
        />
      )}
    </ToastProvider>
  );
}
