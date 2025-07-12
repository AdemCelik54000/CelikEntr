import React from 'react';
import { Home, Hammer, Wrench, Building, Shield, Truck } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Home className="w-12 h-12 text-orange-500" />,
      title: "Fondations",
      description: "Fondations béton, semelles, radiers pour une base solide et durable de votre construction."
    },
    {
      icon: <Building className="w-12 h-12 text-orange-500" />,
      title: "Murs & Cloisons",
      description: "Construction de murs porteurs, cloisons, murs de soutènement en béton, parpaing ou pierre."
    },
    {
      icon: <Hammer className="w-12 h-12 text-orange-500" />,
      title: "Dalle Béton",
      description: "Coulage de dalles béton, chapes, terrasses avec finition lisse ou décorative."
    },
    {
      icon: <Wrench className="w-12 h-12 text-orange-500" />,
      title: "Rénovation",
      description: "Rénovation complète, extension, surélévation de bâtiments existants."
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-500" />,
      title: "Étanchéité",
      description: "Travaux d'étanchéité, isolation, traitement de l'humidité pour votre confort."
    },
    {
      icon: <Truck className="w-12 h-12 text-orange-500" />,
      title: "Terrassement",
      description: "Préparation du terrain, terrassement, évacuation des terres et aménagements."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Nos <span className="text-orange-500">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des fondations à la finition, nous maîtrisons tous les aspects du gros œuvre 
            pour concrétiser vos projets de construction et de rénovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-slate-800 mb-6">
                Pourquoi nous choisir ?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Expertise reconnue</h4>
                    <p className="text-gray-600">Plus de 00 ans d'expérience dans le gros œuvre</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Matériaux de qualité</h4>
                    <p className="text-gray-600">Sélection rigoureuse des meilleurs matériaux</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Respect des délais</h4>
                    <p className="text-gray-600">Livraison dans les temps convenus</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Garantie décennale</h4>
                    <p className="text-gray-600">Tous nos travaux sont garantis</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full h-64 bg-black rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white text-xl font-bold">Image à remplacer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;