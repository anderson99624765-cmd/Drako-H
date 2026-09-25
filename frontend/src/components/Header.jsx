import { useState } from 'react';
import { useApp } from '../context/AppContext';
import styles from './Header.module.css';

export default function Header() {
  const { identidade, lojaAberta } = useApp();
  const [busca, setBusca] = useState('');

  const headerStyle = {
    backgroundImage: identidade.fundoCabecalho ? `url(${identidade.fundoCabecalho})` : 'none',
    backgroundColor: 'var(--cor-escura)',
  };

  return (
    <header className={styles.header} style={headerStyle}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {/* Status pill */}
        <div className={`${styles.statusPill} ${!lojaAberta ? styles.fechado : ''}`}>
          <span className={`${styles.dot} ${!lojaAberta ? styles.dotFechado : ''}`} />
          <span>{lojaAberta ? 'Aberto para Pedidos' : 'Loja Fechada no Momento'}</span>
        </div>

        {/* Logo */}
        <img
          src={identidade.logo}
          alt="Logo"
          className={styles.logo}
          onError={(e) => { e.target.src = '/logo.jpeg'; }}
        />

        {/* Título */}
        <div className={styles.textoHeader}>
          <h1 style={{ color: identidade.corFonteTitulo || 'var(--fonte-titulo)' }}>
            {identidade.tituloCabecalho}
          </h1>
          <p style={{ color: identidade.corFonteSubtitulo || 'var(--fonte-subtitulo)' }}>
            {identidade.subtituloCabecalho}
          </p>
        </div>

        {/* Barra de busca */}
        <div className={styles.buscaContainer}>
          <div className={`${styles.buscaWrapper} ${busca ? styles.buscaAtiva : ''}`}>
            <span className={styles.buscaIcone}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="O que você quer pedir hoje?"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                window.dispatchEvent(new CustomEvent('drako-busca', { detail: e.target.value }));
              }}
              className={styles.buscaInput}
              autoComplete="off"
            />
            {busca && (
              <button
                className={styles.btnLimpar}
                onClick={() => {
                  setBusca('');
                  window.dispatchEvent(new CustomEvent('drako-busca', { detail: '' }));
                }}
              >✕</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
