import { useEffect, useState } from "react"
import { ChevronLeftIcon, CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { OrderDetail } from "@/components/orders/order-detail"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrder } from "@/hooks/use-order"
import { useSwipeBack } from "@/hooks/use-swipe-back"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { OrderDetail as Order } from "@/types/order"

/** Экран деталей выезжает справа поверх списка (список сохраняет прокрутку). */
export function OrderDetailScreen({
  orderId,
  onClose,
  onChanged,
}: {
  orderId: number | null
  onClose: () => void
  onChanged: () => void
}) {
  // Держим последний id, чтобы контент не пропадал во время анимации закрытия.
  const [shownId, setShownId] = useState(orderId)
  useEffect(() => {
    if (orderId !== null) setShownId(orderId)
  }, [orderId])

  const open = orderId !== null
  const { order, setOrder, error } = useOrder(shownId)
  const swipe = useSwipeBack(onClose)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !document.querySelector("[role=dialog]") && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  const handleUpdate = (next: Order) => {
    setOrder(next)
    onChanged()
  }

  const copy = () => {
    if (!order) return
    const text = [`Заказ №${order.number}: ${order.title}`, `${order.client_name}, ${order.client_phone}`, order.address, formatPrice(order.price)]
      .filter(Boolean)
      .join("\n")
    navigator.clipboard?.writeText(text).then(
      () => toast("Детали заказа скопированы"),
      () => toast.error("Не удалось скопировать")
    )
  }

  return (
    <section
      aria-label="Детали заказа"
      aria-hidden={!open}
      inert={!open}
      {...swipe}
      className={cn(
        "bg-background fixed inset-y-0 left-1/2 z-40 flex w-full max-w-md -translate-x-1/2 flex-col transition-transform duration-300 ease-out motion-reduce:transition-none sm:border-x",
        !open && "translate-x-[100vw]"
      )}
    >
      <header className="flex items-center gap-2 border-b px-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
        <Button variant="ghost" size="icon" className="size-11" onClick={onClose} aria-label="Назад">
          <ChevronLeftIcon className="size-5" />
        </Button>
        <p className="flex-1 text-center font-semibold">{order ? `Заказ №${order.number}` : ""}</p>
        <Button variant="ghost" size="icon" className="size-11" onClick={copy} aria-label="Скопировать детали">
          <CopyIcon />
        </Button>
      </header>

      {error ? (
        <p className="text-destructive p-4 text-sm">Не удалось загрузить заказ: {error}</p>
      ) : order ? (
        <OrderDetail order={order} onUpdate={handleUpdate} />
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-32" />
        </div>
      )}
    </section>
  )
}
