import { useRef, useState } from "react"
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { OrderPhoto } from "@/types/order"

export function PhotoGallery({
  photos,
  onUpload,
}: {
  photos: OrderPhoto[]
  onUpload?: (files: File[]) => Promise<void>
}) {
  const [index, setIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  const handleFiles = async (list: FileList | null) => {
    if (!list?.length || !onUpload) return
    setUploading(true)
    try {
      await onUpload(Array.from(list))
    } finally {
      setUploading(false)
      if (fileInput.current) fileInput.current.value = ""
    }
  }

  const uploadButton = onUpload && (
    <>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        variant="secondary"
        size="sm"
        disabled={uploading}
        onClick={() => fileInput.current?.click()}
        className="pointer-events-auto absolute right-3 bottom-3 shadow-sm"
      >
        <CameraIcon /> {uploading ? "Загрузка…" : "Фото"}
      </Button>
    </>
  )

  if (photos.length === 0) {
    return (
      <div className="relative px-4 pt-4">
        <div className="text-muted-foreground flex h-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-sm">
          <ImageIcon className="size-5" />
          Клиент не приложил фото
        </div>
        {uploadButton && <div className="pointer-events-none absolute inset-x-4 bottom-0 h-full">{uploadButton}</div>}
      </div>
    )
  }

  const single = photos.length === 1
  return (
    <>
      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pt-4">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Открыть фото ${i + 1}`}
              className={cn(
                "bg-muted focus-visible:ring-ring/50 aspect-[4/3] shrink-0 snap-center overflow-hidden rounded-xl outline-none focus-visible:ring-[3px]",
                single ? "w-full" : "w-[84%]"
              )}
            >
              <img src={p.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
        {uploadButton && <div className="pointer-events-none absolute inset-x-4 top-4 bottom-0">{uploadButton}</div>}
      </div>

      <Dialog open={index !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <DialogContent className="flex h-dvh max-w-none items-center justify-center rounded-none border-0 bg-black p-0 text-white sm:max-w-none [&>button]:top-[max(1rem,env(safe-area-inset-top))] [&>button]:text-white">
          <DialogTitle className="sr-only">Фото к заказу</DialogTitle>
          {index !== null && <img src={photos[index].url} alt="" className="max-h-full max-w-full object-contain" />}
          {photos.length > 1 && index !== null && (
            <div className="absolute inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                className="size-11 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setIndex((index - 1 + photos.length) % photos.length)}
                aria-label="Предыдущее фото"
              >
                <ChevronLeftIcon />
              </Button>
              <span className="text-sm tabular-nums">
                {index + 1} / {photos.length}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="size-11 text-white hover:bg-white/10 hover:text-white"
                onClick={() => setIndex((index + 1) % photos.length)}
                aria-label="Следующее фото"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
