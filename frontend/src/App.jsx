import { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import NavCategorias from './components/NavCategorias';
import Cardapio from './components/Cardapio';
import BarraCarrinho from './components/BarraCarrinho';
import ModalCarrinho from './components/modals/ModalCarrinho';
import ModalCustomizacao from './components/modals/ModalCustomizacao';
import ModalComboSabores from './components/modals/ModalComboSabores';
import ModalAdmin from './components/modals/ModalAdmin';
import OverlayFechado from './components/OverlayFechado';
import Footer from './components/Footer';

export default function App() {
  const { lojaAberta } = useApp();
  const [overlayFechadoDismissed, setOverlayFechadoDismissed] = useState(false);
  const [modalCarrinhoOpen, setModalCarrinhoOpen] = useState(false);
  const [modalCustomizacao, setModalCustomizacao] = useState(null); // produto
  const [modalCombo, setModalCombo] = useState(null); // produto combo
  const [modalAdminOpen, setModalAdminOpen] = useState(false);

  return (
    <>
      {/* Overlay loja fechada */}
      {!lojaAberta && !overlayFechadoDismissed && (
        <OverlayFechado onDismiss={() => setOverlayFechadoDismissed(true)} />
      )}

      <Header onOpenAdmin={() => setModalAdminOpen(true)} />
      <NavCategorias />

      <main className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 16px' }}>
        <Cardapio
          onCustomizacao={(prod) => setModalCustomizacao(prod)}
          onCombo={(prod) => setModalCombo(prod)}
        />
      </main>

      <Footer onOpenAdmin={() => setModalAdminOpen(true)} />

      <BarraCarrinho onOpen={() => setModalCarrinhoOpen(true)} />

      {/* Modais */}
      {modalCarrinhoOpen && (
        <ModalCarrinho onClose={() => setModalCarrinhoOpen(false)} />
      )}
      {modalCustomizacao && (
        <ModalCustomizacao
          produto={modalCustomizacao}
          onClose={() => setModalCustomizacao(null)}
        />
      )}
      {modalCombo && (
        <ModalComboSabores
          produto={modalCombo}
          onClose={() => setModalCombo(null)}
        />
      )}
      {modalAdminOpen && (
        <ModalAdmin onClose={() => setModalAdminOpen(false)} />
      )}
    </>
  );
}
