import { useEffect, useRef, useState } from "react"

import { Textarea } from "@/components/ui/textarea"

/** Заметка исполнителя. Сохраняется автоматически через паузу в наборе и при потере фокуса. */
export function OrderNote({ value, onSave }: { value: string; onSave: (note: string) => Promise<void> }) {
  const [draft, setDraft] = useState(value)
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const saved = useRef(value)

  useEffect(() => {
    setDraft(value)
    saved.current = value
  }, [value])

  const save = async (text: string) => {
    clearTimeout(timer.current)
    if (text === saved.current) return
    setState("saving")
    await onSave(text)
    saved.current = text
    setState("saved")
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Textarea
        id="order-note"
        value={draft}
        placeholder="Например: код домофона, пожелания…"
        className="min-h-20 text-base"
        onChange={(e) => {
          setDraft(e.target.value)
          setState("idle")
          clearTimeout(timer.current)
          const text = e.target.value
          timer.current = setTimeout(() => save(text), 800)
        }}
        onBlur={() => save(draft)}
      />
      <p className="text-muted-foreground h-4 text-xs" aria-live="polite">
        {state === "saving" ? "Сохраняю…" : state === "saved" ? "Сохранено" : ""}
      </p>
    </div>
  )
}
