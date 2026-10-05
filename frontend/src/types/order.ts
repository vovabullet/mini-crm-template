export type OrderStatus = "new" | "in_progress" | "done" | "cancelled"

export interface OrderSummary {
  id: number
  number: number
  status: OrderStatus
  source: string
  category: string
  title: string
  client_name: string
  address: string
  due_date: string | null // YYYY-MM-DD
  due_time: string | null // HH:mm
  price: number
  prepayment: number
  thumbnail: string | null
  photo_count: number
  checklist_total: number
  checklist_done: number
}

export interface OrderPhoto {
  id: number
  url: string
}

export interface ChecklistItem {
  id: number
  text: string
  done: boolean
}

export interface OrderEvent {
  id: number
  text: string
  created_at: string
}

export interface OrderDetail extends OrderSummary {
  description: string
  client_phone: string
  note: string
  photos: OrderPhoto[]
  checklist: ChecklistItem[]
  events: OrderEvent[]
  created_at: string
}

export type OrderPatch = Partial<
  Pick<OrderDetail, "status" | "note" | "title" | "description" | "price" | "prepayment" | "address">
>
