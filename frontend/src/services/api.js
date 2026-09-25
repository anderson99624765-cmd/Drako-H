import { API_URL } from '../config/firebase';

// Helper para requests
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Erro na requisição');
  }
  return res.json();
}

// === Produtos ===
export const getProdutos = () => request('/produtos');
export const criarProduto = (data) => request('/produtos', { method: 'POST', body: JSON.stringify(data) });
export const atualizarProduto = (id, data) => request(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const excluirProduto = (id) => request(`/produtos/${id}`, { method: 'DELETE' });

// === Adicionais ===
export const getAdicionais = () => request('/adicionais');
export const criarAdicional = (data) => request('/adicionais', { method: 'POST', body: JSON.stringify(data) });
export const excluirAdicional = (id) => request(`/adicionais/${id}`, { method: 'DELETE' });

// === Configurações ===
export const getConfiguracoes = () => request('/configuracoes');
export const getStatusLoja = () => request('/configuracoes/status');
export const setStatusLoja = (aberta) => request('/configuracoes/status', { method: 'PUT', body: JSON.stringify({ aberta }) });
export const getVisual = () => request('/configuracoes/visual');
export const salvarVisual = (data) => request('/configuracoes/visual', { method: 'PUT', body: JSON.stringify(data) });
