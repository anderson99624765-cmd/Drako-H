import { useApp } from '../context/AppContext';
import styles from './CardProduto.module.css';

export default function CardProduto({ produto, onCustomizacao, onCombo }) {
  const { getQtdProduto, alterarQtdCarrinho } = useApp();
  const qtd = getQtdProduto(produto.id);
  const precoM = parseFloat(produto.precoM) || 0;
  const precoG = parseFloat(produto.precoG) || 0;
  const fotoUrl = produto.foto || '/logo.jpeg';

  const formatarPreco = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

  // Botão de ação por categoria
  const renderAcao = () => {
    if (produto.categoria === 'batatas') {
      return (
        <button className={styles.btnAdicionar} onClick={onCustomizacao}>
          <span>+ Adicionar</span>
        </button>
      );
    }
    if (produto.categoria === 'combos') {
      return (
        <button className={styles.btnAdicionar} onClick={onCombo}>
          <span>Sabores</span>
        </button>
      );
    }
    // Bebidas: controle inline
    if (qtd > 0) {
      return (
        <div className={styles.seletor}>
          <button onClick={() => alterarQtdCarrinho(`${produto.id}-unico`, -1)}>−</button>
          <span className={styles.seletorQtd}>{qtd}</span>
          <button onClick={() => {
            // Se não existe no carrinho ainda, cria
            alterarQtdCarrinho(`${produto.id}-unico`, 1);
          }}>+</button>
        </div>
      );
    }
    return (
      <button className={styles.btnAdicionar} onClick={() => {
        // Adicionar bebida diretamente
        const chave = `${produto.id}-unico`;
        import('../context/AppContext').then(({ useApp: _ }) => {});
        // Disparo via evento para o contexto (workaround sem prop drilling)
        window.dispatchEvent(new CustomEvent('drako-add-bebida', {
          detail: { id: produto.id, nome: produto.nome, preco: precoM }
        }));
      }}>
        <span>+ Adicionar</span>
      </button>
    );
  };

  const rotuloPreco = (produto.categoria === 'batatas' && precoG > 0 && precoG !== precoM)
    ? 'A partir de' : produto.categoria === 'combos' ? 'Preço do Combo' : 'Preço Unitário';

  return (
    <div className={styles.card}>
      <div className={styles.imagemWrapper}>
        {produto.destaque && <span className={styles.badgeDestaque}>⭐ Destaque</span>}
        {qtd > 0 && <span className={styles.badgeQtd}>{qtd}</span>}
        <img
          src={fotoUrl}
          alt={produto.nome}
          loading="lazy"
          onError={(e) => { e.target.src = '/logo.jpeg'; }}
        />
      </div>
      <div className={styles.info}>
        <h3>{produto.nome}</h3>
        <p>{produto.descricao || 'Receita especial feita com ingredientes selecionados.'}</p>
      </div>
      <div className={styles.rodape}>
        <div className={styles.precoWrapper}>
          <span className={styles.precoRotulo}>{rotuloPreco}</span>
          <span className={styles.preco}>{formatarPreco(precoM)}</span>
        </div>
        {renderAcao()}
      </div>
    </div>
  );
}
