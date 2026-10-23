import { MapPin } from 'lucide-react';
import { AREA_TOWNS } from '../data/catalog';
import { stagger } from '../lib/motion';

const STEPS = [
  {
    title: 'Vous nous contactez',
    text: 'Par téléphone ou via le formulaire, avec vos photos ou plans si vous en avez.',
  },
  {
    title: 'Devis gratuit et détaillé',
    text: 'Nous étudions votre projet et vous remettons un devis clair, poste par poste.',
  },
  {
    title: 'Réalisation du chantier',
    text: 'Travaux menés avec soin, dans le respect du calendrier annoncé.',
  },
];

const Process = () => (
  <section className="bg-mortar py-16 sm:py-24">
    <div className="mx-auto max-w-site px-4 sm:px-6">
      <div className="max-w-2xl">
        <p className="section-eyebrow" data-reveal="up">
          Comment ça se passe
        </p>
        <h2 className="section-title mt-3" data-reveal="blur" style={stagger(1)}>
          Votre projet en trois étapes.
        </h2>
      </div>

      <ol className="relative mt-10 grid gap-3 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            data-reveal="up"
            style={stagger(index, 140)}
            className="group flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-200/70 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/5 md:flex-col md:p-7"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft font-display text-lg font-extrabold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
              {index + 1}
            </span>
            <span>
              <span className="block font-display text-xl font-bold tracking-tight text-ink">{step.title}</span>
              <span className="mt-1.5 block text-[15px] leading-relaxed text-slate-600 sm:text-base">{step.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <div
        data-reveal="up"
        className="mt-12 rounded-3xl bg-white p-6 ring-1 ring-slate-200/70 sm:p-8 md:flex md:items-center md:justify-between md:gap-10"
      >
        <div className="max-w-md">
          <h3 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink">
            <MapPin className="h-5 w-5 text-brand" aria-hidden="true" />
            Zone d&apos;intervention
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600 sm:text-base">
            Nous intervenons dans les Vosges et le Grand Est, autour d&apos;Épinal, Neufchâteau et Mirecourt.
          </p>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2 md:mt-0 md:max-w-md md:justify-end">
          {AREA_TOWNS.map((town, index) => (
            <li
              key={town}
              data-reveal="scale"
              style={stagger(index, 60, 200)}
              className="rounded-full bg-mortar px-4 py-2 text-[14px] font-medium text-slate-700"
            >
              {town}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Process;
