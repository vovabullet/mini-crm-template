import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import type { OrderDetail } from "@/types/order"

export function useOrder(id: number | null) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === null) return
    let cancelled = false
    setOrder((prev) => (prev?.id === id ? prev : null))
    setError(null)
    api
      .getOrder(id)
      .then((data) => !cancelled && setOrder(data))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : String(e)))
    return () => {
      cancelled = true
    }
  }, [id])

  return { order, setOrder, error }
}
