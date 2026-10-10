---
name: gsap-motion-system
description: Conventions d’animation du site SONEDIS avec useGSAP, ScrollTrigger, SplitText, Flip et Lenis.
---

# Système de motion SONEDIS

- Importer les plugins depuis le paquet npm public `gsap`, les enregistrer une seule fois dans `src/app/motion.ts` et employer `useGSAP` avec `scope` et `revertOnUpdate` quand un composant évolue.
- Réutiliser les durées, easings, distances et staggers du token `motion` avant de créer une nouvelle valeur.
- Animer en priorité `transform` et `opacity`. Attacher les ScrollTriggers à la portée du composant et les détruire au démontage.
- Les animations liées à la largeur ou au mouvement doivent être déclarées avec `gsap.matchMedia()` et avoir une version statique lisible sous `prefers-reduced-motion: reduce`.
- SplitText ne doit jamais être nécessaire pour comprendre un titre. Revenir à la source avec `revert()` au démontage.
- Synchroniser Lenis avec `ScrollTrigger.update()` et le ticker GSAP dans `LenisProvider`; supprimer les listeners et le ticker au nettoyage.
- Appeler `ScrollTrigger.refresh()` après les polices et les images. Éviter `will-change` permanent et vérifier le scroll clavier/tactile.
- Les nouveaux effets ne doivent pas retarder le contenu, l’envoi du formulaire ou la navigation.
