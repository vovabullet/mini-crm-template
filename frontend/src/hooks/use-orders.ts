import { useCallback, useEffect, useState } from "react"

import { api } from "@/lib/api"
import type { OrderSummary } from "@/types/order"

const POLL_MS = 30_000

/** Список заказов с автообновлением: новые заявки извне появляются сами. */
export function useOrders() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setOrders(await api.listOrders())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, POLL_MS)
    const onVisible = () => document.visibilityState === "visible" && refresh()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [refresh])

  return { orders, error, refresh }
}
