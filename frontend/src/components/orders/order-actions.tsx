import { CheckIcon, NavigationIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OrderDetail, OrderStatus } from "@/types/order"

const mapsUrl = (address: string) => `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`

/** Главные действия внизу экрана — зависят от статуса заказа. */
export function OrderActions({
  order,
  pending,
  onStatus,
}: {
  order: OrderDetail
  pending: boolean
  onStatus: (status: OrderStatus) => void
}) {
  const cls = "h-11 flex-1 text-[15px]"

  switch (order.status) {
    case "new":
      return (
        <>
          <Button variant="outline" className={cls} disabled={pending} onClick={() => onStatus("cancelled")}>
            Отказаться
          </Button>
          <Button className={cls} disabled={pending} onClick={() => onStatus("in_progress")}>
            <CheckIcon /> Принять
          </Button>
        </>
      )
    case "in_progress":
      return (
        <>
          <Button asChild variant="outline" className={cls}>
            <a href={mapsUrl(order.address)} target="_blank" rel="noreferrer">
              <NavigationIcon /> Маршрут
            </a>
          </Button>
          <Button className={cls} disabled={pending} onClick={() => onStatus("done")}>
            <CheckIcon /> Завершить
          </Button>
        </>
      )
    case "done":
      return (
        <Button variant="outline" className={cls} disabled={pending} onClick={() => onStatus("in_progress")}>
          <RotateCcwIcon /> Вернуть в работу
        </Button>
      )
    case "cancelled":
      return (
        <Button variant="outline" className={cls} disabled={pending} onClick={() => onStatus("new")}>
          <RotateCcwIcon /> Восстановить
        </Button>
      )
  }
}
