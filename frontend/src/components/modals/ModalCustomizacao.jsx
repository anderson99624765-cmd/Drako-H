import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import styles from './ModalCustomizacao.module.css';

export default function ModalCustomizacao({ produto, onClose }) {
  const { adicionais, adicionarItem } = useApp();
  const [tamanho, setTamanho] = useState('M');
  const [adicionaisSel, setAdicionaisSel] = useState([]);
  const [obs, setObs] = useState('');
  const [qtd, setQtd] = useState(1);

  const precoM = parseFloat(produto.precoM) || 0;
  const precoG = parseFloat(produto.precoG) || 0;
  const temTamanhos = produto.categoria === 'batatas' && precoG > 0 && precoG !== precoM;
  const temAdicionais = produto.categoria === 'batatas' && Object.keys(adicionais).length > 0;

  const precoBase = tamanho === 'G' && precoG ? precoG : precoM;
  const somaAdicionais = adicionaisSel.reduce((s, a) => s + a.preco, 0);
  const total = (precoBase + somaAdicionais) * qtd;

  const toggleAdicional = (id, nome, preco) => {
    setAdicionaisSel(prev => {
      const existe = prev.find(a => a.id === id);
      return existe ? prev.filter(a => a.id !== id) : [...prev, { id, nome, preco }];
    });
  };

  const confirmar = () => {
    const keyAdd = adicionaisSel.map(a => a.id).sort().join('_');
    const hashObs = obs ? '_' + obs.replace(/[^a-zA-Z0-9]/g, '') : '';
    const chave = `${produto.id}-${tamanho}${keyAdd ? '-' + keyAdd : ''}${hashObs}`;
    const nome = (temTamanhos && precoG) ? `${produto.nome} (${tamanho})` : produto.nome;

    adicionarItem(chave, {
      idProduto: produto.id,
      nome, tamanho,
      precoBase, adicionais: [...adicionaisSel],
      observacao: obs,
      preco: precoBase + somaAdicionais,
      qtd,
    });
    onClose();
  };

  const footer = (
    <div className={styles.rodapeAcoes}>
      <div className={styles.qtdControl}>
        <button onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
        <span className={styles.qtdNum}>{qtd}</span>
        <button onClick={() => setQtd(q => q + 1)}>+</button>
      </div>
      <button className={styles.btnConfirmar} onClick={confirmar}>
        <span>Adicionar ao Pedido</span>
        <span>R$ {total.toFixed(2).replace('.', ',')}</span>
      </button>
    </div>
  );

  return (
    <Modal titulo="Personalizar Produto" onClose={onClose} footer={footer}>
      <img src={produto.foto || '/logo.jpeg'} alt={produto.nome} className={styles.banner} onError={(e) => { e.target.src='/logo.jpeg'; }} />
      <h2 className={styles.nome}>{produto.nome}</h2>
      <p className={styles.desc}>{produto.descricao}</p>

      {temTamanhos && (
        <div>
          <div className={styles.secTitulo}><span>Escolha o Tamanho</span><span className={styles.tag}>Obrigatório</span></div>
          <div className={styles.tamanhosGrid}>
            {[{key:'M', preco: precoM}, {key:'G', preco: precoG}].map(({key, preco}) => (
              <div
                key={key}
                className={`${styles.tamanhoCard} ${tamanho === key ? styles.selecionado : ''}`}
                onClick={() => setTamanho(key)}
              >
                <input type="radio" name="tamanho" value={key} checked={tamanho===key} onChange={() => setTamanho(key)} />
                <span className={styles.tamanhoNome}>Tamanho {key}</span>
                <span className={styles.tamanhoPreco}>R$ {preco.toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {temAdicionais && (
        <div>
          <div className={styles.secTitulo}><span>Adicionais Especiais</span><span className={styles.tag}>Opcional</span></div>
          <div className={styles.adicionaisLista}>
            {Object.entries(adicionais).map(([id, add]) => {
              const sel = adicionaisSel.some(a => a.id === id);
              return (
                <label key={id} className={`${styles.adicionalItem} ${sel ? styles.ativo : ''}`}>
                  <div className={styles.adicionalInfo}>
                    <input type="checkbox" checked={sel} onChange={() => toggleAdicional(id, add.nome, parseFloat(add.preco))} />
                    <span className={styles.adicionalNome}>{add.nome}</span>
                  </div>
                  <span className={styles.adicionalPreco}>+ R$ {parseFloat(add.preco).toFixed(2).replace('.', ',')}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <div className={styles.secTitulo}><span>Alguma observação?</span><span className={styles.tag}>Opcional</span></div>
        <textarea
          className={styles.obsTextarea}
          placeholder="Ex: Sem cebola, maionese à parte, ponto da batata..."
          value={obs}
          onChange={(e) => setObs(e.target.value)}
        />
      </div>
    </Modal>
  );
}
