import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  folder: string;
  description: string;
  images: string[];
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projects: Project[] = [
    // Fondations
    {
      id: 1,
      title: "Fondations Fouilles",
      category: "Fondations",
      folder: "fondations/fondations-fouilles",
      description: "Excavation et préparation des fouilles pour fondations",
      images: []
    },
    {
      id: 2,
      title: "Fondations Propretés",
      category: "Fondations",
      folder: "fondations/fondations-propretes",
      description: "Béton de propreté pour assise des fondations",
      images: []
    },
    {
      id: 3,
      title: "Fondations Semelles",
      category: "Fondations",
      folder: "fondations/fondations-semelles",
      description: "Semelles filantes et isolées en béton armé",
      images: []
    },
    {
      id: 4,
      title: "Fondations Plots",
      category: "Fondations",
      folder: "fondations/fondations-plots",
      description: "Plots béton pour structures légères",
      images: []
    },
    {
      id: 5,
      title: "Fondations Bétons",
      category: "Fondations",
      folder: "fondations/fondations-betons",
      description: "Coulage de béton pour fondations massives",
      images: []
    },
    {
      id: 6,
      title: "Fondations Radier",
      category: "Fondations",
      folder: "fondations/fondations-radier",
      description: "Radier général pour terrain difficile",
      images: []
    },
    {
      id: 7,
      title: "Fondations Bâtiments",
      category: "Fondations",
      folder: "fondations/fondations-batiments",
      description: "Fondations spéciales pour bâtiments industriels",
      images: []
    },
    // Autres catégories
    {
      id: 8,
      title: "Murs & Cloisons",
      category: "Murs & Cloisons",
      folder: "murs-cloisons",
      description: "Construction de murs porteurs et cloisons",
      images: []
    },
    {
      id: 9,
      title: "Dalle Béton",
      category: "Dalle Béton",
      folder: "dalle-beton",
      description: "Coulage de dalles béton avec finition",
      images: []
    },
    {
      id: 10,
      title: "Rénovation",
      category: "Rénovation",
      folder: "renovation",
      description: "Rénovation complète de bâtiments",
      images: []
    },
    {
      id: 11,
      title: "Étanchéité",
      category: "Étanchéité",
      folder: "etancheite",
      description: "Travaux d'étanchéité et isolation",
      images: []
    },
    {
      id: 12,
      title: "Terrassement",
      category: "Terrassement",
      folder: "terrassement",
      description: "Préparation et nivellement de terrain",
      images: []
    }
  ];

  const categories = ["Tous", "Fondations", "Murs & Cloisons", "Dalle Béton", "Rénovation", "Étanchéité", "Terrassement"];
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filteredProjects = activeCategory === "Tous" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const openGallery = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProject && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProject && selectedProject.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="realisations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Nos <span className="text-orange-500">Réalisations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez quelques-uns de nos projets récents qui témoignent de notre expertise 
            et de la qualité de nos réalisations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => openGallery(project)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg bg-gradient-to-br from-slate-700 to-slate-900">
                <div className="w-full h-64 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <div className="text-center text-white p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 text-sm">{project.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">📷</span>
                    </div>
                    <p className="text-sm">Voir la galerie</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {project.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de galerie */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full w-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                <button
                  onClick={closeGallery}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Contenu de la galerie */}
              <div className="relative">
                {selectedProject.images.length > 0 ? (
                  <>
                    {/* Image principale */}
                    <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                      <img 
                        src={`/images/${selectedProject.folder}/${selectedProject.images[currentImageIndex]}`}
                        alt={selectedProject.title}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div className="text-white text-center" style={{display: 'none'}}>
                        <p className="text-xl">Image non disponible</p>
                        <p className="text-sm text-gray-400">Ajoutez vos images dans le dossier :</p>
                        <p className="text-sm text-orange-500">public/images/{selectedProject.folder}/</p>
                      </div>
                    </div>

                    {/* Navigation */}
                    {selectedProject.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}

                    {/* Indicateur de position */}
                    <div className="text-center text-white mt-4">
                      <span className="bg-black/50 px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedProject.images.length}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Message quand aucune image */
                  <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">📁</div>
                      <h4 className="text-xl font-bold mb-2">Aucune image disponible</h4>
                      <p className="text-gray-400 mb-4">Ajoutez vos images dans le dossier :</p>
                      <p className="text-orange-500 font-mono text-sm bg-black/30 px-4 py-2 rounded">
                        public/images/{selectedProject.folder}/
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Formats supportés : .jpg, .jpeg, .png, .webp
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;