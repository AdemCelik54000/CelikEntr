import { useEffect, useRef, useState } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { CONTACT, LOGO_URL } from '../data/catalog';

const NAV_ITEMS = [
  { id: 'realisations', label: 'Réalisations' },
  { id: 'services', label: 'Services' },
  { id: 'entreprise', label: "L'entreprise" },
  { id: 'contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      }
    };
    const handleScroll = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const solid = isScrolled || isMenuOpen;

  return (
    <header
      className={`header-enter fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        solid ? 'bg-white/90 shadow-[0_1px_0_rgba(11,26,48,0.08)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <span
        ref={progressRef}
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-brand transition-opacity duration-300 ${
          solid && !isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transform: 'scaleX(0)' }}
      />
      <div className="mx-auto flex h-16 w-full max-w-site items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6">
        <a href="#accueil" className="group flex min-w-0 items-center gap-3" onClick={() => setIsMenuOpen(false)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-md ring-1 ring-black/5">
            <img src={LOGO_URL} alt="" className="h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
          </span>
          <span className="min-w-0 leading-tight">
            <span
              className={`block truncate font-display text-[17px] font-extrabold tracking-tight transition-colors ${
                solid ? 'text-ink' : 'text-white'
              }`}
            >
              Celik Bâtiment
            </span>
            <span className={`block truncate text-[12px] font-medium ${solid ? 'text-slate-600' : 'text-white/80'}`}>
              Maçonnerie · Gros œuvre
            </span>
          </span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                solid ? 'text-slate-700 hover:bg-slate-100 hover:text-ink' : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CONTACT.phoneHref}
            className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors lg:inline-flex ${
              solid ? 'text-ink hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {CONTACT.phoneDisplay}
          </a>
          <a
            href="#contact"
            className="hidden min-h-[44px] items-center gap-1.5 rounded-full bg-brand px-5 text-[15px] font-semibold text-white shadow-md shadow-brand/30 transition hover:bg-brand-dark md:inline-flex"
          >
            Devis gratuit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`grid h-11 w-11 place-items-center rounded-full transition-colors md:hidden ${
              solid ? 'bg-slate-100 text-ink' : 'bg-white/15 text-white backdrop-blur'
            }`}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="h-[calc(100dvh-4rem-env(safe-area-inset-top))] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-2 md:hidden"
        >
          <nav aria-label="Menu mobile" className="flex flex-col">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${60 + index * 60}ms` }}
                className="reveal flex min-h-[60px] items-center justify-between border-b border-slate-100 font-display text-2xl font-bold tracking-tight text-ink"
              >
                {item.label}
                <ArrowRight className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="reveal mt-8 grid gap-3" style={{ animationDelay: '320ms' }}>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full">
              Demander un devis gratuit
            </a>
            <a href={CONTACT.phoneHref} className="btn w-full bg-slate-100 text-ink">
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
