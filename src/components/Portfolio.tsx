import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, AlertCircle, Play } from 'lucide-react';
import mediaManifest from '../data/media-manifest.json';

type MediaKind = 'image' | 'video';

interface MediaItem {
  src: string;
  previewSrc?: string;
  kind: MediaKind;
  name: string;
  extension: string;
  relativePath?: string;
  publicId?: string | null;
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
}

interface ManifestFolderEntry {
  media?: ManifestMediaItem[];
  hasUnsupportedMedia?: boolean;
  unsupportedExtensions?: string[];
}

interface MediaManifest {
  version: number;
  generatedAt: string | null;
  source: string;
  entries: Record<string, ManifestFolderEntry>;
}

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
  'gif',
  'svg',
  'heic',
  'heif',
]);
const SUPPORTED_VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'ogg']);
const PRELOAD_AHEAD = 5;

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const [remoteManifest, setRemoteManifest] = useState<MediaManifest | null>(null);

  const optimizeCloudinaryUrl = useCallback((url: string, kind: MediaKind, options: OptimizeOptions = {}) => {
    if (!url.startsWith('https://res.cloudinary.com/')) {
      return url;
    }

    const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/)(.+)/);
    if (!match) {
      return url;
    }

    const [, prefix, resourceType, rest] = match;
    const hasTransform =
      rest.startsWith('f_') || rest.startsWith('q_') || rest.startsWith('w_') || rest.startsWith('c_') || rest.startsWith('dpr_');
    if (hasTransform) {
      return url;
    }

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
      return `${prefix}${parts.join(',')}/${rest}`;
    }

    const videoParts = ['f_auto:video', quality, 'vc_auto'];
    if (width) {
      videoParts.push('c_limit');
      videoParts.push(`w_${width}`);
    }

    return `${prefix}${videoParts.join(',')}/${rest}`;
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

    const fetchManifest = async () => {
      try {
        const url = new URL('/.netlify/functions/cloudinary-media', window.location.origin);
        url.searchParams.set('base', baseFolder);

        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as MediaManifest;
        if (data && data.entries) {
          setRemoteManifest(data);
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
    () => (remoteManifest ?? (mediaManifest as MediaManifest)),
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
          });
          return;
        }

        if (kind === 'video' && SUPPORTED_VIDEO_EXTENSIONS.has(extension)) {
          folderInfo.media.push({
            src: optimizedUrl,
            previewSrc: thumbnailUrl,
            kind,
            name: item.name ?? `${extension}-video`,
            extension,
            relativePath: item.relativePath,
            publicId: item.publicId ?? null,
          });
          return;
        }

        addUnsupported();
      });

      folderInfo.media.sort((a, b) => a.name.localeCompare(b.name));
      info[folderKey] = folderInfo;
    });

    return info;
  }, [manifestData, optimizeCloudinaryUrl, resolveMediaUrl]);

  const withMediaData = (folder: string) => {
    const entry = folderMediaInfo[folder];
    if (!entry) {
      return { media: [], hasUnsupportedMedia: false, unsupportedExtensions: [] as string[] };
    }

    return {
      media: entry.media,
      hasUnsupportedMedia: entry.hasUnsupportedMedia,
      unsupportedExtensions: Array.from(entry.unsupportedExtensions).sort(),
    };
  };

  const projects: Project[] = [
    {
      id: 1,
      title: 'Fondations Fouilles',
      category: 'Fondations',
      folder: 'fondations/fondations-fouilles',
      description: 'Excavation et preparation des fouilles pour fondations',
      ...withMediaData('fondations/fondations-fouilles'),
    },
    {
      id: 2,
      title: 'Fondations Propretes',
      category: 'Fondations',
      folder: 'fondations/fondations-propretes',
      description: 'Beton de propriete pour assise des fondations',
      ...withMediaData('fondations/fondations-propretes'),
    },
    {
      id: 3,
      title: 'Fondations Semelles',
      category: 'Fondations',
      folder: 'fondations/fondations-semelles',
      description: 'Semelles filantes et isolees en beton arme',
      ...withMediaData('fondations/fondations-semelles'),
    },
    {
      id: 4,
      title: 'Fondations Plots',
      category: 'Fondations',
      folder: 'fondations/fondations-plots',
      description: 'Plots beton pour structures legeres',
      ...withMediaData('fondations/fondations-plots'),
    },
    {
      id: 5,
      title: 'Fondations Betons',
      category: 'Fondations',
      folder: 'fondations/fondations-betons',
      description: 'Coulage de beton pour fondations massives',
      ...withMediaData('fondations/fondations-betons'),
    },
    {
      id: 6,
      title: 'Fondations Radier',
      category: 'Fondations',
      folder: 'fondations/fondations-radier',
      description: 'Radier general pour terrain difficile',
      ...withMediaData('fondations/fondations-radier'),
    },
    {
      id: 7,
      title: 'Fondations Batiments',
      category: 'Fondations',
      folder: 'fondations/fondations-batiments',
      description: 'Fondations speciales pour batiments industriels',
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
        title: 'Dalle Beton Plancher',
        category: 'Dalle Beton',
        folder: 'dalle-beton/plancher',
        description: 'Realisation de dalles beton pour planchers',
        ...withMediaData('dalle-beton/plancher'),
      },
      {
        id: 10,
        title: 'Dalle Beton Sol',
        category: 'Dalle Beton',
        folder: 'dalle-beton/sol-beton',
        description: 'Preparation et coulage de sols beton',
        ...withMediaData('dalle-beton/sol-beton'),
      },
      {
        id: 11,
        title: 'Renovation',
        category: 'Renovation',
        folder: 'renovation',
        description: 'Renovation complete de batiments',
        ...withMediaData('renovation'),
      },
      {
        id: 12,
        title: 'Etancheite & Terrassement',
        category: 'Etancheite & Terrassement',
        folder: 'etancheite-terrassement',
        description: "Etancheite, drainage et terrassement pour vos projets exterieurs",
        ...withMediaData('etancheite-terrassement'),
      },
      {
        id: 13,
        title: 'Escalier Beton',
        category: 'Escalier',
        folder: 'escalier',
        description: 'Fabrication d’escaliers beton sur mesure',
        ...withMediaData('escalier'),
      },
    ];

  const categories = [
    'Tous',
    'Fondations',
    'Murs & Cloisons',
    'Dalle Beton',
    'Renovation',
    'Etancheite & Terrassement',
    'Escalier',
  ];
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredProjects =
    activeCategory === 'Tous'
      ? projects
      : projects.filter((project) => project.category === activeCategory);

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

    // Always make sure the current image is cached
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

  return (
    <section id="realisations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Nos <span className="text-orange-500">Realisations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Decouvrez quelques-uns de nos projets recents qui temoignent de notre expertise et de la
            qualite de nos realisations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const previewImage = project.media.find((item) => item.kind === 'image');
            const previewVideo = project.media.find((item) => item.kind === 'video');
            const preview = previewImage ?? previewVideo;
            const hasPreview = Boolean(preview);
            const overlayIcon = preview?.kind === 'video' ? <Play className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />;
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
                      <img
                        src={preview.previewSrc ?? preview.src}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <video
                        src={preview.src}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    )
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center text-center text-white p-6 gap-3">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      {project.hasUnsupportedMedia ? (
                        <>
                          <p className="text-sm font-semibold">Formats non supportes detectes</p>
                          <p className="text-xs text-gray-300">
                            Convertissez les fichiers {unsupportedList} en formats compatibles.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold">Ajoutez vos images ou videos</p>
                          <p className="text-xs text-gray-300">
                            Placez-les dans <span className="font-mono">public/images/{project.folder}</span>
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center space-y-2">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto">
                        {overlayIcon}
                      </div>
                      <p className="text-sm font-medium">Voir la galerie</p>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 space-y-2">
                    <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {project.category}
                    </span>
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

        {selectedProject && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeGallery();
              }
            }}
          >
            <div
              className="relative max-w-6xl max-h-full w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                <button
                  onClick={closeGallery}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="relative">
                {selectedProject.media.length > 0 ? (
                  <>
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="flex items-center justify-center max-h-[75vh] max-w-[min(90vw,1100px)]">
                        {selectedProject.media[currentMediaIndex].kind === 'image' ? (
                          <>
                            <img
                              src={selectedProject.media[currentMediaIndex].src}
                              alt={selectedProject.title}
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 60vw"
                              className="max-h-[75vh] max-w-[90vw] w-auto h-auto rounded-2xl bg-black/10 object-contain shadow-2xl"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                                const fallback = event.currentTarget.nextElementSibling as HTMLDivElement | null;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden absolute inset-0 flex-col items-center justify-center rounded-2xl bg-slate-900/80 text-white text-center gap-3 px-6">
                              <p className="text-xl font-semibold">Image non disponible</p>
                              <p className="text-sm text-gray-300">
                                Verifiez le format et l'emplacement du fichier puis reessayez.
                              </p>
                            </div>
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
                              className="max-h-[75vh] max-w-[90vw] w-auto rounded-2xl bg-black/20 shadow-2xl"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                                const fallback = event.currentTarget.nextElementSibling as HTMLDivElement | null;
                                if (fallback) {
                                  fallback.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden absolute inset-0 flex-col items-center justify-center rounded-2xl bg-slate-900/80 text-white text-center gap-3 px-6">
                              <p className="text-xl font-semibold">Video non disponible</p>
                              <p className="text-sm text-gray-300">
                                Convertissez la en .mp4 ou .webm et reessayez.
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
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    <div className="text-center text-white mt-4">
                      <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                        {currentMediaIndex + 1} / {selectedProject.media.length}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full min-h-[50vh] rounded-2xl bg-slate-900/70 border border-white/5 flex items-center justify-center">
                    <div className="text-white text-center space-y-4 px-6 max-w-lg">
                      <AlertCircle className="w-14 h-14 text-orange-400 mx-auto" />
                      <h4 className="text-xl font-bold">
                        {selectedProject.hasUnsupportedMedia
                          ? 'Formats de fichiers non supportes'
                          : 'Aucun media disponible'}
                      </h4>
                      {selectedProject.hasUnsupportedMedia ? (
                        <>
                          <p className="text-gray-300">
                            Des fichiers ont ete trouves mais ne peuvent pas etre affiches automatiquement.
                          </p>
                          <p className="text-orange-400 font-medium">
                            Convertissez-les vers un format compatible ({selectedUnsupportedList}) puis actualisez la
                            page.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400">
                            Ajoutez vos images ou videos dans <code className="font-mono text-sm">public/images/{selectedProject.folder}/</code> puis lancez{' '}
                            <code className="font-mono text-sm">npm run manifest:local</code> ou <code className="font-mono text-sm">npm run media:upload</code> pour
                            mettre a jour le catalogue avant de recharger la page.
                          </p>
                          <p className="text-gray-400 text-sm">
                            Formats supportes : images (tous formats Cloudinary) et videos (mp4, webm, ogg)
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

export default Portfolio;
