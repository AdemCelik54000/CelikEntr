import { ArrowUpRight, Images } from 'lucide-react';
import type { MediaItem } from '../lib/media';
import { optimizeCloudinaryUrl } from '../lib/media';
import type { Service } from '../data/catalog';
import { SERVICES } from '../data/catalog';
import { stagger } from '../lib/motion';

type Props = {
  library: Record<string, MediaItem[]>;
  onOpen: (service: Service) => void;
};

const coverFor = (service: Service, library: Record<string, MediaItem[]>) => {
  for (const project of service.projects) {
    const image = library[project.folder]?.find((item) => item.kind === 'image');
    if (image) {
      return optimizeCloudinaryUrl(image.original, 'image', { width: 800, quality: 'q_auto:good' });
    }
  }
  return null;
};

const countFor = (service: Service, library: Record<string, MediaItem[]>) =>
  service.projects.reduce((total, project) => total + (library[project.folder]?.length ?? 0), 0);

const Services = ({ library, onOpen }: Props) => (
  <section id="services" className="scroll-mt-16 bg-white py-16 sm:py-24">
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="max-w-2xl">
        <p className="section-eyebrow" data-reveal="up">
          Nos savoir-faire
        </p>
        <h2 className="section-title mt-3" data-reveal="blur" style={stagger(1)}>
          Tout le gros œuvre, par un seul artisan.
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-slate-600" data-reveal="up" style={stagger(2)}>
          Des fondations à la finition, nous maîtrisons chaque étape pour concrétiser vos projets de construction et de
          rénovation. Choisissez un métier pour voir nos chantiers en photos.
        </p>
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {SERVICES.map((service, index) => {
          const cover = coverFor(service, library);
          const count = countFor(service, library);

          return (
            <li key={service.key} data-reveal="up" style={stagger(index % 3, 110)}>
              <button
                type="button"
                onClick={() => onOpen(service)}
                className="group flex w-full items-stretch gap-4 rounded-3xl bg-mortar p-2.5 text-left ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-slate-900/10 hover:ring-slate-200 active:scale-[0.99] sm:flex-col sm:gap-0 sm:p-0"
              >
                <span className="relative block h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-200 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-b-none sm:rounded-t-3xl">
                  {cover && (
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden';
                      }}
                      className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.08]"
                    />
                  )}
                  {count > 0 && (
                    <span className="absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[13px] font-medium text-white backdrop-blur sm:inline-flex">
                      <Images className="h-4 w-4" aria-hidden="true" />
                      {count} photos
                    </span>
                  )}
                </span>

                <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2 sm:p-6">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-xl font-bold leading-tight tracking-tight text-ink sm:text-2xl">
                      {service.title}
                    </span>
                    <ArrowUpRight
                      className="mt-0.5 hidden h-6 w-6 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand sm:block"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1.5 text-[15px] leading-snug text-slate-600 sm:mt-2 sm:text-base">
                    {service.description}
                  </span>
                  {count > 0 && (
                    <span className="mt-2 text-[14px] font-semibold text-brand sm:hidden">
                      Voir {count} photos →
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default Services;
