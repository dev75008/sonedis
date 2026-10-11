# Licences et références consultées

## Dépendances directes

- **GSAP 3 et plugins** (ScrollTrigger, SplitText, Flip, ScrollToPlugin), `@gsap/react` : licence standard « No Charge » de Webflow/GSAP pour l’usage sur un site web, y compris commercial. La licence interdit les usages qui concurrencent les outils d’animation visuelle de Webflow. [Texte officiel de la licence](https://gsap.com/standard-license/).
- **React, React DOM** : MIT.
- **React Router DOM** : MIT.
- **i18next, react-i18next** : MIT.
- **Lenis** : MIT.
- **Vite, Vitest, TypeScript, Playwright, ESLint, Prettier, Testing Library, axe-core** : MIT (sauf sous-dépendances de leur propre licence ; consulter les métadonnées des paquets verrouillées dans `package-lock.json`).
- **Fraunces** et **Manrope** : SIL Open Font License 1.1. Fichiers latin WOFF2 auto-hébergés ; textes de licence conservés dans `public/assets/fonts/licenses/`.

## Références GitHub consultées

Consultation à titre documentaire ; aucun code d’exemple de dépôt externe n’a été copié dans le projet.

- [greensock/GSAP](https://github.com/greensock/GSAP) et [licence standard GSAP](https://gsap.com/standard-license/) — import des plugins, usage React et licence actuelle.
- [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — exemple officiel de synchronisation de Lenis et GSAP ; licence MIT indiquée par le dépôt.
- [vitejs/vite](https://github.com/vitejs/vite) — guide officiel GitHub Pages, configuration de `base` et fallback SPA ; licence MIT.
- [actions/deploy-pages](https://github.com/actions/deploy-pages) — action officielle de publication Pages ; licence MIT.

## Images et logos

Les images et logos embarqués ont été téléchargés depuis les URL publiques `sonedis.com/wp-content/uploads/`, puis stockés localement. Les logos de SONEDIS, marques, enseignes et certifications sont gardés dans leur format source et affichés sans déformation. Les photographies et packagings ont des dérivés WebP responsifs. L’accès public à ces fichiers ne prouve pas à lui seul les droits de réutilisation : validation SONEDIS à obtenir pour les logos tiers, voir `TODO_CONTENU.md`.

## Vidéo d'introduction

Trois séquences stock sont intégrées au montage muet `public/assets/video/intro-biskra.mp4`. Elles sont mises en cache dans le dossier temporaire système `sonedis-pexels/` pour la régénération et ne sont pas servies séparément par le site.

- [Sand dunes in the desert in the wind — Pexels #27721174](https://www.pexels.com/video/sand-dunes-in-the-desert-in-the-wind-27721174/) — source MP4: `https://videos.pexels.com/video-files/27721174/12210758_3840_2160_30fps.mp4`.
- [Close up of a Date Palm Tree — Pexels #14158721](https://www.pexels.com/video/close-up-of-a-date-palm-tree-14158721/) — source MP4: `https://videos.pexels.com/video-files/14158721/14158721-uhd_4096_2160_30fps.mp4`.
- [Oasis aerial view — Pexels #17629832](https://www.pexels.com/video/oasis-aerial-view-17629832/) — So Kenobi; source 3840 × 2160, 59.94 i/s, source MP4: `https://videos.pexels.com/video-files/17629832/17629832-uhd_3840_2160_60fps.mp4`.
- [Licence vidéo et photo gratuite Pexels](https://www.pexels.com/license/) — la licence consultée autorise le téléchargement, la modification et l'utilisation sur un site web, sans attribution obligatoire. Elle interdit notamment la revente de copies non modifiées et toute fausse approbation par les personnes ou marques visibles.

Les trois clips sont des plans stock sans provenance vérifiée à Biskra ; le site ne les présente pas comme des images de Biskra. Le troisième plan montre une oasis aérienne et remplace la précédente photo fixe de palmeraie. Crédits auteurs indiqués ici à titre de traçabilité, même si la licence Pexels ne l'exige pas.
