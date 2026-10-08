const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
})

export const formatPrice = (value: number) => priceFormatter.format(value)

function toLocalDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function dayDiff(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((toLocalDate(iso).getTime() - today.getTime()) / 86_400_000)
}

export function formatDay(iso: string) {
  const diff = dayDiff(iso)
  if (diff === 0) return "Сегодня"
  if (diff === 1) return "Завтра"
  if (diff === -1) return "Вчера"
  return toLocalDate(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

export function formatDue(date: string | null, time: string | null) {
  if (!date) return "Без срока"
  return time ? `${formatDay(date)}, ${time}` : formatDay(date)
}

export const formatEventDate = (iso: string) =>
  `${formatDay(iso)}, ${new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`

export const formatToday = () =>
  new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("")

export const phoneHref = (phone: string) => phone.replace(/[^+\d]/g, "")
