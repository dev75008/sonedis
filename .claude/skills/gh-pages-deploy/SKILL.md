---
name: gh-pages-deploy
description: Base Vite, fallback BrowserRouter et publication de SONEDIS par GitHub Pages Actions.
---

# Publication GitHub Pages

- Before every push that triggers publication, follow `.claude/skills/site-supervisor/SKILL.md` and obtain an independent approval. A green workflow alone does not authorize publication.
- After deployment, verify the changed region on the public site in a fresh, cache-busted browser context; record the rendered result.
- Le dépôt `dev75008/sonedis` utilise `base: '/sonedis/'` dans Vite et `BrowserRouter` avec `import.meta.env.BASE_URL`.
- Garder le fallback `public/404.html` synchronisé avec la base ; il mémorise le chemin puis renvoie vers l’application SPA.
- `.github/workflows/deploy.yml` doit installer avec `npm ci`, exécuter lint/tests/build, charger `dist` comme artefact Pages et déployer avec les permissions minimales `pages: write` et `id-token: write`.
- Ne créer aucun `CNAME` tant que SONEDIS n’a pas confirmé le domaine et ses réglages DNS.
- Après publication, vérifier les pages profondes, les chemins des images et le fallback directement sur l’URL Pages.
- Régler manuellement GitHub > Settings > Pages > Build and deployment > Source sur **GitHub Actions**.
