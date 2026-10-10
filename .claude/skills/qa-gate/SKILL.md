---
name: qa-gate
description: Contrôles de livraison, accessibilité, responsive, mouvement réduit et performances SONEDIS.
---

# QA gate

- Avant livraison, exécuter `npm run lint`, `npm test`, `npm run test:e2e` et `npm run build`.
- Les tests de navigateur couvrent navigation, FR/EN, validation du formulaire, clavier/menu mobile et axe WCAG.
- Mesurer Lighthouse mobile et desktop sur la version construite. Rapporter les valeurs mesurées de LCP, CLS, INP et poids JS gzip ; ne pas confondre cible et mesure.
- Vérifier les modes `prefers-reduced-motion`, clavier, focus, alt FR/EN, formulaire endpoint absent/présent, et tailles 360–1920 px.
- Essayer Chrome, Firefox et Safari lorsque les navigateurs et l’environnement le permettent ; sinon noter la couverture réelle.
- Comparer les budgets du brief (LCP < 2,5 s, CLS < 0,1, INP < 200 ms, JS initial < 200 ko gzip) aux résultats sans les présenter comme acquis.
