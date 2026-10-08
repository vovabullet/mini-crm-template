import type { ChecklistItem, OrderDetail, OrderPatch, OrderSummary } from "@/types/order"

// В dev запросы идут через прокси Vite (см. vite.config.ts).
// Для отдельного домена API задайте VITE_API_URL, например https://api.example.com
const BASE_URL = import.meta.env.VITE_API_URL ?? ""

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.error ?? `Ошибка ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  listOrders: () => request<OrderSummary[]>("/api/orders/"),
  getOrder: (id: number) => request<OrderDetail>(`/api/orders/${id}/`),
  updateOrder: (id: number, patch: OrderPatch) =>
    request<OrderDetail>(`/api/orders/${id}/`, { method: "PATCH", body: JSON.stringify(patch) }),
  uploadPhotos: (id: number, files: File[]) => {
    const body = new FormData()
    files.forEach((f) => body.append("files", f))
    return request<OrderDetail>(`/api/orders/${id}/photos/`, { method: "POST", body })
  },
  updateChecklistItem: (id: number, done: boolean) =>
    request<ChecklistItem>(`/api/checklist/${id}/`, { method: "PATCH", body: JSON.stringify({ done }) }),
}
