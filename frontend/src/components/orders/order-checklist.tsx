import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { ChecklistItem } from "@/types/order"

export function OrderChecklist({
  items,
  onToggle,
}: {
  items: ChecklistItem[]
  onToggle: (id: number, done: boolean) => void
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <Checkbox
              checked={item.done}
              onCheckedChange={(v) => onToggle(item.id, v === true)}
              className="size-5"
            />
            <span className={cn(item.done && "text-muted-foreground line-through")}>{item.text}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
