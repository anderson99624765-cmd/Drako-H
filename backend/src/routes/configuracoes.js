import { Router } from 'express';
import { db } from '../firebase.js';

const router = Router();

// GET /api/configuracoes - Retorna todas as configurações
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('configuracoes').once('value');
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/configuracoes/status - Status da loja
router.get('/status', async (req, res) => {
  try {
    const snapshot = await db.ref('configuracoes/statusLoja').once('value');
    res.json({ aberta: snapshot.val() !== false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/configuracoes/status - Abre/Fecha loja
router.put('/status', async (req, res) => {
  try {
    const { aberta } = req.body;
    await db.ref('configuracoes/statusLoja').set(aberta !== false);
    res.json({ aberta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/configuracoes/visual - Identidade visual
router.get('/visual', async (req, res) => {
  try {
    const snapshot = await db.ref('configuracoes/visual').once('value');
    res.json(snapshot.val() || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/configuracoes/visual - Salva identidade visual
router.put('/visual', async (req, res) => {
  try {
    const identidade = req.body;
    await db.ref('configuracoes/visual').set(identidade);
    res.json(identidade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
