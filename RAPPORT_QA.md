# Rapport QA SONEDIS

Dernière vérification locale : 11 octobre 2026, changements en attente de commit et publication.

## Résultats automatisés

| Contrôle | Résultat |
| --- | --- |
| TypeScript (`tsc -b`) | Réussi |
| ESLint | Réussi |
| Vitest | 3 tests réussis |
| Playwright Chromium + WebKit | 13 tests réussis; 1 test d’autoplay Chromium ignoré sur WebKit, dont le runtime Windows annule les requêtes de décodage MP4 |
| axe WCAG 2.1 AA | Aucune violation détectée sur la page d’accueil avec `prefers-reduced-motion` |
| Build Vite | Réussi; chunks initiaux découpés par route |
| Vidéo d’introduction | H.264 High, `yuv420p`, 1280 × 720, 24 i/s, 10,5 s, 6 146 991 octets, sans piste audio; poster WebP 1280 × 720, 202 858 octets |
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
- En mode animations réduites, l’autoplay est désactivé et le poster reste affiché, sans bouton superposé.
- Chromium confirme que la vidéo commence automatiquement, boucle et reste muette. Le test axe ne détecte aucune violation sur l’accueil avec les animations réduites.
- Le film enchaîne de vraies séquences vidéo de dunes, de palmier dattier et une vue aérienne en mouvement d’une oasis. Leur provenance n’est pas vérifiée à Biskra.

## Limites et points à valider

- Le service de formulaire et son endpoint doivent être configurés; aucun message ne sera transmis tant que `VITE_FORM_ENDPOINT` ou `VITE_WEB3FORMS_KEY` n’est pas fourni.
- Les traductions anglaises nouvelles, les pages légales et les droits de reproduction des logos tiers nécessitent la validation SONEDIS.
- Le lien WhatsApp et le domaine personnalisé restent à confirmer; GitHub Pages sert le site sous le chemin du dépôt.
