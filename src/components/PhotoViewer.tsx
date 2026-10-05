import { useEffect, useState } from 'react';
import type { OrderPhoto } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../utils/icons';

interface PhotoViewerProps {
  photos: OrderPhoto[];
  startIndex?: number;
  onClose: () => void;
}

export function PhotoViewer({ photos, startIndex = 0, onClose }: PhotoViewerProps) {
  const [index, setIndex] = useState(() =>
    photos.length ? ((startIndex % photos.length) + photos.length) % photos.length : 0,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setIndex((i) => (i - 1 + photos.length) % photos.length);
      if (event.key === 'ArrowRight') setIndex((i) => (i + 1) % photos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, photos.length]);

  if (!photos.length) return null;

  const step = (delta: number) => {
    setIndex((current) => (current + delta + photos.length) % photos.length);
  };

  return (
    <div
      className={`photo-viewer${visible ? ' visible' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="photo-viewer-header">
        <span className="photo-counter">
          {index + 1} / {photos.length}
        </span>
        <button type="button" className="close-button" aria-label="Закрыть" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="photo-viewer-body">
        <img src={photos[index].url} alt={`Order photo ${index + 1}`} />
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="photo-nav photo-nav-prev"
            aria-label="Предыдущее фото"
            onClick={() => step(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className="photo-nav photo-nav-next"
            aria-label="Следующее фото"
            onClick={() => step(1)}
          >
            <ChevronRightIcon />
          </button>
        </>
      )}
    </div>
  );
}
