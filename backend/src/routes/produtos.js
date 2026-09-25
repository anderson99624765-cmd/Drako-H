import { Router } from 'express';
import { db } from '../firebase.js';

const router = Router();

// GET /api/produtos - Lista todos os produtos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('produtos').once('value');
    const dados = snapshot.val() || {};
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/produtos/:id - Produto específico
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await db.ref(`produtos/${req.params.id}`).once('value');
    const dado = snapshot.val();
    if (!dado) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ id: req.params.id, ...dado });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/produtos - Cria produto
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, foto, categoria, qtdSabores, precoM, precoG, destaque } = req.body;
    if (!nome || !precoM) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    }
    const ref = db.ref('produtos').push();
    const produto = { nome, descricao: descricao || '', foto: foto || '', categoria: categoria || 'bebidas', qtdSabores: qtdSabores || 2, precoM: parseFloat(precoM), precoG: parseFloat(precoG || precoM), destaque: destaque || false };
    await ref.set(produto);
    res.status(201).json({ id: ref.key, ...produto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/produtos/:id - Atualiza produto
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao, foto, categoria, qtdSabores, precoM, precoG, destaque } = req.body;
    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (descricao !== undefined) updates.descricao = descricao;
    if (foto !== undefined) updates.foto = foto;
    if (categoria !== undefined) updates.categoria = categoria;
    if (qtdSabores !== undefined) updates.qtdSabores = qtdSabores;
    if (precoM !== undefined) updates.precoM = parseFloat(precoM);
    if (precoG !== undefined) updates.precoG = parseFloat(precoG);
    if (destaque !== undefined) updates.destaque = destaque;
    await db.ref(`produtos/${req.params.id}`).update(updates);
    res.json({ id: req.params.id, ...updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/produtos/:id - Exclui produto
router.delete('/:id', async (req, res) => {
  try {
    await db.ref(`produtos/${req.params.id}`).remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
