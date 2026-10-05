import { MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { initials, phoneHref } from "@/lib/format"
import type { OrderDetail } from "@/types/order"

export function OrderClient({ order }: { order: OrderDetail }) {
  const tel = phoneHref(order.client_phone)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-10 border">
          <AvatarFallback className="text-sm font-medium">{initials(order.client_name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{order.client_name}</p>
          {order.client_phone && <p className="text-muted-foreground text-sm">{order.client_phone}</p>}
        </div>
        {tel && (
          <>
            <Button asChild variant="outline" size="icon" className="size-11">
              <a href={`sms:${tel}`} aria-label="Написать клиенту">
                <MessageCircleIcon />
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="size-11">
              <a href={`tel:${tel}`} aria-label="Позвонить клиенту">
                <PhoneIcon />
              </a>
            </Button>
          </>
        )}
      </div>
      {order.address && (
        <p className="text-muted-foreground flex items-start gap-2 text-sm">
          <MapPinIcon className="mt-0.5 size-4 shrink-0" />
          {order.address}
        </p>
      )}
    </div>
  )
}
