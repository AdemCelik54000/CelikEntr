import type { CSSProperties } from 'react';
import { ArrowRight, Phone, ShieldCheck, Hammer, FileCheck2, MapPin } from 'lucide-react';
import { CONTACT } from '../data/catalog';
import { getRootImageUrl, imageSrcSet, optimizeCloudinaryUrl } from '../lib/media';
import { useParallax } from '../lib/motion';

const HERO_IMAGE = getRootImageUrl() || '/images/f4e780e3-62d9-4004-b9fe-a2c1d58bdc1d.png';

const TRUST_POINTS = [
  { icon: Hammer, label: "17 ans d'expérience" },
  { icon: ShieldCheck, label: 'Garantie décennale' },
  { icon: FileCheck2, label: 'Devis gratuit' },
];

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const Hero = () => {
  const sectionRef = useParallax<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
    >
      <div className="hero-media absolute inset-0 -z-10">
        <img
          src={optimizeCloudinaryUrl(HERO_IMAGE, 'image', { width: 1800, quality: 'q_auto:good' })}
          srcSet={imageSrcSet(HERO_IMAGE, [720, 1080, 1440, 1800])}
          sizes="100vw"
          alt="Chef de chantier devant un mur de briques avec bétonnière"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-[72%_center] md:object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30 md:bg-gradient-to-r md:from-ink/95 md:via-ink/70 md:to-ink/10"
      />

      <div className="hero-content mx-auto flex w-full max-w-site flex-1 flex-col justify-end px-4 pb-10 pt-32 sm:px-6 md:justify-center md:pb-24">
        <div className="max-w-2xl">
          <p
            className="reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white/90 backdrop-blur"
            style={delay(150)}
          >
            <MapPin className="h-4 w-4 text-brand-light" aria-hidden="true" />
            Neufchâteau · Épinal · Vosges
          </p>

          <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="line-mask">
              <span style={delay(250)}>Construire solide,</span>
            </span>
            <span className="line-mask">
              <span className="text-brand-light" style={delay(380)}>
                depuis 17 ans.
              </span>
            </span>
          </h1>

          <p
            className="reveal mt-5 max-w-xl text-[17px] leading-relaxed text-white/85 sm:text-lg"
            style={delay(560)}
          >
            CELIK Bâtiments, dirigée par Murat CELIK&nbsp;: fondations, murs, dalles béton et rénovation. Un travail
            d&apos;artisan, soigné et livré dans les délais.
          </p>

          <div className="reveal mt-8 grid gap-3 sm:flex" style={delay(700)}>
            <a href="#contact" className="btn-primary group">
              Demander un devis gratuit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={CONTACT.phoneHref} className="btn-ghost-dark">
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
            {TRUST_POINTS.map(({ icon: Icon, label }, index) => (
              <li
                key={label}
                className="reveal flex items-center gap-2 text-[15px] font-medium text-white/90"
                style={delay(860 + index * 110)}
              >
                <Icon className="h-5 w-5 text-brand-light" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 hidden justify-center md:flex">
        <a href="#realisations" aria-label="Voir nos réalisations" className="reveal" style={delay(1300)}>
          <span className="flex h-12 w-7 justify-center rounded-full border-2 border-white/40 pt-2">
            <span className="h-2.5 w-1 animate-bounce rounded-full bg-white" />
          </span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
