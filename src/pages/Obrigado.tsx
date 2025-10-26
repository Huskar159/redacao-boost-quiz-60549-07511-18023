import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Declaração de tipo para o Facebook Pixel
declare global {
  interface Window {
    fbq: (event: string, eventName: string, params?: any) => void;
    _fbq: any;
  }
}

interface PaymentData {
  id: string;
  status: string;
  date_approved?: string;
  transaction_amount?: number;
  payment_method_id?: string;
  payment_type_id?: string;
  currency_id?: string;
  description?: string;
  payer?: {
    email: string;
  };
}

const Obrigado = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const paymentId = searchParams.get('payment_id');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Formata a data para exibição
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Copia o ID do pedido para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copiado!",
      description: "ID do pedido copiado para a área de transferência.",
    });
  };

  const handleAccessSite = () => {
    window.location.href = 'https://aberto-pontuacao-mestre.vercel.app/pontuacao';
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (!paymentId) {
        navigate('/');
        return;
      }

      try {
        // Verifica se o pagamento existe no localStorage
        const storedPayment = localStorage.getItem('currentPaymentId');
        
        if (storedPayment !== paymentId) {
          // Se o ID do pagamento não corresponder ao armazenado localmente
          navigate('/');
          return;
        }

        // Dispara o evento de compra do Meta Pixel
        if (window.fbq) {
          window.fbq('track', 'Purchase', {
            value: 19.90,
            currency: 'BRL',
            content_type: 'product',
            content_ids: [paymentId],
          });
        }

        // Simulando dados do pagamento (substitua por uma chamada real à API se necessário)
        setPaymentData({
          id: paymentId,
          status: 'approved',
          date_approved: new Date().toISOString(),
          transaction_amount: 19.90,
          payment_method_id: 'pix',
          payment_type_id: 'credit_card',
          currency_id: 'BRL',
          description: 'Curso de Redação',
          payer: {
            email: localStorage.getItem('userEmail') || 'cliente@exemplo.com'
          }
        });

        // Limpa o ID do pagamento do localStorage após 5 segundos
        setTimeout(() => {
          localStorage.removeItem('currentPaymentId');
          localStorage.removeItem('userEmail');
        }, 5000);

      } catch (error) {
        console.error('Erro ao carregar dados do pagamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do pagamento.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, [paymentId, navigate, toast]);

  // Meta Pixel: init + Purchase
  useEffect(() => {
    // Se já existir, apenas inicializa/track
    if (window.fbq) {
      try {
        window.fbq('init', '1544777363202622');
        window.fbq('track', 'Purchase');
      } catch {}
      return;
    }

    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () { (n as any).callMethod ? (n as any).callMethod.apply(n, arguments) : (n as any).queue.push(arguments) };
      if (!f._fbq) f._fbq = n;
      (n as any).push = (n as any);
      (n as any).loaded = true;
      (n as any).version = '2.0';
      (n as any).queue = [];
      t = b.createElement(e); t.async = true;
      t.src = 'https://connect.facebook.net/en_US/fbevents.js';
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window as any, document as any, 'script', null);

    try {
      window.fbq('init', '1544777363202622');
      window.fbq('track', 'Purchase');
    } catch {}
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Carregando informações do pagamento...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagamento não encontrado</h1>
          <p className="text-gray-600 mb-6">Não foi possível encontrar as informações do seu pagamento.</p>
          <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h1>
          <p className="text-lg text-gray-600">Obrigado por adquirir nosso curso de redação.</p>
        </div>

        <Card className="bg-white overflow-hidden shadow rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detalhes do Pedido</h3>
          </div>
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ID do Pedido</h4>
                <div className="mt-1 flex items-center">
                  <span className="text-sm font-medium text-gray-900">{paymentData.id}</span>
                  <button
                    onClick={() => copyToClipboard(paymentData.id)}
                    className="ml-2 text-gray-400 hover:text-gray-500"
                    title="Copiar ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Data da Compra</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(paymentData.date_approved)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Método de Pagamento</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {paymentData.payment_method_id === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Valor Total</h4>
                <p className="mt-1 text-sm font-bold text-gray-900">
                  {paymentData.transaction_amount?.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: paymentData.currency_id || 'BRL'
                  })}
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status do Pagamento</h4>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    paymentData.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {paymentData.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Próximos Passos</h3>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    Em caso de dúvidas, entre em contato pelo nosso suporte: (61) 98166-2814
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button 
                onClick={handleAccessSite}
                className="px-8 py-6 text-lg"
              >
                Acessar Área do Aluno
              </Button>
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1544777363202622&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </div>
  );
};

export default Obrigado;
