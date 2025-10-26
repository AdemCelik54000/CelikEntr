import React from 'react';
import { ChevronDown, Award, Users, Calendar } from 'lucide-react';

const Hero = () => {
  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 md:pt-40"
    >
      <div className="absolute inset-0">
        <img
          src="/images/f4e780e3-62d9-4004-b9fe-a2c1d58bdc1d.png"
          alt="Chef de chantier devant un mur de briques avec bétonnière"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center text-white">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Celik <span className="text-orange-500">Bâtiment</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl md:text-2xl">
          Spécialistes du gros œuvre depuis plus de 17 ans
        </p>
        <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
          Fondations, murs, dalle béton, rénovation : nous donnons vie à vos projets avec expertise, accompagnement sur
          mesure et respect des délais.
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full rounded-lg bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600 hover:shadow-lg sm:w-auto"
          >
            Demander un devis
          </button>
          <button
            onClick={scrollToServices}
            className="w-full rounded-lg border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-slate-800 sm:w-auto"
          >
            Nos services
          </button>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center justify-center space-x-3 rounded-xl bg-white/10 p-4 backdrop-blur">
            <Award className="h-9 w-9 text-orange-400" />
            <div className="text-left">
              <p className="text-2xl font-bold sm:text-3xl">17+</p>
              <p className="text-xs uppercase tracking-wide text-slate-200 sm:text-sm">Années d&apos;expérience</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 rounded-xl bg-white/10 p-4 backdrop-blur">
            <Users className="h-9 w-9 text-orange-400" />
            <div className="text-left">
              <p className="text-2xl font-bold sm:text-3xl">500+</p>
              <p className="text-xs uppercase tracking-wide text-slate-200 sm:text-sm">Projets réalisés</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 rounded-xl bg-white/10 p-4 backdrop-blur">
            <Calendar className="h-9 w-9 text-orange-400" />
            <div className="text-left">
              <p className="text-2xl font-bold sm:text-3xl">100%</p>
              <p className="text-xs uppercase tracking-wide text-slate-200 sm:text-sm">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white transition-transform hover:translate-y-1"
        aria-label="Descendre vers les services"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
