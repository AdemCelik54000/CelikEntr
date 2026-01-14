import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  src: string;
  previewSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  decoding?: 'async' | 'sync' | 'auto';
};

export default function ProgressiveImage({
  src,
  previewSrc,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
  sizes,
  decoding = 'async',
}: Props) {
  const mainImgRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Safari/iOS edge-case: when an image is served from cache, the load event can be missed.
  // If the image is already complete, mark it as loaded to stop the placeholder from pulsing forever.
  useEffect(() => {
    const img = mainImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const showPreview = Boolean(previewSrc && previewSrc !== src);
  const wrapperClassName = useMemo(
    () => `relative ${className ?? ''}`.trim(),
    [className]
  );

  if (!src) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {showPreview && (
        <img
          src={previewSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } ${imgClassName ?? ''}`.trim()}
          loading={loading}
          decoding={decoding}
        />
      )}

      {/* If a preview image exists, it already acts as the placeholder; avoid a light pulsing layer. */}
      {!isLoaded && !hasError && !showPreview && <div className="absolute inset-0 animate-pulse bg-slate-900/10" />}

      {!hasError ? (
        <img
          ref={mainImgRef}
          src={src}
          alt={alt}
          className={`relative h-full w-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : showPreview ? 'opacity-0' : 'opacity-100'
          } ${imgClassName ?? ''}`.trim()}
          loading={loading}
          decoding={decoding}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-slate-900/60 px-6 text-center text-white">
          <p className="text-sm font-semibold">Image indisponible</p>
          <p className="text-xs text-gray-200">Vérifiez l'adresse / le fichier.</p>
        </div>
      )}
    </div>
  );
}
