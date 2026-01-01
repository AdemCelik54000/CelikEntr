import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const handleInstagramClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const appUrl = 'instagram://user?username=celik.batiment';
    const webUrl = 'https://www.instagram.com/celik.batiment/';
    const fallbackTimer = window.setTimeout(() => {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
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
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informations entreprise */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img
                src="https://res.cloudinary.com/dq7d6rmbp/image/upload/c_crop,w_700,g_auto/v1766871018/celik-portfolio/logo.png"
                alt="Celik Batiment"
                className="w-12 h-12 object-contain rounded-lg"
              />
              <div>
                <h3 className="text-xl font-bold">Celik Batiment</h3>
                <p className="text-gray-400 text-sm">Gros oeuvre & Construction</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              CELIK Batiments (Entreprise CELIK) realise vos projets de construction en gros oeuvre depuis plus de 17
              ans, avec expertise et passion.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="#"
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook size={22} />
              </a>
              <a
                href="https://www.instagram.com/celik.batiment/"
                target="_blank"
                rel="noreferrer"
                onClick={handleInstagramClick}
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xl font-bold mb-6">Certifications</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>RGE Qualibat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Garantie decennale</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Assurance responsabilite</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Artisan certifie</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Celik Batiment. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

