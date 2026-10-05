import { useState } from "react"
import { toast } from "sonner"

import { DetailSection } from "@/components/orders/detail-section"
import { OrderActions } from "@/components/orders/order-actions"
import { OrderChecklist } from "@/components/orders/order-checklist"
import { OrderClient } from "@/components/orders/order-client"
import { OrderFacts } from "@/components/orders/order-facts"
import { OrderNote } from "@/components/orders/order-note"
import { OrderStatusSheet } from "@/components/orders/order-status-sheet"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { PhotoGallery } from "@/components/orders/photo-gallery"
import { api } from "@/lib/api"
import { ORDER_STATUS } from "@/lib/order-status"
import type { OrderDetail as Order, OrderStatus } from "@/types/order"

export function OrderDetail({
  order,
  onUpdate,
}: {
  order: Order
  onUpdate: (order: Order) => void
}) {
  const [pending, setPending] = useState(false)

  const run = async (action: () => Promise<Order>, success?: string) => {
    setPending(true)
    try {
      onUpdate(await action())
      if (success) toast.success(success)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось сохранить")
    } finally {
      setPending(false)
    }
  }

  const setStatus = (status: OrderStatus) => {
    if (status === order.status) return
    run(() => api.updateOrder(order.id, { status }), `Статус: ${ORDER_STATUS[status].label}`)
  }

  const toggleItem = async (id: number, done: boolean) => {
    // Оптимистичное обновление: галочка ставится сразу.
    const checklist = order.checklist.map((i) => (i.id === id ? { ...i, done } : i))
    onUpdate({ ...order, checklist, checklist_done: checklist.filter((i) => i.done).length })
    try {
      await api.updateChecklistItem(id, done)
    } catch {
      toast.error("Не удалось сохранить чек-лист")
      onUpdate(order)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <PhotoGallery photos={order.photos} onUpload={(files) => run(() => api.uploadPhotos(order.id, files), "Фото добавлено")} />

        <DetailSection className="border-t-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-sm">{order.category}</span>
            <OrderStatusSheet status={order.status} onChange={setStatus} />
          </div>
          <h2 className="text-xl leading-tight font-semibold tracking-tight">{order.title}</h2>
          <div className="mt-4">
            <OrderFacts order={order} />
          </div>
        </DetailSection>

        {order.description && (
          <DetailSection title="Описание">
            <p className="leading-relaxed whitespace-pre-line">{order.description}</p>
          </DetailSection>
        )}

        <DetailSection title="Клиент">
          <OrderClient order={order} />
        </DetailSection>

        {order.checklist.length > 0 && (
          <DetailSection title={`Чек-лист · ${order.checklist_done}/${order.checklist_total}`}>
            <OrderChecklist items={order.checklist} onToggle={toggleItem} />
          </DetailSection>
        )}

        <DetailSection title={<label htmlFor="order-note">Заметка для себя</label>}>
          <OrderNote
            value={order.note}
            onSave={async (note) => {
              await run(() => api.updateOrder(order.id, { note }))
            }}
          />
        </DetailSection>

        <DetailSection title="История">
          <OrderTimeline events={order.events} />
        </DetailSection>
      </div>

      <footer className="bg-background flex gap-2 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <OrderActions order={order} pending={pending} onStatus={setStatus} />
      </footer>
    </>
  )
}
