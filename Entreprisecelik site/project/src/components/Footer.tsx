import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Informations entreprise */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Celik Batiment</h3>
                <p className="text-gray-400 text-sm">Gros œuvre & Construction</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Spécialistes du gros œuvre depuis plus de 15 ans, nous réalisons tous vos projets 
              de construction avec expertise et passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Nos Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Fondations béton</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Murs & Cloisons</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Dalle béton</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Rénovation</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Extension</li>
              <li className="hover:text-orange-500 transition-colors cursor-pointer">Terrassement</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-orange-500" />
                <span>06 26 65 13 08</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-500" />
                <span>Entreprisemuratcelik@free.fr</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-orange-500 mt-1" />
                <span>000 Rue des Bâtisseurs<br />00000 Paris, France</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock size={18} className="text-orange-500 mt-1" />
                <span>Lun-Ven: 0h-00h<br />Sam: 0h-00h</span>
              </div>
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
                <span>Garantie décennale</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Assurance responsabilité</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Artisan certifié</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Devis gratuit</p>
              <p className="text-orange-500 font-semibold">06 26 65 13 08</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Celik Batiment. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;