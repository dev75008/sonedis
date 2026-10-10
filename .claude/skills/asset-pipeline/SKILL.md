---
name: asset-pipeline
description: Téléchargement, optimisation, nommage et contrôle des médias SONEDIS.
---

# Pipeline d’assets

- Ne jamais hotlinker une image dans l’interface : récupérer les originaux publiés sur `sonedis.com/wp-content/uploads/` dans `public/assets/`.
- Garder intacts les logos SONEDIS, marques, clients et certifications. Ne pas les rogner, redessiner, recolorer ou étirer.
- Convertir les photographies et packagings en WebP responsifs, avec des largeurs adaptées aux usages et `srcset`/`sizes` réalistes.
- Réserver le chargement prioritaire à l’image du hero ; charger les médias sous la ligne de flottaison en différé.
- Décrire chaque image informative par un texte alternatif FR/EN fondé sur le visuel, pas sur un bénéfice produit inventé. Une image décorative reçoit un `alt` vide.
- Vérifier les dimensions, le poids total, l’absence de fichiers cassés et les droits d’usage avant une nouvelle livraison. Consigner les originaux dans le manifeste de pipeline.
