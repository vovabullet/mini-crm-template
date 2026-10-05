import { useMemo, useState } from "react"
import { RefreshCwIcon } from "lucide-react"

import { OrderFilters } from "@/components/orders/order-filters"
import { OrderList } from "@/components/orders/order-list"
import { OrderSearch } from "@/components/orders/order-search"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatToday } from "@/lib/format"
import { ORDER_FILTERS, type OrderFilter } from "@/lib/order-status"
import type { OrderSummary } from "@/types/order"

const byDue = (a: OrderSummary, b: OrderSummary) =>
  `${a.due_date ?? "9999"}${a.due_time ?? ""}`.localeCompare(`${b.due_date ?? "9999"}${b.due_time ?? ""}`)

export function OrdersScreen({
  orders,
  error,
  onRetry,
  onSelect,
}: {
  orders: OrderSummary[] | null
  error: string | null
  onRetry: () => void
  onSelect: (id: number) => void
}) {
  const [filter, setFilter] = useState<OrderFilter>("active")
  const [query, setQuery] = useState("")

  const visible = useMemo(() => {
    if (!orders) return null
    const statuses: readonly string[] = ORDER_FILTERS.find((f) => f.value === filter)!.statuses
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => statuses.includes(o.status))
      .filter((o) => !q || [o.title, o.client_name, o.category, o.address, o.number].join(" ").toLowerCase().includes(q))
      .sort(byDue)
  }, [orders, filter, query])

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-background/90 sticky top-0 z-10 flex flex-col gap-3 border-b px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-sm first-letter:uppercase">{formatToday()}</p>
            <h1 className="text-2xl font-semibold tracking-tight">Заказы</h1>
          </div>
          <Avatar className="size-10 border">
            <AvatarFallback className="text-sm font-medium">АУ</AvatarFallback>
          </Avatar>
        </div>
        <OrderSearch value={query} onChange={setQuery} />
        <OrderFilters value={filter} onChange={setFilter} orders={orders ?? []} />
      </header>

      <main className="flex-1 px-4 pt-3 pb-8">
        {error && (
          <div className="border-destructive/30 bg-destructive/5 text-destructive mb-3 flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
            <span>Не удалось загрузить заказы: {error}</span>
            <Button size="sm" variant="outline" onClick={onRetry}>
              <RefreshCwIcon /> Повторить
            </Button>
          </div>
        )}
        <OrderList orders={visible} onSelect={onSelect} />
      </main>
    </div>
  )
}
