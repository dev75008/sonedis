import { basePath } from '../utils/site'
import styles from './RootsSection.module.css'

export default function RootsSection() {
  return (
    <section className={`${styles.section} section-pad`} aria-labelledby="roots-title" id="nos-racines">
      <h2 id="roots-title" className={styles.heading}>
        Nos racines, au cœur des palmeraies.
      </h2>
      <figure className={styles.portrait}>
        <img
          src={`${basePath}/assets/photos/recolte-960.webp`}
          srcSet={`${basePath}/assets/photos/recolte-480.webp 480w, ${basePath}/assets/photos/recolte-960.webp 960w`}
          sizes="(max-width: 780px) 90vw, 42vw"
          width="960"
          height="1280"
          loading="lazy"
          decoding="async"
          alt="Un homme tenant une grappe de jeunes dattes au milieu des palmiers"
        />
        <figcaption>La terre en héritage. La passion en partage.</figcaption>
      </figure>
      <div className={styles.copy}>
        <p className={styles.lead}>
          À Tolga, El Grous et Foughala, notre histoire familiale prend racine au milieu des palmiers.
        </p>
        <p>
          Depuis plusieurs générations, nous cultivons l’art de la datte avec une même passion : prendre soin
          de la terre, transmettre les gestes et faire vivre les valeurs humaines qui nous rassemblent. Le
          respect de la nature et des traditions guide chacun de nos engagements.
        </p>
        <p>
          Cet attachement aux terroirs nous relie aussi au Maroc et à la Tunisie. Au Maroc, autour de la
          Medjool, et en Tunisie, autour de la Deglet Nour, nous tissons des partenariats solides pour
          proposer une gamme riche, fidèle à la diversité des terroirs maghrébins et aux goûts de ceux qui
          aiment les dattes.
        </p>
        <div className={styles.signature}>
          <span>AGRODAT · Biskra, Algérie</span>
          <p>
            Avec notre unité de production AGRODAT, nous maîtrisons l’ensemble de la chaîne de production, de
            la culture des palmiers à la transformation du produit fini. Une continuité entre la terre, les
            savoir-faire et le fruit que nous vous proposons.
          </p>
        </div>
      </div>
    </section>
  )
}
