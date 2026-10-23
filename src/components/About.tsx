import type { RefObject } from 'react';
import { Check } from 'lucide-react';
import { getRootImageUrl, imageSrcSet, optimizeCloudinaryUrl } from '../lib/media';
import { stagger, useCountUp } from '../lib/motion';

const ABOUT_IMAGE = getRootImageUrl('hero-about.png') || '/images/hero-about.png';

const STATS = [
  { value: 17, suffix: '+', label: "ans d'expérience" },
  { value: 500, suffix: '+', label: 'projets réalisés' },
  { value: 100, suffix: ' %', label: 'clients satisfaits' },
];

const COMMITMENTS = [
  { title: 'Expertise reconnue', text: "Plus de 17 ans d'expérience dans le gros œuvre." },
  { title: 'Matériaux de qualité', text: 'Sélection rigoureuse des meilleurs matériaux.' },
  { title: 'Respect des délais', text: 'Livraison des chantiers selon le calendrier annoncé.' },
  { title: "Respect de l'environnement", text: "Pratiques de chantier visant à limiter l'impact environnemental." },
];

const CERTIFICATIONS = ['RGE Qualibat', 'Garantie décennale', 'Assurance responsabilité', 'Artisan certifié'];

const Stat = ({ value, suffix, label }: (typeof STATS)[number]) => {
  const { ref, value: current } = useCountUp(value);

  return (
    <div className="px-2 text-center">
      <p
        ref={ref as RefObject<HTMLParagraphElement>}
        className="font-display text-2xl font-extrabold tabular-nums tracking-tight text-brand sm:text-3xl"
        aria-label={`${value}${suffix}`}
      >
        {current}
        {suffix}
      </p>
      <p className="mt-0.5 text-[12px] font-medium leading-tight text-slate-600">{label}</p>
    </div>
  );
};

const About = () => (
  <section id="entreprise" className="scroll-mt-16 overflow-hidden bg-ink py-16 text-white sm:py-24">
    <div className="mx-auto grid max-w-site gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
      <div className="relative">
        <div className="overflow-hidden rounded-3xl bg-slate-800" data-reveal="clip">
          <span className="reveal-media block">
            <img
              src={optimizeCloudinaryUrl(ABOUT_IMAGE, 'image', { width: 1200, quality: 'q_auto:good' })}
              srcSet={imageSrcSet(ABOUT_IMAGE, [640, 960, 1200])}
              sizes="(min-width: 1024px) 560px, 100vw"
              alt="Équipe Celik Bâtiment sur un chantier"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]"
            />
          </span>
        </div>
        <div
          data-reveal="up"
          style={stagger(0, 0, 450)}
          className="absolute -bottom-5 left-4 right-4 grid grid-cols-3 divide-x divide-slate-200 rounded-2xl bg-white p-4 text-ink shadow-2xl sm:left-auto sm:right-6 sm:w-[380px]"
        >
          {STATS.map((stat) => (
            <Stat key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div className="pt-8 lg:pt-0">
        <p className="section-eyebrow text-brand-light before:bg-brand-light" data-reveal="up">
          L&apos;entreprise
        </p>
        <h2
          className="mt-3 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl"
          data-reveal="blur"
          style={stagger(1)}
        >
          Un artisan, un interlocuteur, un travail bien fait.
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-white/75" data-reveal="up" style={stagger(2)}>
          CELIK Bâtiments (Entreprise CELIK) est dirigée par Murat CELIK. Depuis plus de 17 ans, nous réalisons vos
          projets de construction en gros œuvre avec expertise et passion, dans les Vosges et le Grand Est.
        </p>

        <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {COMMITMENTS.map((item, index) => (
            <li key={item.title} className="flex gap-3" data-reveal="up" style={stagger(index, 90)}>
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-bright shadow-lg shadow-brand-bright/30">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-0.5 block text-[15px] leading-snug text-white/65">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Certifications et garanties">
          {CERTIFICATIONS.map((label, index) => (
            <li
              key={label}
              data-reveal="scale"
              style={stagger(index, 70, 200)}
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/85"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default About;
