import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { useApp } from '../../context/AppContext';
import Modal from './Modal';
import styles from './ModalComboSabores.module.css';

export default function ModalComboSabores({ produto, onClose }) {
  const { adicionarItem } = useApp();
  const [batatas, setBatatas] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const maxSabores = parseInt(produto.qtdSabores) || 2;

  useEffect(() => {
    const q = query(ref(db, 'produtos'), orderByChild('categoria'), equalTo('batatas'));
    get(q).then(snap => {
      const dados = snap.val() || {};
      setBatatas(Object.values(dados));
    });
  }, []);

  const toggle = (nome) => {
    setSelecionados(prev => {
      if (prev.includes(nome)) return prev.filter(n => n !== nome);
      if (prev.length >= maxSabores) { alert(`Você só pode escolher ${maxSabores} sabor${maxSabores > 1 ? 'es' : ''}.`); return prev; }
      return [...prev, nome];
    });
  };

  const confirmar = () => {
    if (selecionados.length !== maxSabores) {
      alert(`Por favor, escolha exatamente ${maxSabores} sabor${maxSabores > 1 ? 'es' : ''}.`);
      return;
    }
    const nomeCompleto = `${produto.nome} (${selecionados.join(' + ')})`;
    const chave = `combo-${produto.id}-${Date.now()}`;
    adicionarItem(chave, {
      idProduto: produto.id,
      qtd: 1,
      nome: nomeCompleto,
      tamanho: null,
      precoBase: parseFloat(produto.precoM),
      adicionais: [], observacao: '',
      preco: parseFloat(produto.precoM),
    });
    onClose();
  };

  const footer = (
    <button className={styles.btnConfirmar} onClick={confirmar} style={{ width: '100%', justifyContent: 'center' }}>
      Confirmar Seleção
    </button>
  );

  return (
    <Modal titulo={produto.nome} onClose={onClose} footer={footer}>
      <p className={styles.desc}>
        {maxSabores === 1 ? 'Selecione 1 sabor de batata para o seu combo:' : `Selecione exatamente ${maxSabores} sabores de batata:`}
      </p>
      {batatas.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>Nenhum sabor encontrado.</p>}
      {batatas.map((b) => {
        const sel = selecionados.includes(b.nome);
        return (
          <label key={b.nome} className={`${styles.item} ${sel ? styles.ativo : ''}`}>
            <div className={styles.info}>
              <input type="checkbox" checked={sel} onChange={() => toggle(b.nome)} />
              <div>
                <strong className={styles.nome}>{b.nome}</strong>
                {b.descricao && <p className={styles.descItem}>{b.descricao}</p>}
              </div>
            </div>
          </label>
        );
      })}
    </Modal>
  );
}
