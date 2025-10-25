import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, amount = 19.90 } = await req.json();

    if (!email) {
      throw new Error('Email é obrigatório');
    }

    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('Credenciais do Mercado Pago não configuradas');
    }

    console.log('Criando pagamento PIX para:', email);

    // Gerar idempotency key único
    const idempotencyKey = crypto.randomUUID();

    // Criar pagamento via Mercado Pago API
    const paymentData = {
      transaction_amount: amount,
      description: 'Plataforma de Exercícios de Pontuação - Acesso Completo',
      payment_method_id: 'pix',
      payer: {
        email: email,
      },
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na API do Mercado Pago:', errorData);
      throw new Error(`Erro ao criar pagamento: ${errorData.message || 'Erro desconhecido'}`);
    }

    const payment = await response.json();
    console.log('Pagamento criado com sucesso:', payment.id);

    // Retornar dados do pagamento incluindo QR code
    return new Response(
      JSON.stringify({
        success: true,
        payment_id: payment.id,
        status: payment.status,
        qr_code: payment.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        ticket_url: payment.point_of_interaction?.transaction_data?.ticket_url,
        amount: payment.transaction_amount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
