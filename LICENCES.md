# Licences et références consultées

## Dépendances directes

- **GSAP 3 et plugins** (ScrollTrigger, SplitText, Flip, ScrollToPlugin), `@gsap/react` : licence standard « No Charge » de Webflow/GSAP pour l’usage sur un site web, y compris commercial. La licence interdit les usages qui concurrencent les outils d’animation visuelle de Webflow. [Texte officiel de la licence](https://gsap.com/standard-license/).
- **React, React DOM** : MIT.
- **React Router DOM** : MIT.
- **i18next, react-i18next** : MIT.
- **Lenis** : MIT.
- **Vite, Vitest, TypeScript, Playwright, ESLint, Prettier, Testing Library, axe-core** : MIT (sauf sous-dépendances de leur propre licence ; consulter les métadonnées des paquets verrouillées dans `package-lock.json`).
- **Amiri**, **Fraunces**, **Lemonada** et **Manrope** : SIL Open Font License 1.1. Fichiers latin WOFF2 auto-hébergés ; textes de licence conservés dans `public/assets/fonts/licenses/`. Amiri sert aux titres éditoriaux ; Lemonada, une famille arabe/latine avec un dessin plus calligraphique, décore les variétés de dattes ; Manrope reste la police des textes courants. [Lemonada sur Google Fonts](https://fonts.google.com/specimen/Lemonada).

## Références GitHub consultées

Consultation à titre documentaire ; aucun code d’exemple de dépôt externe n’a été copié dans le projet.

- [greensock/GSAP](https://github.com/greensock/GSAP) et [licence standard GSAP](https://gsap.com/standard-license/) — import des plugins, usage React et licence actuelle.
- [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) — exemple officiel de synchronisation de Lenis et GSAP ; licence MIT indiquée par le dépôt.
- [vitejs/vite](https://github.com/vitejs/vite) — guide officiel GitHub Pages, configuration de `base` et fallback SPA ; licence MIT.
- [actions/deploy-pages](https://github.com/actions/deploy-pages) — action officielle de publication Pages ; licence MIT.

## Images et logos

Les images et logos embarqués ont été téléchargés depuis les URL publiques `sonedis.com/wp-content/uploads/`, puis stockés localement. Les logos de SONEDIS, marques, enseignes et certifications sont gardés dans leur format source et affichés sans déformation. Les photographies et packagings ont des dérivés WebP responsifs. L’accès public à ces fichiers ne prouve pas à lui seul les droits de réutilisation : validation SONEDIS à obtenir pour les logos tiers, voir `TODO_CONTENU.md`.

La photo de route vers la palmeraie de la section « Notre histoire » vient de l’image fournie par l’utilisateur et a été colorisée avec ImageGen en conservant la scène. Les exports WebP responsifs sont `histoire-palmeraie-480.webp`, `histoire-palmeraie-960.webp` et `histoire-palmeraie-1440.webp`.

L’illustration `public/assets/photos/ancien-biskra-*.webp` a été créée avec ImageGen pour la section « La datte, une histoire de famille ». Elle représente un personnage symbolique et anonyme, et non un membre identifié de SONEDIS. Sa représentation vestimentaire est une interprétation artistique ; sa fidélité historique ou locale n’a pas été validée par un spécialiste.

## Vidéo d'introduction

Une seule séquence est intégrée au montage muet `public/assets/video/intro-dates-14160251.mp4`. Le fichier source est mis en cache dans le dossier temporaire système `sonedis-pexels/` pour la régénération et n'est pas servi séparément.

- [Vidéo Pexels #14160251 — palmes et fruits sur ciel bleu](https://www.pexels.com/fr-fr/video/ciel-bleu-fruit-pendre-palmier-14160251/) — source vérifiée par téléchargement : H.264, 2730 × 1440, 29,97 i/s, 32 471 416 octets ; fichier source `https://videos.pexels.com/video-files/14160251/14160251-uhd_4096_2160_30fps.mp4`. Auteur non confirmé dans la page accessible.
- [Licence Pexels](https://www.pexels.com/license/) et [explication officielle de la licence](https://help.pexels.com/hc/en-us/articles/360042295174-What-is-the-license-of-the-photos-and-videos-on-Pexels) — l'usage commercial et la modification sont permis sans attribution obligatoire, sous réserve des restrictions de la licence.

Cette prise est la seule image vidéo du hero. L'URL fournie décrit un palmier et des fruits, mais ne confirme pas que la prise a été filmée à Biskra ; le site ne la présente donc pas comme une scène géolocalisée à Biskra.

## Vidéo de « Notre histoire » fournie par l'utilisateur

Le clip local fourni dans l'échange a été étalonné légèrement vers des tons plus chauds, puis recompressé en H.264 478 × 850, 29,97 i/s, 29,10 s, 6 698 898 octets. La piste audio a été supprimée ; l'export n'en contient aucune. Le poster est un WebP de 87 464 octets. Le droit de reproduction de la vidéo source n'a pas été vérifié indépendamment.
