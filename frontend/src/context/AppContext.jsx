import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

const AppContext = createContext(null);

export const IDENTIDADE_PADRAO = {
  logo: '/logo.jpeg',
  corPrincipal: '#516e03',
  corEscura: '#2e5902',
  corDestaque: '#f2f2f2',
  corFundo: '#f4f5f8',
  corFonteTitulo: '#f6f4f3',
  corFonteSubtitulo: '#f6f4f3',
  corCategorias: '#516e03',
  corCategoriaAtiva: '#516e03',
  fundoCabecalho: '',
  tituloCabecalho: 'DRAKO HOUSE',
  subtituloCabecalho: 'Sua dose diária de felicidade.',
};

export function AppProvider({ children }) {
  const [produtos, setProdutos] = useState({});
  const [adicionais, setAdicionais] = useState({});
  const [lojaAberta, setLojaAberta] = useState(true);
  const [identidade, setIdentidade] = useState(IDENTIDADE_PADRAO);
  const [carrinho, setCarrinho] = useState({});

  // Listeners Firebase em tempo real
  useEffect(() => {
    const unsubs = [];

    const prodRef = ref(db, 'produtos');
    unsubs.push(onValue(prodRef, (snap) => setProdutos(snap.val() || {})));

    const addRef = ref(db, 'adicionais');
    unsubs.push(onValue(addRef, (snap) => setAdicionais(snap.val() || {})));

    const statusRef = ref(db, 'configuracoes/statusLoja');
    unsubs.push(onValue(statusRef, (snap) => setLojaAberta(snap.val() !== false)));

    const visualRef = ref(db, 'configuracoes/visual');
    unsubs.push(onValue(visualRef, (snap) => {
      if (snap.val()) setIdentidade({ ...IDENTIDADE_PADRAO, ...snap.val() });
    }));

    return () => unsubs.forEach(fn => fn());
  }, []);

  // Aplicar CSS variables quando identidade muda
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cor-principal', identidade.corPrincipal);
    root.style.setProperty('--cor-escura', identidade.corEscura);
    root.style.setProperty('--cor-destaque', identidade.corDestaque);
    root.style.setProperty('--cor-fundo', identidade.corFundo);
    root.style.setProperty('--fonte-titulo', identidade.corFonteTitulo);
    root.style.setProperty('--fonte-subtitulo', identidade.corFonteSubtitulo);
    root.style.setProperty('--cor-categorias', identidade.corCategorias);
    root.style.setProperty('--cor-categoria-ativa', identidade.corCategoriaAtiva);
  }, [identidade]);

  // Carrinho helpers
  const getQtdProduto = useCallback((idProduto) => {
    return Object.values(carrinho).reduce((sum, item) => {
      return item.idProduto === idProduto ? sum + item.qtd : sum;
    }, 0);
  }, [carrinho]);

  const totalItens = Object.values(carrinho).reduce((s, i) => s + i.qtd, 0);
  const subtotal = Object.values(carrinho).reduce((s, i) => s + i.qtd * i.preco, 0);

  const adicionarItem = useCallback((chave, item) => {
    setCarrinho(prev => {
      if (prev[chave]) {
        return { ...prev, [chave]: { ...prev[chave], qtd: prev[chave].qtd + item.qtd } };
      }
      return { ...prev, [chave]: item };
    });
  }, []);

  const alterarQtdCarrinho = useCallback((chave, delta) => {
    setCarrinho(prev => {
      const item = prev[chave];
      if (!item) return prev;
      const novaQtd = item.qtd + delta;
      if (novaQtd <= 0) {
        const { [chave]: _, ...resto } = prev;
        return resto;
      }
      return { ...prev, [chave]: { ...item, qtd: novaQtd } };
    });
  }, []);

  const limparCarrinho = useCallback(() => setCarrinho({}), []);

  return (
    <AppContext.Provider value={{
      produtos, adicionais, lojaAberta, identidade, setIdentidade,
      carrinho, totalItens, subtotal,
      getQtdProduto, adicionarItem, alterarQtdCarrinho, limparCarrinho,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
};
