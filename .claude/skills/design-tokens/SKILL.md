---
name: design-tokens
description: Palette, typographie, espacements, contraste et génération des tokens SONEDIS.
---

# Tokens de design

- Source de la palette : logo SONEDIS, logos BILKIS/LAYA/AGRODAT et emballages téléchargés depuis l’ancien site. Les teintes sombres sont des variantes d’interface choisies pour atteindre le contraste ; les tons vifs servent surtout d’accents.
- Modifier `src/styles/tokens.css` comme source unique des couleurs, polices, échelles fluides, espacements, rayons, ombres, durées et courbes.
- Corps de texte avec Manrope ; titres éditoriaux avec Fraunces. Les deux fontes sont auto-hébergées, chargées avec `font-display: swap` et accompagnées de leur licence OFL.
- Vérifier les combinaisons de texte et de fond à 4,5:1 (texte courant) et 3:1 (grand texte et éléments d’interface), avec focus visible.
- Contrôler les tokens sur les largeurs 360, 768, 1280 et 1920 px, ainsi qu’en préférence de mouvement réduit.
