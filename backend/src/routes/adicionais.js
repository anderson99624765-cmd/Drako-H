import { Router } from 'express';
import { db } from '../firebase.js';

const router = Router();

// GET /api/adicionais
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('adicionais').once('value');
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/adicionais
router.post('/', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    if (!nome || !preco) return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
    const ref = db.ref('adicionais').push();
    const adicional = { nome, preco: parseFloat(preco) };
    await ref.set(adicional);
    res.status(201).json({ id: ref.key, ...adicional });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/adicionais/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.ref(`adicionais/${req.params.id}`).remove();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
