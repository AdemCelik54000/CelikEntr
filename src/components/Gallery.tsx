import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import type { MediaItem } from '../lib/media';

export type GallerySection = {
  label: string;
  media: MediaItem[];
};

type Props = {
  title: string;
  sections: GallerySection[];
  initialSection?: number;
  initialIndex?: number;
  onClose: () => void;
};

const PRELOAD_AHEAD = 3;
const NO_MEDIA: MediaItem[] = [];
const SWIPE_THRESHOLD = 50;

const Gallery = ({ title, sections, initialSection = 0, initialIndex = 0, onClose }: Props) => {
  const [sectionIndex, setSectionIndex] = useState(initialSection);
  const [mediaIndex, setMediaIndex] = useState(initialIndex);
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const media = sections[sectionIndex]?.media ?? NO_MEDIA;
  const total = media.length;
  const current = media[Math.min(mediaIndex, Math.max(total - 1, 0))];

  const go = useCallback(
    (delta: number) => {
      if (total < 2) {
        return;
      }
      setMediaIndex((prev) => (prev + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        go(1);
      } else if (event.key === 'ArrowLeft') {
        go(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [go, onClose]);

  useEffect(() => {
    setLoaded(false);
    for (let offset = 1; offset <= PRELOAD_AHEAD; offset += 1) {
      const item = media[(mediaIndex + offset) % Math.max(total, 1)];
      if (item?.kind === 'image') {
        const loader = new Image();
        loader.src = item.src;
      }
    }
    const thumb = thumbsRef.current?.querySelector<HTMLElement>(`[data-index="${mediaIndex}"]`);
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [media, mediaIndex, total]);

  const selectSection = (index: number) => {
    setSectionIndex(index);
    setMediaIndex(0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie photos : ${title}`}
      className="pop-in fixed inset-0 z-[60] flex flex-col bg-black text-white"
    >
      <div className="flex items-center gap-3 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)] sm:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">{title}</h3>
          {total > 0 && (
            <p className="text-[13px] text-white/60" aria-live="polite">
              Photo {mediaIndex + 1} sur {total}
            </p>
          )}
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer la galerie"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {sections.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6" role="tablist">
          {sections.map((section, index) => (
            <button
              key={section.label}
              type="button"
              role="tab"
              aria-selected={index === sectionIndex}
              onClick={() => selectSection(index)}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-[14px] font-semibold transition ${
                index === sectionIndex ? 'bg-white text-ink' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {section.label}
              <span className={`ml-1.5 ${index === sectionIndex ? 'text-slate-500' : 'text-white/50'}`}>
                {section.media.length}
              </span>
            </button>
          ))}
        </div>
      )}

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onTouchStart={(event) => {
          touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) {
            return;
          }
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? 1 : -1);
          } else if (dy > 120 && Math.abs(dy) > Math.abs(dx)) {
            onClose();
          }
        }}
      >
        {!current ? (
          <p className="px-6 text-center text-white/70">Les photos de cette catégorie arrivent bientôt.</p>
        ) : current.kind === 'image' ? (
          <>
            {!loaded && (
              <img
                src={current.previewSrc}
                alt=""
                aria-hidden="true"
                className="absolute max-h-full max-w-full scale-100 object-contain blur-sm"
              />
            )}
            <img
              key={current.src}
              src={current.src}
              alt={`${sections[sectionIndex]?.label ?? title} – photo ${mediaIndex + 1}`}
              onLoad={() => setLoaded(true)}
              className={`media-in relative max-h-full max-w-full select-none rounded-lg object-contain transition-opacity duration-300 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              draggable={false}
            />
          </>
        ) : (
          <video
            key={current.src}
            src={current.src}
            poster={current.previewSrc}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="media-in max-h-full max-w-full rounded-lg"
          />
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/25 sm:grid"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/25 sm:grid"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div
          ref={thumbsRef}
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 sm:justify-center sm:px-6"
        >
          {media.map((item, index) => (
            <button
              key={item.src}
              type="button"
              data-index={index}
              onClick={() => setMediaIndex(index)}
              aria-label={`Voir la photo ${index + 1}`}
              aria-current={index === mediaIndex}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition sm:h-16 sm:w-16 ${
                index === mediaIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-90'
              }`}
            >
              <img src={item.previewSrc} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              {item.kind === 'video' && (
                <Play className="absolute inset-0 m-auto h-5 w-5 fill-white text-white drop-shadow" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
