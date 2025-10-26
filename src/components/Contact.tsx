import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Paperclip } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');

    const payload = new FormData(event.currentTarget);
    payload.set('form-name', 'devis');

    if (files) {
      payload.delete('fichiers');
      Array.from(files).forEach((file) => payload.append('fichiers', file));
    }

    try {
      const actionUrl = event.currentTarget.action || '/?no-cache=1';
      const response = await fetch(actionUrl, {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok || response.type === 'opaqueredirect' || response.status === 0) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFiles(null);
        event.currentTarget.reset();
        return;
      }

      throw new Error(`Netlify form submission failed with status ${response.status}`);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-800 md:text-5xl">
            Contactez-<span className="text-orange-500">nous</span>
          </h2>
          <p className="mx-auto text-xl text-gray-600">
            PrÃªt Ã  dÃ©marrer votre projet ? Envoyez-nous une demande de devis complÃ¨te pour un retour rapide.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-slate-800">Informations de contact</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">TÃ©lÃ©phone</h4>
                    <p className="text-gray-600">06 26 65 13 08</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Email</h4>
                    <p className="text-gray-600">entreprisemuratcelik@free.fr</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Adresse</h4>
                    <p className="text-gray-600">
                      473 Rue du chemin vert
                      <br />
                      88300 Neufchâteau, France
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Horaires</h4>
                    <p className="text-gray-600">
                      Lun-Ven : 8h - 18h
                      <br />
                      Samedi : 8h - 12h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-slate-800">Zone d&apos;intervention</h3>
              <p className="mb-4 text-gray-600">
                Nous intervenons dans un rayon de 80 km autour d&apos;Ã‰pinal et NeufchÃ¢teau pour vos travaux de
                maÃ§onnerie et gros Å“uvre.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>Ã‰pinal</div>
                <div>NeufchÃ¢teau</div>
                <div>Mirecourt</div>
                <div>Charmes</div>
                <div>Rambervillers</div>
                <div>Golbey</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-slate-800">Demander un devis</h3>
            <form
              name="devis"
              method="POST"
              action="/?no-cache=1"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="devis" />
              <p className="hidden">
                <label>
                  Ne pas remplir : <input name="bot-field" onChange={handleChange} />
                </label>
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                    TÃ©lÃ©phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                    Type de projet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">SÃ©lectionner un type</option>
                    <option value="fondations">Fondations</option>
                    <option value="murs">Murs &amp; Cloisons</option>
                    <option value="dalle">Dalle bÃ©ton</option>
                    <option value="renovation">RÃ©novation</option>
                    <option value="extension">Extension</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Description du projet *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  placeholder="DÃ©crivez votre projet en dÃ©tail : surface, matÃ©riaux souhaitÃ©s, dÃ©lais, etc."
                ></textarea>
              </div>

              <div>
                <label htmlFor="files" className="mb-2 block text-sm font-medium text-gray-700">
                  Ajouter des fichiers (plans, photos, documentsâ€¦)
                </label>
                <label
                  htmlFor="files"
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-orange-400 hover:text-orange-500"
                >
                  <span>
                    {files && files.length > 0
                      ? `${files.length} fichier${files.length > 1 ? 's' : ''} sÃ©lectionnÃ©${files.length > 1 ? 's' : ''}`
                      : 'Cliquez pour sÃ©lectionner ou glissez-dÃ©posez vos fichiers'}
                  </span>
                  <Paperclip className="h-5 w-5" />
                </label>
                <input
                  id="files"
                  name="fichiers"
                  type="file"
                  multiple
                  onChange={(event) => setFiles(event.target.files)}
                  accept=".jpg,.jpeg,.png,.heic,.heif,.pdf,.doc,.docx"
                  className="hidden"
                />
                <p className="mt-2 text-xs text-gray-500">Formats acceptÃ©s : JPG, PNG, HEIC, PDF, DOC (max 10 Mo chacun).</p>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-orange-500 py-4 px-6 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600"
              >
                <Send className="h-5 w-5" />
                <span>Envoyer la demande</span>
              </button>

              {status === 'success' && (
                <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  Merci ! Votre demande de devis a bien Ã©tÃ© envoyÃ©e. Nous revenons vers vous rapidement.
                </p>
              )}
              {status === 'error' && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  Une erreur est survenue lors de l&apos;envoi. Merci de rÃ©essayer ou de nous contacter par tÃ©lÃ©phone.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

