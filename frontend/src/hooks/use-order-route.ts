import { useCallback, useEffect, useRef, useState } from "react"

const parse = () => {
  const match = window.location.hash.match(/^#\/orders\/(\d+)/)
  return match ? Number(match[1]) : null
}

/** Роутинг через hash: #/orders/12 — открыт заказ. Работает системная кнопка «назад». */
export function useOrderRoute() {
  const [orderId, setOrderId] = useState<number | null>(parse)
  const openedInApp = useRef(false)

  useEffect(() => {
    const onChange = () => setOrderId(parse())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])

  const openOrder = useCallback((id: number) => {
    openedInApp.current = true
    window.location.hash = `/orders/${id}`
  }, [])

  const closeOrder = useCallback(() => {
    if (openedInApp.current) {
      openedInApp.current = false
      window.history.back()
    } else {
      // Открыли по прямой ссылке — просто убираем hash.
      window.history.replaceState(null, "", window.location.pathname + window.location.search)
      setOrderId(null)
    }
  }, [])

  return { orderId, openOrder, closeOrder }
}
