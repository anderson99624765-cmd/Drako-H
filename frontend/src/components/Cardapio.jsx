import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import CardProduto from './CardProduto';
import CarrosselSecao from './CarrosselSecao';
import styles from './Cardapio.module.css';

export default function Cardapio({ onCustomizacao, onCombo }) {
  const { produtos } = useApp();
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const handler = (e) => setBusca(e.detail || '');
    window.addEventListener('drako-busca', handler);
    return () => window.removeEventListener('drako-busca', handler);
  }, []);

  // Agrupar produtos
  const destaques = [], batatas = [], combos = [], bebidas = [];
  Object.entries(produtos).forEach(([id, p]) => {
    const prod = { ...p, id };
    if (p.destaque) destaques.push(prod);
    if (p.categoria === 'batatas') batatas.push(prod);
    else if (p.categoria === 'combos') combos.push(prod);
    else if (p.categoria === 'bebidas') bebidas.push(prod);
  });

  // Filtrar por busca
  const filtrar = (lista) => {
    if (!busca.trim()) return lista;
    const t = busca.toLowerCase();
    return lista.filter(p => (p.nome || '').toLowerCase().includes(t) || (p.descricao || '').toLowerCase().includes(t));
  };

  const destFiltrados = filtrar(destaques);
  const batFiltrados  = filtrar(batatas);
  const combFiltrados = filtrar(combos);
  const bebFiltrados  = filtrar(bebidas);
  const totalVisiveis = destFiltrados.length + batFiltrados.length + combFiltrados.length + bebFiltrados.length;

  const renderCard = (prod) => (
    <CardProduto
      key={prod.id}
      produto={prod}
      onCustomizacao={() => onCustomizacao(prod)}
      onCombo={() => onCombo(prod)}
    />
  );

  if (busca && totalVisiveis === 0) {
    return (
      <div className={styles.buscaVazia}>
        <div className={styles.buscaIco}>🔍</div>
        <h3>Nenhum produto encontrado</h3>
        <p>Não encontramos nenhum item correspondente ao termo pesquisado.</p>
        <button
          className={styles.btnSecundario}
          onClick={() => window.dispatchEvent(new CustomEvent('drako-busca', { detail: '' }))}
        >
          Ver cardápio completo
        </button>
      </div>
    );
  }

  return (
    <>
      {destFiltrados.length > 0 && (
        <CarrosselSecao id="destaques" titulo="⭐ Destaques da Casa" badge={`${destFiltrados.length} item${destFiltrados.length !== 1 ? 's' : ''}`} destaque>
          {destFiltrados.map(renderCard)}
        </CarrosselSecao>
      )}

      {batFiltrados.length > 0 && (
        <CarrosselSecao id="batatas" titulo="🍟 Nossas Batatas" badge={`${batFiltrados.length} item${batFiltrados.length !== 1 ? 's' : ''}`}>
          {batFiltrados.map(renderCard)}
        </CarrosselSecao>
      )}

      {combFiltrados.length > 0 && (
        <CarrosselSecao id="combos" titulo="🍔 Combos Especiais" badge={`${combFiltrados.length} item${combFiltrados.length !== 1 ? 's' : ''}`}>
          {combFiltrados.map(renderCard)}
        </CarrosselSecao>
      )}

      {bebFiltrados.length > 0 && (
        <CarrosselSecao id="bebidas" titulo="🥤 Bebidas Geladas" badge={`${bebFiltrados.length} item${bebFiltrados.length !== 1 ? 's' : ''}`}>
          {bebFiltrados.map(renderCard)}
        </CarrosselSecao>
      )}
    </>
  );
}
