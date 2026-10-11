# Rapport QA SONEDIS

Dernière vérification locale : 11 octobre 2026, changements en attente de commit et publication.

## Résultats automatisés

| Contrôle | Résultat |
| --- | --- |
| TypeScript (`tsc -b`) | Réussi |
| ESLint | Réussi |
| Vitest | 3 tests réussis |
| Playwright Chromium + WebKit | 12 assertions réussies; 2 tests de décodage/autoplay ignorés sous WebKit Windows, qui annule le chargement MP4 |
| axe WCAG 2.1 AA | Aucune violation détectée sur la page d’accueil avec `prefers-reduced-motion` |
| Build Vite | Réussi; chunks initiaux découpés par route |
| Vidéo d’introduction | H.264 High, `yuv420p`, 1920 × 1080, 24 i/s, 10,5 s, 4 657 880 octets, sans piste audio; poster WebP 1920 × 1080, 515 274 octets |
| Firefox | Non vérifié : le navigateur Playwright installé plante au démarrage (`Target crashed`) dans cet environnement Windows |

## Mesures réelles de performance

| Mesure | Mobile | Desktop | Cible du brief |
| --- | --- | --- | --- |
| LCP | Non mesuré | Non mesuré | < 2,5 s |
| CLS | Non mesuré | Non mesuré | < 0,1 |
| INP | Non mesuré | Non mesuré | < 200 ms |
| JS initial gzip | Non mesuré dans le navigateur; les fichiers JS gzip du build sont listés dans la sortie Vite | Idem | < 200 ko |

Aucun score Lighthouse n’est communiqué : il n’a pas été mesuré sur un appareil réel ni sur l’URL publiée.

## Responsive et navigateurs

- Vérifié : menu mobile et débordement horizontal à 360 px dans Chromium et WebKit.
- Vérifié : projets bureau Chromium et WebKit.
- Pas de balayage complet de toutes les largeurs jusqu’à 1920 px.
- Le test axe simule `prefers-reduced-motion`; une revue manuelle sur appareil n’a pas été faite.
- Le moteur WebKit ne remplace pas un test natif sur Safari/iOS/macOS.
- Le film utilise uniquement le clip Pexels #14160251 fourni dans l’échange, en lecture automatique, muette et en boucle, y compris avec `prefers-reduced-motion` selon la demande explicite. Son origine géographique n'est pas confirmée.

## Limites et points à valider

- Le service de formulaire et son endpoint doivent être configurés; aucun message ne sera transmis tant que `VITE_FORM_ENDPOINT` ou `VITE_WEB3FORMS_KEY` n’est pas fourni.
- Les traductions anglaises nouvelles, les pages légales et les droits de reproduction des logos tiers nécessitent la validation SONEDIS.
- Le lien WhatsApp et le domaine personnalisé restent à confirmer; GitHub Pages sert le site sous le chemin du dépôt.
