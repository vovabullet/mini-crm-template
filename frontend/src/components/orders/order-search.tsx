import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

export function OrderSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        aria-label="Поиск заказов"
        placeholder="Поиск: клиент, услуга, адрес"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-9 text-base"
      />
    </div>
  )
}
