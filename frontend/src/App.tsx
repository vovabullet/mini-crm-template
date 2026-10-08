import { OrderDetailScreen } from "@/components/orders/order-detail-screen"
import { OrdersScreen } from "@/components/orders/orders-screen"
import { Toaster } from "@/components/ui/sonner"
import { useOrderRoute } from "@/hooks/use-order-route"
import { useOrders } from "@/hooks/use-orders"

export default function App() {
  const { orderId, openOrder, closeOrder } = useOrderRoute()
  const { orders, error, refresh } = useOrders()

  return (
    <div className="bg-background mx-auto min-h-dvh max-w-md sm:border-x">
      <OrdersScreen orders={orders} error={error} onRetry={refresh} onSelect={openOrder} />
      <OrderDetailScreen orderId={orderId} onClose={closeOrder} onChanged={refresh} />
      <Toaster position="top-center" />
    </div>
  )
}
