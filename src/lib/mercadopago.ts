import axios from 'axios';

// Cliente aponta para o backend local seguro (não expõe token no frontend)
const BACKEND_BASE = ((import.meta as any).env?.VITE_BACKEND_URL || '').replace(/\/$/, '');
const baseURL = BACKEND_BASE ? `${BACKEND_BASE}/api/mp` : '/api/mp';

const mercadoPagoApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mercadoPagoApi;
