export type GalleryItem = { src: string; alt: string; altEn: string; width: number; height: number }

export const galleryItems: GalleryItem[] = [
  {
    src: 'distribution',
    alt: 'Présentation des produits SONEDIS dans un espace de vente',
    altEn: 'SONEDIS products displayed in a retail space',
    width: 1440,
    height: 960,
  },
  {
    src: 'presentation',
    alt: 'Visuel SONEDIS au cœur d’une palmeraie',
    altEn: 'SONEDIS display in a palm grove',
    width: 1024,
    height: 1365,
  },
  {
    src: 'vitrine',
    alt: 'Présentation de dattes et de fruits secs en magasin',
    altEn: 'Dates and dried fruit displayed in a shop',
    width: 1440,
    height: 960,
  },
  {
    src: 'palmier-dattier',
    alt: 'Dattes sur un palmier-dattier',
    altEn: 'Dates growing on a date palm',
    width: 960,
    height: 1280,
  },
  {
    src: 'palmeraie',
    alt: 'Allée entre les palmiers dans une palmeraie',
    altEn: 'Path between palm trees in a palm grove',
    width: 960,
    height: 1280,
  },
  {
    src: 'rayon-produits',
    alt: 'Gamme de dattes SONEDIS présentée en rayon',
    altEn: 'SONEDIS range of dates displayed on a shop shelf',
    width: 1440,
    height: 960,
  },
  {
    src: 'etal-dattes',
    alt: 'Dattes SONEDIS disposées sur un étal de vente',
    altEn: 'SONEDIS dates arranged on a retail display',
    width: 1440,
    height: 960,
  },
  {
    src: 'distribution-dattes',
    alt: 'Présentation de dattes dans un point de vente',
    altEn: 'Dates presented at a point of sale',
    width: 960,
    height: 1280,
  },
  {
    src: 'dattes-branchees',
    alt: 'Grappe de dattes encore attachées à leur branche',
    altEn: 'A cluster of dates still attached to its branch',
    width: 960,
    height: 1280,
  },
  {
    src: 'recolte',
    alt: 'Récolte de dattes sous les palmiers',
    altEn: 'Date harvest beneath the palm trees',
    width: 960,
    height: 1280,
  },
]

export type Product = {
  id: string
  name: string
  nameEn: string
  image: string
  alt: string
  altEn: string
  description: string
  descriptionEn: string
}

export const datesProducts: Product[] = [
  {
    id: 'deglet-nour',
    name: 'Deglet Nour',
    nameEn: 'Deglet Nour',
    image: 'DATTES-BRANCHEES-BILKIS-1KG-PREMIUM-ALGERIE',
    alt: 'Boîte de dattes Deglet Nour branchées BILKIS',
    altEn: 'Box of BILKIS Deglet Nour dates on the branch',
    description: 'Disponible en branchées et en régime, avec différentes catégories de qualité.',
    descriptionEn: 'Available on the branch or loose, in different quality grades.',
  },
  {
    id: 'medjool',
    name: 'Medjool',
    nameEn: 'Medjool',
    image: 'boite-medjoul-1kg-',
    alt: 'Boîte de dattes Medjool BILKIS',
    altEn: 'Box of BILKIS Medjool dates',
    description: 'Une variété premium, proposée en différents calibres.',
    descriptionEn: 'A premium variety offered in different sizes.',
  },
  {
    id: 'dates-diverses',
    name: 'Dattes diverses',
    nameEn: 'Other dates',
    image: 'Datte_SUKARY_bilkis_600gr',
    alt: 'Barquette de dattes Sukary BILKIS',
    altEn: 'Tray of BILKIS Sukary dates',
    description: 'Une sélection de variétés et de présentations proposées par SONEDIS.',
    descriptionEn: 'A selection of date varieties and presentations offered by SONEDIS.',
  },
  {
    id: 'pate-dattes',
    name: 'Pâte de dattes',
    nameEn: 'Date paste',
    image: 'Pate_dattes_Agrodat_1kg',
    alt: 'Pâte de dattes AGRODAT en barquette',
    altEn: 'AGRODAT date paste in a tray',
    description: 'Disponible dans deux types de packaging, dont un conditionnement sous vide.',
    descriptionEn: 'Available in two types of packaging, including a vacuum-sealed option.',
  },
]

export const driedFruitProducts: Product[] = [
  {
    id: 'amandes-emondees',
    name: 'Amandes émondées',
    nameEn: 'Blanched almonds',
    image: 'SONEDIS-ACHET-COUSSIN_AMANDE-BLANCHIE',
    alt: 'Sachet SONEDIS d’amandes blanchies',
    altEn: 'SONEDIS bag of blanched almonds',
    description: 'Des amandes débarrassées de leur peau.',
    descriptionEn: 'Almonds with their skins removed.',
  },
  {
    id: 'amandes-brutes',
    name: 'Amandes brutes',
    nameEn: 'Raw almonds',
    image: 'SONEDIS-SACHET-COUSSIN_AMANDE-DECORTIQUEE',
    alt: 'Sachet SONEDIS d’amandes décortiquées',
    altEn: 'SONEDIS bag of raw almonds',
    description: 'Des amandes entières avec leur peau naturelle.',
    descriptionEn: 'Whole almonds in their natural skins.',
  },
  {
    id: 'cacahuetes-blanchies',
    name: 'Cacahuètes blanchies',
    nameEn: 'Blanched peanuts',
    image: 'SONEDIS-_SACHET-COUSSIN_ARACHIDE-BLANCHIE',
    alt: 'Sachet SONEDIS de cacahuètes blanchies',
    altEn: 'SONEDIS bag of blanched peanuts',
    description: 'Des arachides lisses, épurées de leur peau rouge.',
    descriptionEn: 'Smooth peanuts with their red skin removed.',
  },
  {
    id: 'cacahuetes-decortiquees',
    name: 'Cacahuètes décortiquées',
    nameEn: 'Shelled peanuts',
    image: 'SONEDISSACHET-COUSSIN_ARACHIDE-ROUGE',
    alt: 'Sachet SONEDIS de cacahuètes décortiquées',
    altEn: 'SONEDIS bag of shelled peanuts',
    description: 'Des cacahuètes prêtes pour les préparations culinaires.',
    descriptionEn: 'Peanuts ready for cooking or roasting.',
  },
  {
    id: 'cacahuetes-tradition',
    name: 'Cacahuètes tradition',
    nameEn: 'Traditional peanuts',
    image: 'SACHET-COUSSIN_ARACHIDE-COQUE',
    alt: 'Sachet SONEDIS de cacahuètes tradition',
    altEn: 'SONEDIS bag of traditional peanuts',
    description: 'Des arachides avec leur fine peau brune.',
    descriptionEn: 'Peanuts with their thin brown skin.',
  },
  {
    id: 'noix',
    name: 'Cerneaux de noix',
    nameEn: 'Walnut kernels',
    image: 'Sachet_noix',
    alt: 'Sachet SONEDIS de noix',
    altEn: 'SONEDIS bag of walnuts',
    description: 'Des cerneaux au goût boisé caractéristique.',
    descriptionEn: 'Walnut kernels with a distinctive woody flavour.',
  },
  {
    id: 'pistaches',
    name: 'Pistaches',
    nameEn: 'Pistachios',
    image: 'Sachet_pistaches',
    alt: 'Sachet SONEDIS de pistaches',
    altEn: 'SONEDIS bag of pistachios',
    description: 'Des pistaches croquantes.',
    descriptionEn: 'Crunchy pistachios.',
  },
  {
    id: 'raisins-sultanine',
    name: 'Raisin sec sultanine',
    nameEn: 'Sultana raisins',
    image: 'SONEDIS_SACHET-COUSSIN_RAISIN-NOIR-JUMBO',
    alt: 'Sachet SONEDIS de raisins sultanine',
    altEn: 'SONEDIS bag of sultana raisins',
    description: 'Des fruits naturellement sucrés et moelleux.',
    descriptionEn: 'Naturally sweet and soft fruit.',
  },
  {
    id: 'raisins-golden',
    name: 'Raisins golden',
    nameEn: 'Golden raisins',
    image: 'Sachet_raisins',
    alt: 'Sachet SONEDIS de raisins golden',
    altEn: 'SONEDIS bag of golden raisins',
    description: 'Des fruits naturellement sucrés et moelleux.',
    descriptionEn: 'Naturally sweet and soft fruit.',
  },
  {
    id: 'amandes-moulues',
    name: 'Amandes moulues',
    nameEn: 'Ground almonds',
    image: 'SONEDISSACHET-COUSSIN_AMANDE-POUDRE',
    alt: 'Sachet SONEDIS d’amandes moulues',
    altEn: 'SONEDIS bag of ground almonds',
    description: 'Une mouture fine destinée aux préparations pâtissières.',
    descriptionEn: 'A fine grind for baking and pastry recipes.',
  },
]

export const galleryFile = (src: string, width: 480 | 960 | 1440 = 960) =>
  `/assets/photos/${src}-${width}.webp`
export const productFile = (src: string, width: 480 | 900 = 900) => `/assets/products/${src}-${width}.webp`
