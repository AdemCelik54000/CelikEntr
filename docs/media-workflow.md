# Workflow médias & déploiement

Ce projet utilise maintenant un _manifest_ de médias (`src/data/media-manifest.json`).  
Le manifest est généré par script, ce qui permet de servir les images/vidéos soit
depuis `public/images`, soit depuis un CDN comme Cloudinary.  
Suivez les étapes ci-dessous avant chaque publication :

## 1. Préparer les fichiers locaux

1. Déposer les nouveaux médias dans `public/images/<categorie>/<sous-dossier>`.
2. Uniformiser les noms de fichiers (minuscules + tirets) :
   ```
   npm run slugify:media
   ```
3. Convertir les vidéos `.mov` ou `.m4v` en `.mp4` :
   ```
   npm run convert:videos
   ```

## 2. Générer le manifest

### Mode local (développement / déploiement sans CDN)

```
npm run manifest:local
```

Le manifest généré contient des URLs relatives (`/images/...`).  
Aucun changement n’est nécessaire côté code.

### Mode Cloudinary (déploiement Netlify avec gros volumes)

1. Créer un compte Cloudinary (plan gratuit).
2. Renseigner vos identifiants dans un fichier `.env` :
   ```
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
3. Uploader l’ensemble des médias vers Cloudinary **et** régénérer le manifest :
   ```
   npm run media:upload -- --folder=celik-portfolio
   ```
   - `--folder` correspond au dossier Cloudinary cible (modifiable).
   - Ajouter `--dry-run` pour tester sans uploader.
4. Le manifest contient alors des URLs Cloudinary (`https://res.cloudinary.com/...`).

> Astuce : si vous stockez des URLs relatives dans le manifest, vous pouvez définir
> `VITE_MEDIA_BASE_URL=https://votre-cdn.com` dans `.env` pour les préfixer au runtime.

## 3. Déploiement Netlify

1. Pousser le code (sans les médias lourds) sur GitHub.
2. Connecter le dépôt à Netlify :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
3. Ajouter les variables d’environnement nécessaires :
   - Cloudinary (`CLOUDINARY_*`) si l’upload se fait pendant le build.
   - `VITE_MEDIA_BASE_URL` si besoin d’un préfixe CDN.
4. Avant chaque `git push`, exécuter le workflow :
   ```
   npm run slugify:media
   npm run convert:videos
   npm run media:upload -- --folder=celik-portfolio   # ou npm run manifest:local
   git add src/data/media-manifest.json
   ```

## 4. Poids & optimisation

- Compresser les images (TinyPNG, Squoosh…) avant l’upload.
- Préférer WebP/AVIF pour réduire le poids.
- Utiliser le `loading="lazy"` déjà en place dans la modale pour les images.
- Penser à paginer ou limiter le nombre de médias affichés simultanément si besoin.

Avec cette organisation, Netlify ne manipule que le manifest JSON (quelques ko),
tandis que les médias sont servis via Cloudinary ou un autre CDN adapté.
