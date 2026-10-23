import { useEffect, useMemo, useState } from 'react';
import mediaManifest from '../data/media-manifest.json';

export type MediaKind = 'image' | 'video';

export interface MediaItem {
  /** Untransformed URL, to build other sizes. */
  original: string;
  src: string;
  previewSrc: string;
  kind: MediaKind;
  name: string;
  createdAt?: string | null;
  position?: number | null;
}

interface ManifestMediaItem {
  name?: string;
  extension?: string;
  kind?: string;
  url: string;
  relativePath?: string;
  createdAt?: string | null;
  position?: number | null;
}

interface RemoteMediaManifest {
  entries: Record<string, { media?: ManifestMediaItem[] }>;
}

const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/';

type OptimizeOptions = {
  width?: number;
  quality?: string;
  poster?: boolean;
};

// Injects a Cloudinary transformation in front of the version segment of the URL.
export const optimizeCloudinaryUrl = (url: string, kind: MediaKind, options: OptimizeOptions = {}) => {
  if (!url.startsWith(CLOUDINARY_PREFIX)) {
    return url;
  }

  const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.+)/);
  if (!match) {
    return url;
  }

  const [, prefix, resourceType, rest] = match;
  const segments = rest.split('/').filter(Boolean);
  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const quality = options.quality ?? 'q_auto:eco';

  let transform: string;
  let tail = segments.slice(versionIndex === -1 ? 0 : versionIndex).join('/');

  if (resourceType === 'video' || kind === 'video') {
    if (options.poster) {
      // First frame of the video as a still image (thumbnails, posters).
      transform = ['so_0', 'f_auto', quality, 'c_limit', `w_${options.width ?? 640}`].join(',');
      tail = tail.replace(/\.[a-z0-9]+$/i, '.jpg');
    } else {
      transform = ['f_auto:video', quality, 'vc_auto', ...(options.width ? ['c_limit', `w_${options.width}`] : [])].join(
        ','
      );
    }
  } else {
    transform = ['f_auto', quality, 'dpr_auto', 'c_limit', `w_${options.width ?? 1200}`].join(',');
  }

  const existing = versionIndex === -1 ? [] : segments.slice(0, versionIndex);
  return `${prefix}${[...existing, transform, tail].join('/')}`;
};

const resolveMediaUrl = (url: string) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  const base = import.meta.env.VITE_MEDIA_BASE_URL;
  if (base) {
    return `${base.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
  }

  return url;
};

export const imageSrcSet = (url: string, widths: number[], quality = 'q_auto:good') =>
  url.startsWith(CLOUDINARY_PREFIX)
    ? widths.map((w) => `${optimizeCloudinaryUrl(url, 'image', { width: w, quality })} ${w}w`).join(', ')
    : undefined;

const sortMedia = (media: MediaItem[]) => {
  const hasPositions = media.length > 0 && media.every((item) => Number.isFinite(item.position));
  if (hasPositions) {
    return media.sort((a, b) => (a.position || 0) - (b.position || 0));
  }

  return media.sort((a, b) => {
    const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
    if (aDate !== bDate) {
      return aDate - bDate;
    }
    return a.name.localeCompare(b.name);
  });
};

const buildLibrary = (manifest: RemoteMediaManifest) => {
  const library: Record<string, MediaItem[]> = {};

  Object.entries(manifest.entries ?? {}).forEach(([rawFolderKey, entry]) => {
    const folderKey = rawFolderKey === '.' ? '' : rawFolderKey;
    const media: MediaItem[] = [];

    (entry?.media ?? []).forEach((item) => {
      const resolvedUrl = item && resolveMediaUrl(item.url);
      if (!resolvedUrl) {
        return;
      }

      const kind: MediaKind = item.kind === 'video' ? 'video' : 'image';
      media.push({
        original: resolvedUrl,
        src: optimizeCloudinaryUrl(resolvedUrl, kind, kind === 'image' ? { width: 1280, quality: 'q_auto:good' } : {}),
        previewSrc: optimizeCloudinaryUrl(resolvedUrl, kind, { width: 600, quality: 'q_auto:low', poster: true }),
        kind,
        name: item.name ?? item.extension ?? kind,
        createdAt: item.createdAt ?? null,
        position: item.position ?? null,
      });
    });

    library[folderKey] = sortMedia(media);
  });

  return library;
};

const MANIFEST_TTL_MS = 1000 * 60 * 60 * 12;

const readCachedManifest = (cacheKey: string) => {
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    const cached = JSON.parse(cachedRaw) as { ts: number; data: RemoteMediaManifest };
    if (cached?.data?.entries && Date.now() - (cached.ts || 0) < MANIFEST_TTL_MS) {
      return cached.data;
    }
  } catch {
    // ignore cache errors (private mode, quota, parse)
  }
  return null;
};

/**
 * Media library grouped by Cloudinary folder. Starts from the cached (or bundled) manifest and
 * refreshes from the Netlify function so photos added from the panel show up without a rebuild.
 */
export const useMediaLibrary = () => {
  const baseFolder = import.meta.env.VITE_CLOUDINARY_BASE_FOLDER || 'celik-portfolio';
  const cacheKey = `celik.mediaManifest.${baseFolder}`;
  const [remoteManifest, setRemoteManifest] = useState<RemoteMediaManifest | null>(() => readCachedManifest(cacheKey));

  useEffect(() => {
    const controller = new AbortController();

    const fetchManifest = async () => {
      const candidates: string[] = [window.location.origin];
      const siteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
      if (siteUrl && /^https?:\/\//i.test(siteUrl) && !candidates.includes(siteUrl)) {
        candidates.push(siteUrl);
      }

      for (const origin of candidates) {
        try {
          const url = new URL('/.netlify/functions/cloudinary-media', origin);
          url.searchParams.set('base', baseFolder);

          const response = await fetch(url.toString(), { signal: controller.signal });
          if (!response.ok) {
            continue;
          }

          const data = (await response.json()) as RemoteMediaManifest;
          if (data && data.entries) {
            setRemoteManifest(data);
            try {
              localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
            } catch {
              // ignore quota
            }
            return;
          }
        } catch {
          if (controller.signal.aborted) {
            return;
          }
          // not JSON / network error: try the next origin, else keep the cached/bundled manifest
        }
      }
    };

    fetchManifest();
    return () => controller.abort();
  }, [baseFolder, cacheKey]);

  return useMemo(
    () => buildLibrary(remoteManifest ?? (mediaManifest as RemoteMediaManifest)),
    [remoteManifest]
  );
};

/** Root images of the bundled manifest (hero and "about" pictures). */
export const getRootImageUrl = (relativePath?: string) => {
  const rootMedia: ManifestMediaItem[] = (mediaManifest as RemoteMediaManifest).entries?.['.']?.media ?? [];
  const image =
    (relativePath ? rootMedia.find((item) => item.relativePath === relativePath) : undefined) ??
    rootMedia.find((item) => item.kind === 'image');
  return image?.url ?? '';
};
