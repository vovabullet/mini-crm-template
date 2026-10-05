import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS } from "@/lib/order-status"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types/order"

export function OrderStatusBadge({
  status,
  className,
  children,
}: {
  status: OrderStatus
  className?: string
  children?: React.ReactNode
}) {
  const s = ORDER_STATUS[status]
  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full", s.className, className)}>
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      {s.label}
      {children}
    </Badge>
  )
}
