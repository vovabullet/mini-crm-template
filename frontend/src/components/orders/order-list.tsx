import { InboxIcon } from "lucide-react"

import { OrderCard } from "@/components/orders/order-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { OrderSummary } from "@/types/order"

export function OrderList({
  orders,
  onSelect,
}: {
  orders: OrderSummary[] | null
  onSelect: (id: number) => void
}) {
  if (orders === null) {
    return (
      <div className="flex flex-col gap-2" aria-busy>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[90px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 px-6 py-16 text-center text-sm">
        <InboxIcon className="size-8" />
        <p>
          Здесь пока пусто.
          <br />
          Новые заказы появятся автоматически.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} onSelect={onSelect} />
      ))}
    </div>
  )
}
