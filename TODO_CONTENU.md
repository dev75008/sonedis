# Contenus à fournir ou valider

## Avant la mise en production définitive

- [ ] Choisir Formspree ou Web3Forms, créer le formulaire et configurer l’envoi vers `contact@sonedis.fr` ; ajouter la variable GitHub Actions correspondante (`VITE_FORM_ENDPOINT` ou `VITE_WEB3FORMS_KEY`). Le formulaire affiche un retour explicite tant qu’aucun endpoint n’est configuré.
- [ ] Confirmer si le lien WhatsApp `https://wa.me/33662999448` peut être affiché pour le numéro `+33 6.62.99.94.48`. Il est omis en attendant la confirmation.
- [ ] Fournir les mentions légales et le texte validé de la politique de confidentialité. Les routes existent et indiquent actuellement « contenu à fournir ».
- [ ] Valider les traductions anglaises ajoutées pour les pages et sections qui n’avaient pas de version anglaise publiée. Les formulations existantes de la page d’accueil anglaise ont servi de référence ; les propositions nouvelles sont dans `src/i18n/content.ts` et les pages anglaises.
- [ ] Confirmer le domaine de production. Le build actuel cible `https://dev75008.github.io/sonedis/` et ne contient pas de fichier `CNAME`.
- [ ] Confirmer que les logos de clients et de certifications peuvent être reproduits depuis les visuels déjà publiés sur l’ancien site. Leur disponibilité sur sonedis.com a été vérifiée, mais les droits individuels n’ont pas été vérifiés auprès de leurs titulaires.
- [ ] Valider l’illustration symbolique de l’ancien de Biskra et l’interprétation de sa tenue traditionnelle avant publication définitive. Elle ne représente pas une personne identifiée de SONEDIS.

## Éléments non ajoutés faute de source vérifiée

- [ ] Chiffres de production, volumes, nombre de collaborateurs, d’usines ou de clients pour toute infographie ou tout compteur.
- [ ] Références, certificats détaillés, périodes de validité ou organismes émetteurs en plus des logos et du texte présents sur l’ancien site.
- [ ] Liens sociaux vérifiés. La nouvelle navigation ne reprend pas d’URL sociale sans destination confirmée.
