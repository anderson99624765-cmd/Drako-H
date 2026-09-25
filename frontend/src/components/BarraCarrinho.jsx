import { useApp } from '../context/AppContext';
import styles from './BarraCarrinho.module.css';

export default function BarraCarrinho({ onOpen }) {
  const { totalItens, subtotal } = useApp();
  if (totalItens === 0) return null;

  return (
    <div className={styles.barra} onClick={onOpen}>
      <div className={styles.info}>
        <div className={styles.badge}>
          🛒
          <span>{totalItens}</span>
        </div>
        <div className={styles.textos}>
          <span className={styles.rotulo}>Meu Pedido</span>
          <span className={styles.valor}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      <button className={styles.btn} onClick={(e) => { e.stopPropagation(); onOpen(); }}>
        <span>Ver Sacola</span>
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  );
}
