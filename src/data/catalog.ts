export type Project = {
  title: string;
  folder: string;
  description: string;
};

export type Service = {
  key: string;
  title: string;
  description: string;
  projects: Project[];
};

// Folder names must match the Cloudinary folders filled from the photo panel.
export const FINALISATIONS: Project = {
  title: 'Chantiers terminés',
  folder: 'finalisations',
  description: 'Finalisation de nos projets, avec nos clients et leurs maisons achevées.',
};

export const SERVICES: Service[] = [
  {
    key: 'fondations',
    title: 'Fondations',
    description: 'Fondations béton, semelles et radiers pour des structures durables.',
    projects: [
      { title: 'Fouilles', folder: 'fondations/fondations-fouilles', description: 'Excavation et préparation des fouilles pour fondations' },
      { title: 'Béton de propreté', folder: 'fondations/fondations-propretes', description: 'Béton de propreté pour assise des fondations' },
      { title: 'Semelles', folder: 'fondations/fondations-semelles', description: 'Semelles filantes et isolées en béton armé' },
      { title: 'Plots', folder: 'fondations/fondations-plots', description: 'Plots béton pour structures légères' },
      { title: 'Béton', folder: 'fondations/fondations-betons', description: 'Coulage de béton pour fondations massives' },
      { title: 'Radier', folder: 'fondations/fondations-radier', description: 'Radier général pour terrain difficile' },
      { title: 'Bâtiments', folder: 'fondations/fondations-batiments', description: 'Fondations spéciales pour bâtiments industriels' },
    ],
  },
  {
    key: 'murs-cloisons',
    title: 'Murs & Cloisons',
    description: 'Murs porteurs, cloisons et murs de soutènement en béton ou parpaing.',
    projects: [{ title: 'Murs & Cloisons', folder: 'murs-cloisons', description: 'Construction de murs porteurs et cloisons' }],
  },
  {
    key: 'dalle-beton',
    title: 'Dalle béton',
    description: 'Coulage de dalles béton et chapes avec finitions soignées.',
    projects: [
      { title: 'Plancher', folder: 'dalle-beton/plancher', description: 'Réalisation de dalles béton pour planchers' },
      { title: 'Sol béton', folder: 'dalle-beton/sol-beton', description: 'Préparation et coulage de sols béton' },
    ],
  },
  {
    key: 'renovation',
    title: 'Rénovation',
    description: 'Rénovation complète, extension et surélévation de bâtiments existants.',
    projects: [{ title: 'Rénovation', folder: 'renovation', description: 'Rénovation complète de bâtiments' }],
  },
  {
    key: 'etancheite-terrassement',
    title: 'Étanchéité & Terrassement',
    description: 'Étanchéité, drainage, préparation du terrain et aménagements extérieurs.',
    projects: [
      {
        title: 'Étanchéité & Terrassement',
        folder: 'etancheite-terrassement',
        description: 'Étanchéité, drainage et terrassement pour vos projets extérieurs',
      },
    ],
  },
  {
    key: 'escalier',
    title: 'Escaliers béton',
    description: "Escaliers en béton armé sur mesure, intérieurs ou extérieurs.",
    projects: [{ title: 'Escaliers béton', folder: 'escalier', description: "Fabrication d'escaliers béton sur mesure" }],
  },
];

export const CONTACT = {
  phoneDisplay: '06 26 65 13 08',
  phoneHref: 'tel:+33626651308',
  email: 'entreprisecelikbatiment@gmail.com',
  street: '473 Rue du chemin vert',
  city: '88300 Neufchâteau',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=473+Rue+du+chemin+vert+88300+Neufch%C3%A2teau',
  instagram: 'https://www.instagram.com/celik.batiment/',
};

export const LOGO_URL = '/logo-celik.png';

export const AREA_TOWNS = ['Neufchâteau', 'Épinal', 'Mirecourt', 'Charmes', 'Rambervillers', 'Golbey'];
