# Rapport QA SONEDIS

Dernière vérification locale : 11 octobre 2026.

## Résultats automatisés

| Contrôle                     | Résultat                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TypeScript (`tsc -b`)        | Réussi                                                                                                                                                                                                             |
| ESLint                       | Réussi                                                                                                                                                                                                             |
| Vitest                       | 3 tests réussis                                                                                                                                                                                                    |
| Playwright Chromium + WebKit | 16 tests réussis, 4 ignorés dans WebKit pour le décodage MP4; bulle centrée, lettrage Lemonada et noms décoratifs vérifiés sur desktop et à 360 px, lecture continue contrôlée aussi avec `prefers-reduced-motion` |
| axe WCAG 2.1 AA              | Aucune violation détectée sur la page d’accueil avec `prefers-reduced-motion`                                                                                                                                      |
| Build Vite                   | Réussi; chunks initiaux découpés par route                                                                                                                                                                         |
| Vidéo d’introduction         | H.264 High, `yuv420p`, 1920 × 1080, 24 i/s, 10,5 s, 4 657 880 octets, sans piste audio; poster WebP 1920 × 1080, 515 274 octets                                                                                    |
| Vidéo « Notre histoire »     | H.264, `yuv420p`, 478 × 850, 29,97 i/s, 29,10 s, 6 698 898 octets, sans piste audio; poster WebP 87 464 octets                                                                                                     |
| Photo « Notre histoire »     | Image colorisée statique, exports WebP 480/960/1440 px : 31 254 / 118 122 / 228 272 octets; Amiri chargée dans les titres                                                                                          |
| Firefox                      | Non vérifié : le navigateur Playwright installé plante au démarrage (`Target crashed`) dans cet environnement Windows                                                                                              |

## Mesures réelles de performance

| Mesure          | Mobile                                                                                       | Desktop    | Cible du brief |
| --------------- | -------------------------------------------------------------------------------------------- | ---------- | -------------- |
| LCP             | Non mesuré                                                                                   | Non mesuré | < 2,5 s        |
| CLS             | Non mesuré                                                                                   | Non mesuré | < 0,1          |
| INP             | Non mesuré                                                                                   | Non mesuré | < 200 ms       |
| JS initial gzip | Non mesuré dans le navigateur; les fichiers JS gzip du build sont listés dans la sortie Vite | Idem       | < 200 ko       |

Aucun score Lighthouse n’est communiqué : il n’a pas été mesuré sur un appareil réel ni sur l’URL publiée.

## Responsive et navigateurs

- Vérifié : menu mobile et débordement horizontal à 360 px dans Chromium et WebKit.
- Vérifié : projets bureau Chromium et WebKit.
- Pas de balayage complet de toutes les largeurs jusqu’à 1920 px.
- Le test axe simule `prefers-reduced-motion`; une revue manuelle sur appareil n’a pas été faite.
- Le moteur WebKit ne remplace pas un test natif sur Safari/iOS/macOS.
- Le film utilise uniquement le clip Pexels #14160251 fourni dans l’échange, en lecture automatique, muette et en boucle, y compris avec `prefers-reduced-motion` selon la demande explicite. Son origine géographique n'est pas confirmée.
- La photo de route et de palmeraie reste fixe. La vidéo fournie par l'utilisateur conserve son cadre vertical d'origine; elle est étalonnée, muette et tourne en boucle dès l'ouverture de la page, selon la demande explicite.
- Les titres éditoriaux utilisent Amiri, police Naskh d’inspiration calligraphique arabe ; Manrope reste utilisée pour les textes courants. Les fichiers latin WOFF2 et la licence SIL OFL 1.1 sont auto-hébergés.

## Limites et points à valider

- Le service de formulaire et son endpoint doivent être configurés; aucun message ne sera transmis tant que `VITE_FORM_ENDPOINT` ou `VITE_WEB3FORMS_KEY` n’est pas fourni.
- Les traductions anglaises nouvelles, les pages légales et les droits de reproduction des logos tiers nécessitent la validation SONEDIS.
- Le lien WhatsApp et le domaine personnalisé restent à confirmer; GitHub Pages sert le site sous le chemin du dépôt.

## Finition graphique — 26 octobre 2026

- Accueil : titre élargi (deux lignes sur la capture bureau à 1440 px), sous-titre de production lisible et navigation avec action de contact identifiable.
- Produits : photographies et packagings séparés du texte; suppression des index décoratifs sur les deux cartes. Liens de détail conservés.
- Racines : titre sur toute la largeur, portrait entier aux angles arrondis, aligné avec le début du texte. Texte factuel conservé.
- Formulaire : surface claire arrondie, coordonnées agrandies, contrôles de langue et menu d’au moins 44 px.
- Typographie commune Amiri/Manrope et tailles des titres et paragraphes de référence conservées. Petits textes portés à 13 px minimum.
- Transition de page : rendu statique si `prefers-reduced-motion: reduce`; les deux vidéos restent automatiques conformément à la demande SONEDIS.

### Preuves locales

- `npm run lint`, `npm test` (3 tests) et `npm run build` : réussis.
- Suite navigateur initiale : les 12 tests Chromium réussissent; WebKit présente trois échecs (chargement/navigation sous charge et contraste pendant la transition). Après correction du mode réduit, les trois tests concernés passent à la relance ciblée WebKit. Les résultats initiaux ne sont pas assimilés à une suite entièrement réussie.
- Inspecteur de rendu : accueil à 1440, 768 et 390 px, aucun débordement horizontal, aucune image cassée et aucune erreur console détectée. Captures de l’accueil, des produits, du portrait et du contact effectivement examinées.
- Le détecteur Impeccable signale la présence de Fraunces comme police courante dans son catalogue; elle reste un fallback existant, Amiri étant la police affichée.
- L’inspecteur de goût signale encore des choix esthétiques de l’identité demandée : palette crème, arcades, calligraphie décorative, titres sur plusieurs lignes en mobile, filets et labels. Son signal « texte recouvert » concerne les liens du menu mobile fermé, volontairement masqué. Ces alertes ne constituent pas un verdict de conformité.

### Limites

Pas de nouvelle mesure Lighthouse, de certification WCAG, ni de test sur téléphone physique ou Safari natif. Les avertissements Vite sur les chemins de polices publiques préexistent; les polices chargées sont vérifiées dans le navigateur. La configuration d’envoi du formulaire et la validation éditoriale EN/légale restent requises.

### Stabilisation du déploiement

Le premier run GitHub `40321793789` a été annulé après plus de dix minutes : ses tests n’avaient pas démarré, le runner Ubuntu 26.04 téléchargeant encore les dépendances système Playwright (185 nouveaux paquets, 142 Mo). Les jobs sont désormais fixés à `ubuntu-24.04`, plateforme déclarée officiellement prise en charge dans Playwright 1.64.0 installé. Les étapes lint, tests et build restent obligatoires.
