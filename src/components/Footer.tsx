import React from 'react';
import { Instagram, Phone, Mail } from 'lucide-react';
import { CONTACT, LOGO_URL } from '../data/catalog';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const handleInstagramClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const appUrl = 'instagram://user?username=celik.batiment';
    const fallbackTimer = window.setTimeout(() => {
      window.open(CONTACT.instagram, '_blank', 'noopener,noreferrer');
    }, 900);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.location.href = appUrl;
  };

  return (
    <footer className="bg-ink pb-[calc(env(safe-area-inset-bottom)+96px)] text-white md:pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between" data-reveal="up">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white">
                <img src={LOGO_URL} alt="" className="h-10 w-10 object-contain" />
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold tracking-tight">Celik Bâtiment</span>
                <span className="block text-[14px] text-white/60">Gros œuvre &amp; Construction</span>
              </span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-white/60">
              CELIK Bâtiments (Entreprise CELIK) réalise vos projets de construction en gros œuvre depuis plus de 17
              ans, avec expertise et passion.
            </p>
          </div>

          <div className="grid gap-3 text-[15px]">
            <a href={CONTACT.phoneHref} className="flex min-h-[44px] items-center gap-3 text-white/85 hover:text-white">
              <Phone className="h-5 w-5 text-brand-light" aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex min-h-[44px] items-center gap-3 text-white/85 hover:text-white"
            >
              <Mail className="h-5 w-5 shrink-0 text-brand-light" aria-hidden="true" />
              <span>
                {CONTACT.email.split('@')[0]}
                <wbr />@{CONTACT.email.split('@')[1]}
              </span>
            </a>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer"
              onClick={handleInstagramClick}
              className="flex min-h-[44px] items-center gap-3 text-white/85 hover:text-white"
            >
              <Instagram className="h-5 w-5 text-brand-light" aria-hidden="true" />
              @celik.batiment
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-[13px] text-white/50">
          <p>
            &copy; {currentYear} Celik Bâtiment · {CONTACT.street}, {CONTACT.city}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
