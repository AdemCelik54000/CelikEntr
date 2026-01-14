import React, { useEffect, useMemo, useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = useMemo(
    () => [
      { id: 'accueil', label: 'Accueil' },
      { id: 'services', label: 'Services / R\u00e9alisations' },
      { id: 'contact', label: 'Contact' },
    ],
    []
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = window.innerWidth < 768 ? 80 : 96;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const targetPosition = elementPosition - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        /*
          iOS safe area: padding-top paints the notch/status-bar region with the SAME background
          as the header (and it changes automatically when the header background changes).
        */
        isScrolled
          ? "bg-[var(--header-bg-scrolled)] shadow-lg backdrop-blur pt-[env(safe-area-inset-top)] before:content-[''] before:fixed before:top-0 before:left-0 before:right-0 before:z-[-1] before:h-[env(safe-area-inset-top)] before:bg-[var(--header-bg-scrolled)]"
          : "bg-[var(--header-bg-top)] backdrop-blur-md pt-[env(safe-area-inset-top)] before:content-[''] before:fixed before:top-0 before:left-0 before:right-0 before:z-[-1] before:h-[env(safe-area-inset-top)] before:bg-[var(--header-bg-top)]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        <button
          onClick={() => scrollToSection('accueil')}
          className="flex items-center space-x-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white shadow-lg shadow-orange-500/30">
            <img
              src="https://res.cloudinary.com/dq7d6rmbp/image/upload/c_crop,w_700,g_auto/v1766871018/celik-portfolio/logo.png"
              alt="Celik Bâtiment"
              className="h-9 w-9 object-contain"
            />
          </div>
          <div className="leading-tight">
            <h1 className={`text-lg font-semibold sm:text-xl ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
              Celik Bâtiment
            </h1>
            <p className={`text-xs sm:text-sm ${isScrolled ? 'text-slate-500' : 'text-slate-200'}`}>
              Gros œuvre &amp; Construction
            </p>
          </div>
        </button>

        <nav className="hidden items-center space-x-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-orange-500 ${
                isScrolled ? 'text-slate-800' : 'text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center space-x-4 lg:flex">
          <a
            href="tel:0626651308"
            className={`flex items-center space-x-2 text-sm transition-colors hover:text-orange-500 ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}
          >
            <Phone className="h-4 w-4 text-orange-500" />
            <span>06 26 65 13 08</span>
          </a>
          <a
            href="mailto:entreprisecelikbatiment@gmail.com"
            className={`flex items-center space-x-2 text-sm transition-colors hover:text-orange-500 ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}
          >
            <Mail className="h-4 w-4 text-orange-500" />
            <span>entreprisecelikbatiment@gmail.com</span>
          </a>
        </div>

        <button
          aria-label="Ouvrir le menu"
          className={`rounded-lg p-2 md:hidden ${isScrolled ? 'text-slate-800' : 'text-white'}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 md:hidden">
          <div className="rounded-2xl border border-white/40 bg-white/95 p-4 shadow-lg backdrop-blur">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full rounded-lg px-3 py-2 text-left text-base font-medium text-slate-800 transition-colors hover:bg-orange-100 hover:text-orange-600"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 space-y-2 rounded-lg bg-orange-50 p-3 text-sm text-slate-800">
              <a className="flex items-center space-x-2" href="tel:0626651308">
                <Phone className="h-4 w-4 text-orange-500" />
                <span>06 26 65 13 08</span>
              </a>
              <a className="flex items-center space-x-2 break-all" href="mailto:entreprisecelikbatiment@gmail.com">
                <Mail className="h-4 w-4 text-orange-500" />
                <span>entreprisecelikbatiment@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;



