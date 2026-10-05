import type { OrderStatus, OrderSummary } from "@/types/order"
import { dayDiff } from "@/lib/format"

export const ORDER_STATUS: Record<OrderStatus, { label: string; className: string; dot: string }> = {
  new: {
    label: "Новый",
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  in_progress: {
    label: "В работе",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  done: {
    label: "Готово",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Отменён",
    className: "border-transparent bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
}

export const ORDER_STATUS_ORDER: OrderStatus[] = ["new", "in_progress", "done", "cancelled"]

export const ORDER_FILTERS = [
  { value: "active", label: "Активные", statuses: ["new", "in_progress"] },
  { value: "new", label: "Новые", statuses: ["new"] },
  { value: "in_progress", label: "В работе", statuses: ["in_progress"] },
  { value: "archive", label: "Архив", statuses: ["done", "cancelled"] },
] as const satisfies ReadonlyArray<{ value: string; label: string; statuses: readonly OrderStatus[] }>

export type OrderFilter = (typeof ORDER_FILTERS)[number]["value"]

export const isOpen = (o: Pick<OrderSummary, "status">) => o.status === "new" || o.status === "in_progress"

/** Срок сегодня или уже прошёл, а заказ ещё не закрыт. */
export const isUrgent = (o: Pick<OrderSummary, "status" | "due_date">) =>
  isOpen(o) && o.due_date !== null && dayDiff(o.due_date) <= 0
