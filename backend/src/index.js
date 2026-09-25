import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import produtosRouter from './routes/produtos.js';
import adicionaisRouter from './routes/adicionais.js';
import configuracoesRouter from './routes/configuracoes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' })); // Permite base64 de imagens

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/produtos', produtosRouter);
app.use('/api/adicionais', adicionaisRouter);
app.use('/api/configuracoes', configuracoesRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Drako House API rodando na porta ${PORT}`);
});
