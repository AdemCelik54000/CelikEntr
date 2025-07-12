import React from 'react';
import { ChevronDown, Award, Users, Calendar } from 'lucide-react';

const Hero = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-slate-800"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
          Celik <span className="text-orange-500">Batiment</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up animation-delay-200">
          Spécialistes du gros œuvre depuis plus de 17 ans
        </p>
        <p className="text-lg mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
          Fondations, murs, dalle béton, rénovation - Nous donnons vie à vos projets de construction avec expertise et passion
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-600">
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Demander un devis
          </button>
          <button 
            onClick={scrollToServices}
            className="border-2 border-white hover:bg-white hover:text-slate-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Nos services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up animation-delay-800">
          <div className="flex items-center justify-center space-x-3">
            <Award className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">17+</div>
              <div className="text-sm text-gray-300">Années d'expérience</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Users className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-gray-300">Projets réalisés</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-gray-300">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;