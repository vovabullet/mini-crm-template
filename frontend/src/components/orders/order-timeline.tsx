import { formatEventDate } from "@/lib/format"
import type { OrderEvent } from "@/types/order"

export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  const items = [...events].reverse()
  return (
    <ol className="flex flex-col">
      {items.map((e, i) => (
        <li key={e.id} className="relative pb-3 pl-5 text-sm last:pb-0">
          <span className="bg-muted-foreground absolute top-2 left-0.5 size-2 rounded-full" aria-hidden />
          {i < items.length - 1 && <span className="bg-border absolute top-5 bottom-0 left-[5.5px] w-px" aria-hidden />}
          <p>{e.text}</p>
          <time className="text-muted-foreground text-xs" dateTime={e.created_at}>
            {formatEventDate(e.created_at)}
          </time>
        </li>
      ))}
    </ol>
  )
}
