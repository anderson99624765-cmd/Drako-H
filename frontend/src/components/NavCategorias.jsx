import { useState, useEffect, useRef } from 'react';
import styles from './NavCategorias.module.css';

const CATEGORIAS = [
  { id: 'destaques', label: '⭐ Destaques' },
  { id: 'batatas', label: '🍟 Batatas' },
  { id: 'combos', label: '🍔 Combos' },
  { id: 'bebidas', label: '🥤 Bebidas' },
];

export default function NavCategorias() {
  const [ativo, setAtivo] = useState('destaques');
  const isClickScrolling = useRef(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      const scrollPos = window.scrollY + 110;
      let current = '';
      CATEGORIAS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.style.display !== 'none' && el.offsetTop <= scrollPos) {
          current = id;
        }
      });
      if (current) setAtivo(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const irPara = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    isClickScrolling.current = true;
    setAtivo(id);
    const navH = document.querySelector('.' + styles.wrapper)?.offsetHeight || 50;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top, behavior: 'smooth' });
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => { isClickScrolling.current = false; }, 800);
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        {CATEGORIAS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.link} ${ativo === id ? styles.ativo : ''}`}
            onClick={() => irPara(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
