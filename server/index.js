require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8787;
const MP_TOKEN = process.env.MP_ACCESS_TOKEN || process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

app.use(cors());
app.use(express.json());

if (!MP_TOKEN) {
  console.warn('Aviso: MP_ACCESS_TOKEN não definido. Defina no ambiente antes de iniciar o servidor.');
}

const mp = axios.create({
  baseURL: 'https://api.mercadopago.com/v1',
  headers: {
    Authorization: `Bearer ${MP_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Healthcheck
app.get('/api/mp/health', (_req, res) => {
  res.json({ ok: true });
});

// Cria pagamento PIX (espelha a rota do MP)
app.post('/api/mp/payments', async (req, res) => {
  try {
    const response = await mp.post('/payments', req.body);
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      error: true,
      message: err.response?.data?.message || err.message,
      details: err.response?.data || null,
    });
  }
});

// Busca status do pagamento
app.get('/api/mp/payments/:id', async (req, res) => {
  try {
    const response = await mp.get(`/payments/${req.params.id}`);
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({
      error: true,
      message: err.response?.data?.message || err.message,
      details: err.response?.data || null,
    });
  }
});

app.listen(PORT, () => {
  console.log(`API segura do Mercado Pago rodando em http://localhost:${PORT}`);
});
