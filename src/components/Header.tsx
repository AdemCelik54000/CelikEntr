import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                Celik Batiment
              </h1>
              <p className={`text-sm ${isScrolled ? 'text-slate-600' : 'text-gray-200'}`}>
                Gros œuvre & Construction
              </p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {['accueil', 'services', 'realisations', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize font-medium transition-colors hover:text-orange-500 ${
                  isScrolled ? 'text-slate-800' : 'text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className={`w-4 h-4 ${isScrolled ? 'text-orange-500' : 'text-white'}`} />
              <span className={`text-sm ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                06 26 65 13 08
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className={`w-4 h-4 ${isScrolled ? 'text-orange-500' : 'text-white'}`} />
              <span className={`text-sm ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                Entreprisemuratcelik@free.fr
              </span>
            </div>
          </div>

          <button
            className={`md:hidden ${isScrolled ? 'text-slate-800' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4">
            <nav className="flex flex-col space-y-4">
              {['accueil', 'services', 'realisations', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="capitalize font-medium text-slate-800 hover:text-orange-500 transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;