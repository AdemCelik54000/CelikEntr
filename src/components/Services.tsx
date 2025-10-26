import React, { useMemo } from 'react';
import { Home, Hammer, Wrench, Building, Shield, Truck } from 'lucide-react';
import mediaManifest from '../data/media-manifest.json';

type ManifestMedia = {
  kind?: string;
  url?: string;
  relativePath?: string;
};

type MediaManifest = {
  entries?: Record<string, { media?: ManifestMedia[] }>;
};

const Services = () => {
  const services = [
    {
      icon: <Home className="h-12 w-12 text-orange-500" />,
      title: 'Fondations',
      description: 'Fondations béton, semelles et radiers pour des structures durables.',
    },
    {
      icon: <Building className="h-12 w-12 text-orange-500" />,
      title: 'Murs & Cloisons',
      description: 'Construction de murs porteurs, cloisons et murs de soutènement en béton ou parpaing.',
    },
    {
      icon: <Hammer className="h-12 w-12 text-orange-500" />,
      title: 'Dalle Béton',
      description: 'Coulage de dalles béton et chapes avec finitions soignées.',
    },
    {
      icon: <Wrench className="h-12 w-12 text-orange-500" />,
      title: 'Rénovation',
      description: 'Rénovation complète, extension et surélévation de bâtiments existants.',
    },
    {
      icon: <Shield className="h-12 w-12 text-orange-500" />,
      title: 'Étanchéité & Terrassement',
      description: 'Étanchéité, drainage, préparation du terrain et aménagements extérieurs.',
    },
    {
      icon: <Truck className="h-12 w-12 text-orange-500" />,
      title: 'Escaliers béton',
      description: 'Fabrication d’escaliers en béton armé sur mesure, intérieurs ou extérieurs.',
    },
  ];

  const aboutImageUrl = useMemo(() => {
    const manifest = mediaManifest as MediaManifest;
    const rootMedia = manifest.entries?.['.']?.media ?? [];
    const image =
      rootMedia.find((item) => item.relativePath === 'hero-about.png') ??
      rootMedia.find((item) => item.kind === 'image');

    if (!image?.url) {
      return '/images/hero-about.png';
    }

    if (!image.url.startsWith('https://res.cloudinary.com/')) {
      return image.url;
    }

    const match = image.url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)/);
    if (!match) {
      return image.url;
    }

    const [, prefix, rest] = match;
    if (rest.startsWith('f_') || rest.startsWith('q_') || rest.startsWith('w_')) {
      return image.url;
    }

    return `${prefix}f_auto,q_auto:good,w_1400/${rest}`;
  }, []);

  return (
    <section id="services" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
            Nos <span className="text-orange-500">Services</span>
          </h2>
          <p className="mx-auto text-xl text-gray-600">
            Des fondations à la finition, nous maîtrisons chaque étape du gros œuvre pour concrétiser vos projets de
            construction et de rénovation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110">{service.icon}</div>
              <h3 className="mb-4 text-xl font-bold text-slate-800">{service.title}</h3>
              <p className="leading-relaxed text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-white p-8 shadow-lg md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold text-slate-800">Pourquoi nous choisir ?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Expertise reconnue</h4>
                    <p className="text-gray-600">Plus de 17 ans d’expérience dans le gros œuvre.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Matériaux de qualité</h4>
                    <p className="text-gray-600">Sélection rigoureuse des meilleurs matériaux.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Respect des délais</h4>
                    <p className="text-gray-600">Livraison des chantiers selon le calendrier annoncé.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Respect de l’environnement</h4>
                    <p className="text-gray-600">Pratiques de chantier visant à limiter l’impact environnemental.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={aboutImageUrl}
                alt="Équipe Celik Bâtiment sur un chantier"
                loading="lazy"
                decoding="async"
                className="h-64 w-full object-cover md:h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
