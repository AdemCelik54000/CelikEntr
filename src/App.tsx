import { useCallback, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Realisations from './components/Realisations';
import Services from './components/Services';
import About from './components/About';
import Process from './components/Process';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MobileActionBar from './components/MobileActionBar';
import Gallery, { type GallerySection } from './components/Gallery';
import { useMediaLibrary } from './lib/media';
import { useScrollReveal } from './lib/motion';
import { FINALISATIONS, type Service } from './data/catalog';

type OpenGallery = {
  title: string;
  sections: GallerySection[];
  initialIndex: number;
};

function App() {
  const library = useMediaLibrary();
  useScrollReveal();
  const [gallery, setGallery] = useState<OpenGallery | null>(null);
  const finalisations = library[FINALISATIONS.folder] ?? [];

  const openFinalisations = (index: number) =>
    setGallery({
      title: FINALISATIONS.title,
      sections: [{ label: FINALISATIONS.title, media: finalisations }],
      initialIndex: index,
    });

  const openService = (service: Service) => {
    const sections = service.projects
      .map((project) => ({ label: project.title, media: library[project.folder] ?? [] }))
      .filter((section) => section.media.length > 0);

    setGallery({
      title: service.title,
      sections: sections.length > 0 ? sections : [{ label: service.title, media: [] }],
      initialIndex: 0,
    });
  };

  const closeGallery = useCallback(() => setGallery(null), []);

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Header />
      <main>
        <Hero />
        <Realisations media={finalisations} onOpen={openFinalisations} />
        <Services library={library} onOpen={openService} />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
      {gallery && (
        <Gallery
          title={gallery.title}
          sections={gallery.sections}
          initialIndex={gallery.initialIndex}
          onClose={closeGallery}
        />
      )}
    </div>
  );
}

export default App;
