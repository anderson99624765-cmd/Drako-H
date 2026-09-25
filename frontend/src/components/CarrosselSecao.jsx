import { useRef } from 'react';
import styles from './CarrosselSecao.module.css';

export default function CarrosselSecao({ id, titulo, badge, destaque, children }) {
  const listaRef = useRef(null);

  const rolar = (dir) => {
    if (!listaRef.current) return;
    listaRef.current.scrollBy({ left: 390 * dir, behavior: 'smooth' });
  };

  return (
    <section id={id} className={styles.secao}>
      <div className={styles.cabecalho}>
        <h2 className={`${styles.titulo} ${destaque ? styles.tituloDestaque : ''}`}>{titulo}</h2>
        <span className={styles.badge}>{badge}</span>
      </div>
      <div className={styles.carrosselWrapper}>
        <button className={`${styles.btnNav} ${styles.prev}`} onClick={() => rolar(-1)} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className={styles.lista} ref={listaRef}>
          {children}
        </div>
        <button className={`${styles.btnNav} ${styles.next}`} onClick={() => rolar(1)} aria-label="Próximo">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
