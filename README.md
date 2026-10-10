# SONEDIS — site vitrine

Refonte du site SONEDIS : producteur de dattes depuis 1965. Le projet est une SPA React générée par Vite et publiée sur GitHub Pages.

## Pré-requis

- Node.js 22 ou plus récent
- npm 10 ou plus récent
- Git

## Installation et commandes

```powershell
npm ci
npm run dev
```

| Commande               | Utilité                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Serveur de développement Vite                               |
| `npm run lint`         | ESLint                                                      |
| `npm test`             | Tests unitaires Vitest                                      |
| `npm run test:e2e`     | Tests de fumée Playwright et contrôle axe                   |
| `npm run build`        | Vérification TypeScript et build de production dans `dist/` |
| `npm run preview`      | Prévisualisation du build                                   |
| `npm run format:check` | Vérification Prettier                                       |

## Contenu et langues

- Français par défaut ; l’anglais reprend les traductions déjà publiées sur l’accueil du site d’origine quand elles existent.
- Les textes anglais nouveaux sont des propositions à valider. Leur inventaire et les éléments éditoriaux à fournir sont listés dans [`TODO_CONTENU.md`](TODO_CONTENU.md).
- Les informations produit, photos, logos et certifications proviennent des pages SONEDIS et des fichiers publics `sonedis.com/wp-content/uploads/` consultés pour l’audit.
- Les médias sont servis localement depuis `public/assets/` : les dix photos de galerie et les photographies produit disposent de WebP responsifs ; les logos et badges sources gardent leurs proportions.
- Les mentions légales et la politique de confidentialité sont en attente des textes SONEDIS.

## Formulaire de contact

GitHub Pages n’exécute pas de serveur. Le formulaire réalise la validation client, comporte un honeypot et attend une configuration tierce.

Choisir **un** service et configurer son destinataire `contact@sonedis.fr` dans le tableau de bord du service :

- **Formspree** : `VITE_FORM_ENDPOINT=https://formspree.io/f/<identifiant>`
- **Web3Forms** : `VITE_WEB3FORMS_KEY=<clé d’accès du formulaire>`

En local, copier `.env.example` vers `.env.local` et remplir uniquement la variable du fournisseur retenu. Dans GitHub, ajouter cette variable dans **Settings > Secrets and variables > Actions**. Le workflow les lit au build ; aucune clé n’est versionnée. Si aucune variable n’est définie, le formulaire le dit clairement et invite à écrire à `contact@sonedis.fr`.

## Publication GitHub Pages

Le dépôt est `dev75008/sonedis`. Vite utilise `base: '/sonedis/'` et React Router un fallback SPA via `public/404.html`. Le workflow `.github/workflows/deploy.yml` exécute `npm ci`, lint, tests, build puis publie `dist` avec GitHub Pages Actions.

Dans GitHub, régler une fois :

1. **Settings > Pages**
2. **Build and deployment > Source > GitHub Actions**

L’adresse actuelle prévue est `https://dev75008.github.io/sonedis/`. Aucun fichier `CNAME` n’est ajouté tant qu’un domaine de production n’a pas été confirmé.

## Qualité et performance

Exécuter `npm run lint`, `npm test`, `npm run test:e2e` et `npm run build`. Les cibles du brief sont LCP < 2,5 s, CLS < 0,1, INP < 200 ms et JavaScript initial < 200 ko gzip. Les mesures réelles et la couverture navigateur sont consignées dans [`RAPPORT_QA.md`](RAPPORT_QA.md) après exécution ; les cibles ne sont pas présentées comme des résultats.

Les préférences `prefers-reduced-motion`, le clavier, le focus visible, les labels du formulaire et les textes alternatifs FR/EN sont pris en charge. Aucun tracker ni cookie analytique n’est ajouté.

## Skills du dépôt et licences

Les cinq guides demandés sont dans `.claude/skills/` : `gsap-motion-system`, `asset-pipeline`, `design-tokens`, `gh-pages-deploy` et `qa-gate`.

GSAP et ses plugins utilisent la licence « No Charge » actuelle de Webflow/GSAP ; Fraunces et Manrope sont sous SIL Open Font License et auto-hébergées. La liste des références GitHub consultées et les réserves sur les licences d’images tierces figurent dans [`LICENCES.md`](LICENCES.md).
