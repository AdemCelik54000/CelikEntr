import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Paperclip, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CONTACT } from '../data/catalog';
import { stagger } from '../lib/motion';

type Status = 'idle' | 'sending' | 'success' | 'error';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const PROJECT_TYPES = [
  { value: 'fondations', label: 'Fondations' },
  { value: 'murs', label: 'Murs & Cloisons' },
  { value: 'dalle', label: 'Dalle béton' },
  { value: 'renovation', label: 'Rénovation' },
  { value: 'extension', label: 'Extension' },
  { value: 'autre', label: 'Autre' },
];

const fieldClass =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-[17px] text-ink placeholder:text-slate-400 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15';
const labelClass = 'mb-1.5 block text-[15px] font-semibold text-ink';

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('sending');

    const payload = new FormData(form);
    payload.set('form-name', 'devis');

    if (files) {
      payload.delete('fichiers');
      Array.from(files).forEach((file) => payload.append('fichiers', file));
    }

    try {
      const actionUrl = form.action || '/?no-cache=1';
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok || response.type === 'opaqueredirect' || response.status === 0) {
        setStatus('success');
        setFormData(initialForm);
        setFiles(null);
        form.reset();
        return;
      }

      throw new Error(`Netlify form submission failed with status ${response.status}`);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <section id="contact" className="scroll-mt-16 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-site px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="section-eyebrow" data-reveal="up">
            Contact
          </p>
          <h2 className="section-title mt-3" data-reveal="blur" style={stagger(1)}>
            Parlons de votre projet.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-600" data-reveal="up" style={stagger(2)}>
            Envoyez-nous une demande de devis complète pour un retour rapide. Le devis est gratuit et sans engagement.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          <div className="grid content-start gap-3">
            <a
              href={CONTACT.phoneHref}
              data-reveal="left"
              className="group flex items-center gap-4 rounded-3xl bg-brand p-5 text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
            >
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-white/20 [animation-duration:2.4s]" aria-hidden="true" />
                <Phone className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[14px] font-medium text-white/80">Appelez-nous</span>
                <span className="block font-display text-2xl font-bold tracking-tight">{CONTACT.phoneDisplay}</span>
              </span>
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              data-reveal="left"
              style={stagger(1, 120)}
              className="flex items-center gap-4 rounded-3xl bg-mortar p-5 ring-1 ring-slate-200/70 transition hover:bg-slate-100"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand ring-1 ring-slate-200">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-slate-600">Écrivez-nous</span>
                <span className="block text-[16px] font-semibold text-ink">
                  {CONTACT.email.split('@')[0]}
                  <wbr />@{CONTACT.email.split('@')[1]}
                </span>
              </span>
            </a>

            <div
              data-reveal="left"
              style={stagger(2, 120)}
              className="grid gap-5 rounded-3xl bg-mortar p-5 ring-1 ring-slate-200/70 sm:grid-cols-2 lg:grid-cols-1"
            >
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand ring-1 ring-slate-200">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[14px] font-medium text-slate-600">Adresse</span>
                  <span className="block font-semibold text-ink">
                    {CONTACT.street}
                    <br />
                    {CONTACT.city}
                  </span>
                  <a
                    href={CONTACT.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block py-1 text-[15px] font-semibold text-brand underline-offset-4 hover:underline"
                  >
                    Itinéraire →
                  </a>
                </span>
              </div>
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-brand ring-1 ring-slate-200">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[14px] font-medium text-slate-600">Horaires</span>
                  <span className="block font-semibold text-ink">
                    Lun – Ven : 8h – 18h
                    <br />
                    Samedi : 8h – 12h
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div
            data-reveal="up"
            style={stagger(1, 150)}
            className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-20px_rgba(11,26,48,0.18)] ring-1 ring-slate-200 sm:p-8"
          >
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">Demander un devis</h3>
            <p className="mt-1 text-[15px] text-slate-600">Les champs marqués * sont obligatoires.</p>

            <form
              name="devis"
              method="POST"
              action="/?no-cache=1"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <input type="hidden" name="form-name" value="devis" />
              <p className="hidden">
                <label>
                  Ne pas remplir : <input name="bot-field" onChange={handleChange} />
                </label>
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </div>

              <fieldset>
                <legend className={labelClass}>Type de projet *</legend>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value={type.value}
                        checked={formData.subject === type.value}
                        onChange={handleChange}
                        required
                        className="peer sr-only"
                      />
                      <span className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 px-4 text-[15px] font-medium text-slate-700 transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Description du projet *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={fieldClass}
                  placeholder="Surface, matériaux souhaités, délais…"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="files"
                  className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-3 text-[15px] text-slate-600 transition hover:border-brand hover:text-brand"
                >
                  <Paperclip className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="font-medium">
                    {files && files.length > 0
                      ? `${files.length} fichier${files.length > 1 ? 's' : ''} sélectionné${files.length > 1 ? 's' : ''}`
                      : 'Joindre des photos ou plans (facultatif)'}
                  </span>
                </label>
                <input
                  id="files"
                  name="fichiers"
                  type="file"
                  multiple
                  onChange={(event) => setFiles(event.target.files)}
                  accept=".jpg,.jpeg,.png,.heic,.heif,.pdf,.doc,.docx"
                  className="sr-only"
                />
                <p className="mt-2 text-[13px] text-slate-500">JPG, PNG, HEIC, PDF, DOC · 10 Mo max par fichier.</p>
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-70">
                {status === 'sending' ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-5 w-5" aria-hidden="true" />
                )}
                {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </button>

              <div aria-live="polite">
                {status === 'success' && (
                  <p className="pop-in flex items-start gap-3 rounded-2xl bg-green-50 px-4 py-3.5 text-[15px] font-medium text-green-800">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    Merci ! Votre demande de devis a bien été envoyée. Nous revenons vers vous rapidement.
                  </p>
                )}
                {status === 'error' && (
                  <p className="pop-in flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3.5 text-[15px] font-medium text-red-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    L&apos;envoi n&apos;a pas abouti. Réessayez ou appelez-nous au {CONTACT.phoneDisplay}.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
