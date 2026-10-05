import { cn } from "@/lib/utils"

export function DetailSection({
  title,
  action,
  className,
  children,
}: {
  title?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("border-t p-4 first:border-t-0", className)}>
      {(title || action) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          {title && <h2 className="text-muted-foreground text-sm font-medium">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
