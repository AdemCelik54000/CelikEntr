import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col">
        <div className="order-1 md:order-1">
          <Hero />
        </div>
        <div className="order-3 md:order-2">
          <Services />
        </div>
        <div className="order-4 md:order-4">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
