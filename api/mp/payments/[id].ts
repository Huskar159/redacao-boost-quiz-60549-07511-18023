export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: true, message: 'Method Not Allowed' });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN || process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ error: true, message: 'MP_ACCESS_TOKEN não configurado no ambiente' });
    return;
  }

  const { id } = req.query || {};
  if (!id) {
    res.status(400).json({ error: true, message: 'payment id ausente' });
    return;
  }

  try {
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await mpRes.json();
    res.status(mpRes.status).json(data);
  } catch (err: any) {
    res.status(500).json({ error: true, message: err?.message || 'Erro desconhecido' });
  }
}
