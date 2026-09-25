import styles from './Modal.module.css';

export default function Modal({ titulo, onClose, children, footer, isBottomSheet = true }) {
  return (
    <div className={`${styles.overlay} ${isBottomSheet ? styles.bottomSheet : ''}`} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{titulo}</h3>
          <button className={styles.btnFechar} onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className={styles.corpo}>
          {children}
        </div>
        {footer && (
          <div className={styles.rodape}>{footer}</div>
        )}
      </div>
    </div>
  );
}
