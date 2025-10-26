import axios from 'axios';

// Crie um arquivo .env na raiz do projeto com VITE_MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
const MERCADO_PAGO_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

if (!MERCADO_PAGO_ACCESS_TOKEN) {
  console.error('Erro: Token de acesso do Mercado Pago não encontrado. Verifique o arquivo .env');
}

const mercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com/v1',
  headers: {
    'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export default mercadoPagoApi;
