
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Hammer,
  Wrench,
  Building,
  Shield,
  BadgeCheck,
  Truck,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  AlertCircle,
  Play,
} from 'lucide-react';
import mediaManifest from '../data/media-manifest.json';
import ProgressiveImage from './ProgressiveImage';

type ManifestMedia = {
  kind?: string;
  url?: string;
  relativePath?: string;
};

type MediaManifest = {
  entries?: Record<string, { media?: ManifestMedia[] }>;
};

type MediaKind = 'image' | 'video';

type ServiceItem = {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  categories: string[];
};

interface MediaItem {
  src: string;
  previewSrc?: string;
  kind: MediaKind;
  name: string;
  extension: string;
  relativePath?: string;
  publicId?: string | null;
  createdAt?: string | null;
  position?: number | null;
}

interface Project {
  id: number;
  title: string;
  category: string;
  folder: string;
  description: string;
  media: MediaItem[];
  hasUnsupportedMedia: boolean;
  unsupportedExtensions: string[];
}

type FolderMediaInfo = {
  media: MediaItem[];
  hasUnsupportedMedia: boolean;
  unsupportedExtensions: Set<string>;
};

type OptimizeOptions = {
  width?: number;
  quality?: string;
};

interface ManifestMediaItem {
  name: string;
  extension: string;
  kind: MediaKind;
  url: string;
  relativePath?: string;
  publicId?: string | null;
  bytes?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt?: string | null;
  position?: number | null;
}

interface ManifestFolderEntry {
  media?: ManifestMediaItem[];
  hasUnsupportedMedia?: boolean;
  unsupportedExtensions?: string[];
}

interface RemoteMediaManifest {
  version: number;
  generatedAt: string | null;
  source: string;
  entries: Record<string, ManifestFolderEntry>;
}

const PRELOAD_AHEAD = 5;

const Services = () => {
  const services = useMemo<ServiceItem[]>(
    () => [
      {
        key: 'fondations',
        icon: <Home className="h-12 w-12 text-orange-500" />,
        title: 'Fondations',
        description: 'Fondations b\u00e9ton, semelles et radiers pour des structures durables.',
        categories: ['Fondations'],
      },
      {
        key: 'murs-cloisons',
        icon: <Building className="h-12 w-12 text-orange-500" />,
        title: 'Murs & Cloisons',
        description: 'Construction de murs porteurs, cloisons et murs de sout\u00e8nement en b\u00e9ton ou parpaing.',
        categories: ['Murs & Cloisons'],
      },
      {
        key: 'dalle-beton',
        icon: <Hammer className="h-12 w-12 text-orange-500" />,
        title: 'Dalle B\u00e9ton',
        description: 'Coulage de dalles b\u00e9ton et chapes avec finitions soign\u00e9es.',
        categories: ['Dalle B\u00e9ton'],
      },
      {
        key: 'renovation',
        icon: <Wrench className="h-12 w-12 text-orange-500" />,
        title: 'R\u00e9novation',
        description: 'R\u00e9novation compl\u00e8te, extension et sur\u00e9l\u00e9vation de b\u00e2timents existants.',
        categories: ['R\u00e9novation'],
      },
      {
        key: 'etancheite-terrassement',
        icon: <Shield className="h-12 w-12 text-orange-500" />,
        title: '\u00c9tanch\u00e9it\u00e9 & Terrassement',
        description: '\u00c9tanch\u00e9it\u00e9, drainage, pr\u00e9paration du terrain et am\u00e9nagements ext\u00e9rieurs.',
        categories: ['\u00c9tanch\u00e9it\u00e9 & Terrassement'],
      },
      {
        key: 'escalier',
        icon: <Truck className="h-12 w-12 text-orange-500" />,
        title: 'Escaliers b\u00e9ton',
        description: "Fabrication d'escaliers en b\u00e9ton arm\u00e9 sur mesure, int\u00e9rieurs ou ext\u00e9rieurs.",
        categories: ['Escaliers b\u00e9ton'],
      },
    ],
    []
  );

  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const [remoteManifest, setRemoteManifest] = useState<RemoteMediaManifest | null>(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      const next = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
      setColumns((prev) => (prev === next ? prev : next));
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const aboutImageUrl = useMemo(() => {
    const manifest = mediaManifest as MediaManifest;
    const rootMedia = manifest.entries?.['.']?.media ?? [];
    const image =
      rootMedia.find((item) => item.relativePath === 'hero-about.png') ??
      rootMedia.find((item) => item.kind === 'image');

    if (!image?.url) {
      return '/images/hero-about.png';
    }

    if (!image.url.startsWith('https://res.cloudinary.com/')) {
      return image.url;
    }

    const match = image.url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)/);
    if (!match) {
      return image.url;
    }

    const [, prefix, rest] = match;
    if (rest.startsWith('f_') || rest.startsWith('q_') || rest.startsWith('w_')) {
      return image.url;
    }

    return `${prefix}f_auto,q_auto:good,w_1400/${rest}`;
  }, []);

  const optimizeCloudinaryUrl = useCallback((url: string, kind: MediaKind, options: OptimizeOptions = {}) => {
    if (!url.startsWith('https://res.cloudinary.com/')) {
      return url;
    }

    const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.+)/);
    if (!match) {
      return url;
    }

    const [, prefix, resourceType, rest] = match;

    const injectTransform = (transform: string) => {
      const segments = rest.split('/').filter(Boolean);
      const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));

      if (versionIndex === -1) {
        return `${prefix}${transform}/${rest}`;
      }

      const existing = segments.slice(0, versionIndex);
      const after = segments.slice(versionIndex).join('/');
      const combined = existing.includes(transform) ? [...existing, after] : [...existing, transform, after];
      return `${prefix}${combined.join('/')}`;
    };

    const width = options.width;
    const quality = options.quality ?? 'q_auto:eco';

    if (resourceType === 'image' || kind === 'image') {
      const parts = ['f_auto', quality, 'dpr_auto'];
      if (width) {
        parts.push('c_limit');
        parts.push(`w_${width}`);
      } else {
        parts.push('c_limit');
        parts.push('w_1200');
      }

      return injectTransform(parts.join(','));
    }

    const videoParts = ['f_auto:video', quality, 'vc_auto'];
    if (width) {
      videoParts.push('c_limit');
      videoParts.push(`w_${width}`);
    }

    return injectTransform(videoParts.join(','));
  }, []);

  const resolveMediaUrl = useCallback((url: string) => {
    if (!url) {
      return url;
    }

    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const base = import.meta.env.VITE_MEDIA_BASE_URL;
    if (base) {
      const normalizedBase = base.replace(/\/+$/, '');
      const normalizedUrl = url.replace(/^\/+/, '');
      return `${normalizedBase}/${normalizedUrl}`;
    }

    return url;
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const baseFolder = import.meta.env.VITE_CLOUDINARY_BASE_FOLDER || 'celik-portfolio';

    const cacheKey = `celik.mediaManifest.${baseFolder}`;
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as { ts: number; data: RemoteMediaManifest };
        const ageMs = Date.now() - (cached.ts || 0);
        if (cached?.data?.entries && ageMs < 1000 * 60 * 60 * 12) {
          setRemoteManifest(cached.data);
        }
      } catch {
        // ignore cache parse errors
      }
    }

    const fetchManifest = async () => {
      try {
        const candidates: string[] = [window.location.origin];
        const siteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
        if (siteUrl && /^https?:\/\//i.test(siteUrl) && !candidates.includes(siteUrl)) {
          candidates.push(siteUrl);
        }

        for (const origin of candidates) {
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
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    };

    fetchManifest();

    return () => controller.abort();
  }, []);

  const manifestData = useMemo(
    () => (remoteManifest ?? (mediaManifest as RemoteMediaManifest)),
    [remoteManifest]
  );

  const folderMediaInfo = useMemo(() => {
    const entries = manifestData?.entries ?? {};
    const info: Record<string, FolderMediaInfo> = {};

    Object.entries(entries).forEach(([rawFolderKey, entry]) => {
      const folderKey = rawFolderKey === '.' ? '' : rawFolderKey;
      const folderInfo: FolderMediaInfo = {
        media: [],
        hasUnsupportedMedia: Boolean(entry?.hasUnsupportedMedia),
        unsupportedExtensions: new Set(entry?.unsupportedExtensions ?? []),
      };

      (entry?.media ?? []).forEach((item) => {
        if (!item) {
          return;
        }

        const extension = item.extension?.toLowerCase?.() ?? '';
        const kind: MediaKind = item.kind === 'video' ? 'video' : 'image';
        const resolvedUrl = resolveMediaUrl(item.url);
        const optimizedUrl = optimizeCloudinaryUrl(resolvedUrl, kind);

        if (!resolvedUrl) {
          return;
        }

        const addUnsupported = () => {
          folderInfo.hasUnsupportedMedia = true;
          if (extension) {
            folderInfo.unsupportedExtensions.add(extension);
          }
        };

        const thumbnailUrl =
          kind === 'image'
            ? optimizeCloudinaryUrl(resolvedUrl, kind, { width: 600, quality: 'q_auto:low' })
            : optimizeCloudinaryUrl(resolvedUrl, kind, { width: 640, quality: 'q_auto:low' });

        if (kind === 'image') {
          folderInfo.media.push({
            src: optimizedUrl,
            previewSrc: thumbnailUrl,
            kind,
            name: item.name ?? `${extension || 'image'}`,
            extension,
            relativePath: item.relativePath,
            publicId: item.publicId ?? null,
            createdAt: item.createdAt ?? null,
            position: item.position ?? null,
          });
          return;
        }

        if (kind === 'video') {
          folderInfo.media.push({
            src: optimizedUrl,
            previewSrc: thumbnailUrl,
            kind,
            name: item.name ?? `${extension || 'video'}`,
            extension,
            relativePath: item.relativePath,
            publicId: item.publicId ?? null,
            createdAt: item.createdAt ?? null,
            position: item.position ?? null,
          });
          return;
        }

        addUnsupported();
      });

      const hasPositions =
        folderInfo.media.length > 0 &&
        folderInfo.media.every((mediaItem) => Number.isFinite(mediaItem.position));
      if (hasPositions) {
        folderInfo.media.sort((a, b) => (a.position || 0) - (b.position || 0));
      } else {
        folderInfo.media.sort((a, b) => {
          const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
          const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;

          if (aDate && bDate && aDate !== bDate) {
            return aDate - bDate;
          }

          if (aDate !== bDate) {
            return aDate - bDate;
          }

          return a.name.localeCompare(b.name);
        });
      }
      info[folderKey] = folderInfo;
    });

    return info;
  }, [manifestData, optimizeCloudinaryUrl, resolveMediaUrl]);

  const withMediaData = useCallback(
    (folder: string) => {
      const entry = folderMediaInfo[folder];
      if (!entry) {
        return { media: [], hasUnsupportedMedia: false, unsupportedExtensions: [] as string[] };
      }

      return {
        media: entry.media,
        hasUnsupportedMedia: entry.hasUnsupportedMedia,
        unsupportedExtensions: Array.from(entry.unsupportedExtensions).sort(),
      };
    },
    [folderMediaInfo]
  );

  const projects = useMemo<Project[]>(
    () => [
      {
        id: 0,
        title: 'Finalisations',
        category: 'Finalisations',
        folder: 'finalisations',
        description: 'Chantiers termin\u00e9s et finitions exemplaires',
        ...withMediaData('finalisations'),
      },
      {
        id: 1,
        title: 'Fondations Fouilles',
        category: 'Fondations',
        folder: 'fondations/fondations-fouilles',
        description: 'Excavation et pr\u00e9paration des fouilles pour fondations',
        ...withMediaData('fondations/fondations-fouilles'),
      },
      {
        id: 2,
        title: 'Fondations Propret\u00e9',
        category: 'Fondations',
        folder: 'fondations/fondations-propretes',
        description: 'B\u00e9ton de propret\u00e9 pour assise des fondations',
        ...withMediaData('fondations/fondations-propretes'),
      },
      {
        id: 3,
        title: 'Fondations Semelles',
        category: 'Fondations',
        folder: 'fondations/fondations-semelles',
        description: 'Semelles filantes et isol\u00e9es en b\u00e9ton arm\u00e9',
        ...withMediaData('fondations/fondations-semelles'),
      },
      {
        id: 4,
        title: 'Fondations Plots',
        category: 'Fondations',
        folder: 'fondations/fondations-plots',
        description: 'Plots b\u00e9ton pour structures l\u00e9g\u00e8res',
        ...withMediaData('fondations/fondations-plots'),
      },
      {
        id: 5,
        title: 'Fondations B\u00e9ton',
        category: 'Fondations',
        folder: 'fondations/fondations-betons',
        description: 'Coulage de b\u00e9ton pour fondations massives',
        ...withMediaData('fondations/fondations-betons'),
      },
      {
        id: 6,
        title: 'Fondations Radier',
        category: 'Fondations',
        folder: 'fondations/fondations-radier',
        description: 'Radier g\u00e9n\u00e9ral pour terrain difficile',
        ...withMediaData('fondations/fondations-radier'),
      },
      {
        id: 7,
        title: 'Fondations B\u00e2timents',
        category: 'Fondations',
        folder: 'fondations/fondations-batiments',
        description: 'Fondations sp\u00e9ciales pour b\u00e2timents industriels',
        ...withMediaData('fondations/fondations-batiments'),
      },
      {
        id: 8,
        title: 'Murs & Cloisons',
        category: 'Murs & Cloisons',
        folder: 'murs-cloisons',
        description: 'Construction de murs porteurs et cloisons',
        ...withMediaData('murs-cloisons'),
      },
      {
        id: 9,
        title: 'Dalle B\u00e9ton Plancher',
        category: 'Dalle B\u00e9ton',
        folder: 'dalle-beton/plancher',
        description: 'R\u00e9alisation de dalles b\u00e9ton pour planchers',
        ...withMediaData('dalle-beton/plancher'),
      },
      {
        id: 10,
        title: 'Dalle B\u00e9ton Sol',
        category: 'Dalle B\u00e9ton',
        folder: 'dalle-beton/sol-beton',
        description: 'Pr\u00e9paration et coulage de sols b\u00e9ton',
        ...withMediaData('dalle-beton/sol-beton'),
      },
      {
        id: 11,
        title: 'R\u00e9novation',
        category: 'R\u00e9novation',
        folder: 'renovation',
        description: 'R\u00e9novation compl\u00e8te de b\u00e2timents',
        ...withMediaData('renovation'),
      },
      {
        id: 12,
        title: '\u00c9tanch\u00e9it\u00e9 & Terrassement',
        category: '\u00c9tanch\u00e9it\u00e9 & Terrassement',
        folder: 'etancheite-terrassement',
        description: '\u00c9tanch\u00e9it\u00e9, drainage et terrassement pour vos projets ext\u00e9rieurs',
        ...withMediaData('etancheite-terrassement'),
      },
      {
        id: 13,
        title: 'Escalier B\u00e9ton',
        category: 'Escaliers b\u00e9ton',
        folder: 'escalier',
        description: 'Fabrication d\'escaliers b\u00e9ton sur mesure',
        ...withMediaData('escalier'),
      },
    ],
    [withMediaData]
  );

  const projectsByCategory = useMemo(() => {
    const map: Record<string, Project[]> = {};
    projects.forEach((project) => {
      if (!map[project.category]) {
        map[project.category] = [];
      }
      map[project.category].push(project);
    });
    return map;
  }, [projects]);

  const finalisationsProject = useMemo(
    () => projects.find((project) => project.category === 'Finalisations') ?? null,
    [projects]
  );

  const finalisationsPreview = finalisationsProject
    ? finalisationsProject.media.find((item) => item.kind === 'image') ??
      finalisationsProject.media.find((item) => item.kind === 'video') ??
      null
    : null;

  const getProjectsForService = useCallback(
    (categories: string[]) => {
      const combined: Project[] = [];
      const seen = new Set<number>();
      categories.forEach((category) => {
        (projectsByCategory[category] ?? []).forEach((project) => {
          if (!seen.has(project.id)) {
            seen.add(project.id);
            combined.push(project);
          }
        });
      });
      return combined;
    },
    [projectsByCategory]
  );

  const serviceRows = useMemo(() => {
    const rows: ServiceItem[][] = [];
    for (let i = 0; i < services.length; i += columns) {
      rows.push(services.slice(i, i + columns));
    }
    return rows;
  }, [services, columns]);

  const selectedUnsupportedList = selectedProject
    ? selectedProject.unsupportedExtensions.length > 0
      ? selectedProject.unsupportedExtensions.join(', ')
      : 'non reconnus'
    : '';

  const openGallery = (project: Project) => {
    setSelectedProject(project);
    setCurrentMediaIndex(0);
  };

  const closeGallery = useCallback(() => {
    setSelectedProject(null);
    setCurrentMediaIndex(0);
  }, []);

  const nextMedia = useCallback(() => {
    if (!selectedProject || selectedProject.media.length === 0) {
      return;
    }
    setCurrentMediaIndex((prev) =>
      prev === selectedProject.media.length - 1 ? 0 : prev + 1
    );
  }, [selectedProject]);

  const prevMedia = useCallback(() => {
    if (!selectedProject || selectedProject.media.length === 0) {
      return;
    }
    setCurrentMediaIndex((prev) =>
      prev === 0 ? selectedProject.media.length - 1 : prev - 1
    );
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    if (currentMediaIndex >= selectedProject.media.length) {
      setCurrentMediaIndex(0);
    }
  }, [selectedProject, currentMediaIndex]);

  useEffect(() => {
    preloadedImagesRef.current = new Set();
  }, [selectedProject?.id]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const { media } = selectedProject;
    const total = media.length;
    if (total === 0) {
      return;
    }

    const preloadImageAt = (targetIndex: number) => {
      const normalizedIndex = (targetIndex + total) % total;
      const item = media[normalizedIndex];
      if (!item || item.kind !== 'image') {
        return;
      }
      const url = item.src;
      if (!url || preloadedImagesRef.current.has(url)) {
        return;
      }
      const loader = new Image();
      loader.src = url;
      preloadedImagesRef.current.add(url);
    };

    preloadImageAt(currentMediaIndex);
    preloadImageAt(currentMediaIndex - 1);

    for (let offset = 1; offset <= PRELOAD_AHEAD; offset += 1) {
      preloadImageAt(currentMediaIndex + offset);
    }
  }, [selectedProject, currentMediaIndex]);

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeGallery();
      } else if (event.key === 'ArrowRight') {
        nextMedia();
      } else if (event.key === 'ArrowLeft') {
        prevMedia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, closeGallery, nextMedia, prevMedia]);

  const toggleService = (serviceKey: string) => {
    setExpandedService((prev) => (prev === serviceKey ? null : serviceKey));
  };

  return (
    <section id="services" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
            Nos <span className="text-orange-500">{'Services & R\u00e9alisations'}</span>
          </h2>
          <p className="mx-auto text-xl text-gray-600">
            {'Des fondations \u00e0 la finition, nous ma\u00eetrisons chaque \u00e9tape du gros \u0153uvre pour concr\u00e9tiser vos projets de construction et de r\u00e9novation.'}
          </p>
        </div>

        <div className="space-y-8">
          {finalisationsProject && (
            <div className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
              <div className="grid items-center gap-8 md:grid-cols-[1.2fr,0.8fr]">
                <div>
                  <div className="flex items-center gap-3 text-orange-500">
                    <BadgeCheck className="h-10 w-10" />
                  </div>
                  <h3 className="mt-4 text-3xl font-bold text-slate-800">Finalisation</h3>
                  <p className="mt-3 text-lg text-gray-600">
                    {
                      'Finalisation de nos projets termin\u00e9s, avec nos clients et leurs maisons achev\u00e9es.'
                    }
                  </p>
                  <p className="mt-3 text-gray-500">
                    {'Cliquez sur la galerie pour agrandir et d\u00e9filer les photos.'}
                  </p>
                </div>

                <div
                  className="group relative h-64 w-full cursor-pointer overflow-hidden rounded-2xl shadow-lg md:h-72 md:w-72 md:justify-self-end"
                  onClick={() => openGallery(finalisationsProject)}
                >
                  {finalisationsPreview ? (
                    finalisationsPreview.kind === 'image' ? (
                      <ProgressiveImage
                        src={finalisationsPreview.src}
                        previewSrc={finalisationsPreview.previewSrc}
                        alt={finalisationsProject.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full"
                        imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={finalisationsPreview.src}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    )
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-center text-white">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold">{'Ajoutez vos images ou vid\u00e9os'}</p>
                      <p className="text-xs text-gray-300">
                        Placez-les dans <span className="font-mono">public/images/finalisations</span>
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="space-y-2 text-center text-white">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">Voir la galerie</p>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">{finalisationsProject.title}</h3>
                      <p className="text-xs text-gray-200">{finalisationsProject.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {serviceRows.map((row, rowIndex) => {
            const expandedInRow = row.find((service) => service.key === expandedService) ?? null;
            const serviceProjects = expandedInRow ? getProjectsForService(expandedInRow.categories) : [];
            const panelId = expandedInRow ? `service-panel-${expandedInRow.key}` : undefined;

            return (
              <React.Fragment key={`service-row-${rowIndex}`}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {row.map((service) => {
                    const isExpanded = expandedService === service.key;

                    return (
                      <button
                        key={service.key}
                        type="button"
                        onClick={() => toggleService(service.key)}
                        aria-expanded={isExpanded}
                        aria-controls={`service-panel-${service.key}`}
                        className={`group relative transform rounded-lg bg-white p-8 text-left shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                          isExpanded ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <span className="absolute right-4 top-4 rounded-md bg-slate-200/70 px-2 py-1 text-[11px] text-slate-600">
                          Cliquez pour ouvrir
                        </span>
                        <div className="mb-6 transition-transform duration-300 group-hover:scale-110">{service.icon}</div>
                        <h3 className="mb-4 text-xl font-bold text-slate-800">{service.title}</h3>
                        <p className="leading-relaxed text-gray-600">{service.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div
                  id={panelId}
                  className={`overflow-hidden transition-all duration-500 ${
                    expandedInRow ? 'max-h-[2000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'
                  }`}
                >
                  {expandedInRow && (
                    <div className="mt-6 rounded-2xl bg-white p-6 shadow-xl">
                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-2xl font-bold text-slate-800">
                          {'R\u00e9alisations - '}
                          {expandedInRow.title}
                        </h4>
                        <span className="text-sm text-slate-500">
                          {serviceProjects.length} {'cat\u00e9gorie'}
                          {serviceProjects.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {serviceProjects.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-slate-500">
                          {'Ajoutez des images pour afficher les r\u00e9alisations de ce service.'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {serviceProjects.map((project) => {
                            const previewImage = project.media.find((item) => item.kind === 'image');
                            const previewVideo = project.media.find((item) => item.kind === 'video');
                            const preview = previewImage ?? previewVideo;
                            const hasPreview = Boolean(preview);
                            const overlayIcon =
                              preview?.kind === 'video' ? <Play className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />;
                            const unsupportedList =
                              project.unsupportedExtensions.length > 0 ? project.unsupportedExtensions.join(', ') : 'non reconnus';

                            return (
                              <div
                                key={project.id}
                                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                onClick={() => openGallery(project)}
                              >
                                <div className="relative overflow-hidden rounded-lg shadow-lg">
                                  {hasPreview && preview ? (
                                    preview.kind === 'image' ? (
                                      <ProgressiveImage
                                        src={preview.src}
                                        previewSrc={preview.previewSrc}
                                        alt={project.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-56 w-full"
                                        imgClassName="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                      />
                                    ) : (
                                      <video
                                        src={preview.src}
                                        className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                      />
                                    )
                                  ) : (
                                    <div className="flex h-56 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-center text-white">
                                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
                                        <ImageIcon className="h-6 w-6" />
                                      </div>
                                      {project.hasUnsupportedMedia ? (
                                        <>
                                          <p className="text-sm font-semibold">{'Formats non support\u00e9s d\u00e9tect\u00e9s'}</p>
                                          <p className="text-xs text-gray-300">
                                            Convertissez les fichiers {unsupportedList} en formats compatibles.
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <p className="text-sm font-semibold">{'Ajoutez vos images ou vid\u00e9os'}</p>
                                          <p className="text-xs text-gray-300">
                                            Placez-les dans <span className="font-mono">public/images/{project.folder}</span>
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  )}

                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="space-y-2 text-center text-white">
                                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
                                        {overlayIcon}
                                      </div>
                                      <p className="text-sm font-medium">Voir la galerie</p>
                                    </div>
                                  </div>

                                  <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                    <div className="text-white">
                                      <h3 className="text-lg font-semibold">{project.title}</h3>
                                      <p className="text-xs text-gray-200">{project.description}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-16 rounded-lg bg-white p-8 shadow-lg md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold text-slate-800">Pourquoi nous choisir ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Expertise reconnue</h4>
                    <p className="text-gray-600">{'Plus de 17 ans d\u0027exp\u00e9rience dans le gros \u0153uvre.'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">{'Mat\u00e9riaux de qualit\u00e9'}</h4>
                    <p className="text-gray-600">{'S\u00e9lection rigoureuse des meilleurs mat\u00e9riaux.'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">{'Respect des d\u00e9lais'}</h4>
                    <p className="text-gray-600">{'Livraison des chantiers selon le calendrier annonc\u00e9.'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">{'Respect de l\u0027environnement'}</h4>
                    <p className="text-gray-600">{'Pratiques de chantier visant \u00e0 limiter l\u0027impact environnemental.'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <ProgressiveImage
                src={aboutImageUrl}
                alt={'\u00c9quipe Celik B\u00e2timent sur un chantier'}
                loading="lazy"
                decoding="async"
                className="h-64 w-full md:h-full"
                imgClassName="h-64 w-full object-cover md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeGallery();
              }
            }}
          >
            <div
              className="relative max-h-full w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                <button
                  onClick={closeGallery}
                  className="text-white transition-colors hover:text-gray-300"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="relative">
                {selectedProject.media.length > 0 ? (
                  <>
                    <div className="relative mb-6 flex items-center justify-center">
                      <div className="flex max-h-[75vh] max-w-[min(90vw,1100px)] items-center justify-center">
                        {selectedProject.media[currentMediaIndex].kind === 'image' ? (
                          <>
                            <ProgressiveImage
                              src={selectedProject.media[currentMediaIndex].src}
                              previewSrc={selectedProject.media[currentMediaIndex].previewSrc}
                              alt={selectedProject.title}
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 60vw"
                              className="max-h-[75vh] max-w-[90vw] w-auto h-auto rounded-2xl bg-black/10 shadow-2xl"
                              imgClassName="max-h-[75vh] max-w-[90vw] w-auto h-auto rounded-2xl bg-black/10 object-contain shadow-2xl"
                            />
                          </>
                        ) : (
                          <>
                            <video
                              key={selectedProject.media[currentMediaIndex].src}
                              src={selectedProject.media[currentMediaIndex].src}
                              controls
                              autoPlay
                              muted
                              playsInline
                              preload="metadata"
                              className="max-h-[75vh] w-auto max-w-[90vw] rounded-2xl bg-black/20 shadow-2xl"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                                const fallback = event.currentTarget.nextElementSibling as HTMLDivElement | null;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="absolute inset-0 hidden flex-col items-center justify-center gap-3 rounded-2xl bg-slate-900/80 px-6 text-center text-white">
                              <p className="text-xl font-semibold">{'Vid\u00e9o non disponible'}</p>
                              <p className="text-sm text-gray-300">
                                {'Convertissez-la en .mp4 ou .webm et r\u00e9essayez.'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedProject.media.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    <div className="mt-4 text-center text-white">
                      <span className="rounded-full bg-black/50 px-3 py-1 text-sm">
                        {currentMediaIndex + 1} / {selectedProject.media.length}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[50vh] w-full items-center justify-center rounded-2xl border border-white/5 bg-slate-900/70">
                    <div className="max-w-lg space-y-4 px-6 text-center text-white">
                      <AlertCircle className="mx-auto h-14 w-14 text-orange-400" />
                      <h4 className="text-xl font-bold">
                        {selectedProject.hasUnsupportedMedia
                          ? 'Formats de fichiers non support\u00e9s'
                          : 'Aucun m\u00e9dia disponible'}
                      </h4>
                      {selectedProject.hasUnsupportedMedia ? (
                        <>
                          <p className="text-gray-300">
                            {'Des fichiers ont \u00e9t\u00e9 trouv\u00e9s mais ne peuvent pas \u00eatre affich\u00e9s automatiquement.'}
                          </p>
                          <p className="font-medium text-orange-400">
                            Convertissez-les vers un format compatible ({selectedUnsupportedList}) puis actualisez la
                            page.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400">
                            {'Ajoutez vos images ou vid\u00e9os dans '}
                            <code className="font-mono text-sm">public/images/{selectedProject.folder}/</code>
                            {' puis lancez '}
                            <code className="font-mono text-sm">npm run manifest:local</code>
                            {' ou '}
                            <code className="font-mono text-sm">npm run media:upload</code>
                            {' pour mettre \u00e0 jour le catalogue avant de recharger la page.'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {'Formats support\u00e9s : images (tous formats Cloudinary) et vid\u00e9os (tous formats Cloudinary)'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
