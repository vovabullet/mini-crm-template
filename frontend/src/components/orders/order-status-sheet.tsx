import { useState } from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ORDER_STATUS_ORDER } from "@/lib/order-status"
import type { OrderStatus } from "@/types/order"

export function OrderStatusSheet({
  status,
  onChange,
}: {
  status: OrderStatus
  onChange: (status: OrderStatus) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" aria-label="Изменить статус" className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <OrderStatusBadge status={status} className="h-7 px-2.5 text-[13px]">
            <ChevronDownIcon />
          </OrderStatusBadge>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="mx-auto max-w-md gap-0 rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SheetHeader>
          <SheetTitle>Статус заказа</SheetTitle>
        </SheetHeader>
        <div role="radiogroup" className="flex flex-col px-2">
          {ORDER_STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={s === status}
              onClick={() => {
                setOpen(false)
                onChange(s)
              }}
              className="hover:bg-accent focus-visible:bg-accent flex min-h-12 items-center justify-between rounded-md px-2 outline-none"
            >
              <OrderStatusBadge status={s} className="text-sm" />
              {s === status && <CheckIcon className="size-4" />}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
