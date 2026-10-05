import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ORDER_FILTERS, type OrderFilter } from "@/lib/order-status"
import type { OrderSummary } from "@/types/order"

export function OrderFilters({
  value,
  onChange,
  orders,
}: {
  value: OrderFilter
  onChange: (v: OrderFilter) => void
  orders: OrderSummary[]
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as OrderFilter)}>
      <TabsList className="no-scrollbar h-10 w-full justify-start overflow-x-auto">
        {ORDER_FILTERS.map((f) => {
          const count = orders.filter((o) => (f.statuses as readonly string[]).includes(o.status)).length
          return (
            <TabsTrigger key={f.value} value={f.value} className="px-1.5">
              {f.label}
              <span className="text-muted-foreground text-xs tabular-nums">{count}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
