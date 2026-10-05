import { formatDue, formatPrice } from "@/lib/format"
import { isUrgent } from "@/lib/order-status"
import { cn } from "@/lib/utils"
import type { OrderDetail } from "@/types/order"

export function OrderFacts({ order }: { order: OrderDetail }) {
  const facts = [
    { label: "Срок", value: formatDue(order.due_date, order.due_time), urgent: isUrgent(order) },
    { label: "Стоимость", value: formatPrice(order.price) },
    { label: "Предоплата", value: order.prepayment ? formatPrice(order.prepayment) : "—" },
    { label: "К оплате", value: formatPrice(Math.max(order.price - order.prepayment, 0)) },
  ]
  return (
    <dl className="grid grid-cols-2 gap-2">
      {facts.map((f) => (
        <div key={f.label} className="bg-muted/60 rounded-lg p-3">
          <dt className="text-muted-foreground text-xs">{f.label}</dt>
          <dd className={cn("font-semibold tabular-nums", f.urgent && "text-destructive")}>{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
