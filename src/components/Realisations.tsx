import { ArrowRight, Images } from 'lucide-react';
import type { MediaItem } from '../lib/media';
import { optimizeCloudinaryUrl } from '../lib/media';
import { FINALISATIONS } from '../data/catalog';
import { stagger } from '../lib/motion';

type Props = {
  media: MediaItem[];
  onOpen: (index: number) => void;
};

const MOBILE_COUNT = 8;
const DESKTOP_COUNT = 5;

const thumbFor = (item: MediaItem, width: number) =>
  item.kind === 'image' ? optimizeCloudinaryUrl(item.original, 'image', { width, quality: 'q_auto:good' }) : item.previewSrc;

const Realisations = ({ media, onOpen }: Props) => {
  const featured = media.slice(0, MOBILE_COUNT);

  return (
    <section id="realisations" className="scroll-mt-16 bg-mortar py-16 sm:py-24">
      <div className="mx-auto max-w-site px-4 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="section-eyebrow" data-reveal="up">
              Réalisations
            </p>
            <h2 className="section-title mt-3" data-reveal="blur" style={stagger(1)}>
              Des chantiers dont nous sommes fiers.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-slate-600" data-reveal="up" style={stagger(2)}>
              {FINALISATIONS.description}
            </p>
          </div>
          {media.length > 0 && (
            <button
              type="button"
              onClick={() => onOpen(0)}
              data-reveal="up"
              style={stagger(3)}
              className="group hidden min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition hover:bg-slate-800 md:inline-flex"
            >
              <Images className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              Voir les {media.length} photos
            </button>
          )}
        </div>
      </div>

      {featured.length === 0 ? (
        <div className="mx-auto mt-10 max-w-site px-4 sm:px-6">
          <div className="grid h-64 place-items-center rounded-3xl border border-dashed border-slate-300 text-slate-500">
            Photos bientôt disponibles
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-site md:px-6">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:grid md:h-[560px] md:grid-cols-4 md:grid-rows-2 md:gap-4 md:overflow-visible md:p-0">
            {featured.map((item, index) => (
              <li
                key={item.src}
                data-reveal="clip"
                style={stagger(index, 110)}
                className={`w-[78%] shrink-0 snap-start sm:w-[45%] md:w-auto ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${index >= DESKTOP_COUNT ? 'md:hidden' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => onOpen(index)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-200 md:aspect-auto md:h-full"
                  aria-label={`Agrandir la photo ${index + 1}`}
                >
                  <span className="reveal-media block h-full w-full">
                    <img
                      src={thumbFor(item, index === 0 ? 1100 : 700)}
                      alt={`Chantier terminé par Celik Bâtiment – photo ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </button>
              </li>
            ))}
            <li className="w-[60%] shrink-0 snap-start sm:w-[35%] md:hidden" data-reveal="scale">
              <button
                type="button"
                onClick={() => onOpen(0)}
                className="flex aspect-[4/5] w-full flex-col items-start justify-end gap-3 rounded-3xl bg-ink p-6 text-left text-white"
              >
                <Images className="h-8 w-8 text-brand-light" aria-hidden="true" />
                <span className="font-display text-2xl font-bold leading-tight">
                  Voir les {media.length} photos
                </span>
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default Realisations;
