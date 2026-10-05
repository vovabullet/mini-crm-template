import { useEffect, useRef, useState } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Image that only attaches its `src` once it scrolls near the viewport.
 * Falls back to eager loading when IntersectionObserver is unavailable.
 */
export function LazyImage({ src, alt, className }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '50px' },
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}
