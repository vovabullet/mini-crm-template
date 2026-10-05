import { CategoryIcon } from "@/components/orders/category-icon"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { formatDue, formatPrice } from "@/lib/format"
import { isUrgent } from "@/lib/order-status"
import { cn } from "@/lib/utils"
import type { OrderSummary } from "@/types/order"

export function OrderCard({ order, onSelect }: { order: OrderSummary; onSelect: (id: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(order.id)}
      className="bg-card text-card-foreground hover:bg-accent/50 active:bg-accent focus-visible:ring-ring/50 flex w-full gap-3 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-[3px]"
    >
      {order.thumbnail ? (
        <img src={order.thumbnail} alt="" loading="lazy" className="bg-muted size-16 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="bg-muted text-muted-foreground grid size-16 shrink-0 place-items-center rounded-lg">
          <CategoryIcon category={order.category} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate leading-snug font-semibold">{order.title}</p>
        <p className="text-muted-foreground truncate text-sm">
          {order.client_name}
          {order.category && ` · ${order.category}`}
        </p>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <span className={cn("truncate text-sm", isUrgent(order) ? "text-destructive" : "text-muted-foreground")}>
              {formatDue(order.due_date, order.due_time)}
            </span>
          </div>
          <span className="shrink-0 font-semibold tabular-nums">{formatPrice(order.price)}</span>
        </div>
      </div>
    </button>
  )
}
