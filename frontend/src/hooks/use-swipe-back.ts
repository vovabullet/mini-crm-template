import { useRef } from "react"

/** Свайп вправо от левого края экрана — закрыть экран (как в iOS). */
export function useSwipeBack(onBack: () => void, edge = 32, distance = 80) {
  const startX = useRef<number | null>(null)

  return {
    onTouchStart: (e: React.TouchEvent) => {
      const x = e.touches[0].clientX
      startX.current = x < edge ? x : null
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current !== null && e.changedTouches[0].clientX - startX.current > distance) onBack()
      startX.current = null
    },
  }
}
