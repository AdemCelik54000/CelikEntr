import { useEffect, useState } from 'react';
import { Phone, FileText } from 'lucide-react';
import { CONTACT } from '../data/catalog';

// Sticky call / quote bar for phones, shown once the hero buttons have scrolled away.
const MobileActionBar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById('contact');
    let contactInView = false;

    const update = () => setVisible(window.scrollY > window.innerHeight * 0.75 && !contactInView);

    const observer = contact
      ? new IntersectionObserver(([entry]) => {
          contactInView = entry.isIntersecting;
          update();
        })
      : null;
    if (contact && observer) {
      observer.observe(contact);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] transition duration-300 md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="grid grid-cols-[auto_1fr] gap-2 rounded-[22px] bg-white/85 p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl">
        <a
          href={CONTACT.phoneHref}
          tabIndex={visible ? 0 : -1}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-[16px] font-semibold text-white"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
          Appeler
        </a>
        <a
          href="#contact"
          tabIndex={visible ? 0 : -1}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-brand text-[16px] font-semibold text-white"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
          Devis gratuit
        </a>
      </div>
    </div>
  );
};

export default MobileActionBar;
