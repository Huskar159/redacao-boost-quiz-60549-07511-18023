import axios from 'axios';

// Cliente aponta para o backend local seguro (não expõe token no frontend)
const mercadoPagoApi = axios.create({
  baseURL: 'http://localhost:8787/api/mp',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mercadoPagoApi;
