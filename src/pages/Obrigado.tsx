import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

// Declaração de tipo para o Facebook Pixel
declare global {
  interface Window {
    fbq: (event: string, eventName: string, params?: any) => void;
    _fbq: any;
  }
}

const Obrigado = () => {
  // Meta Pixel - Purchase Event
  useEffect(() => {
    // Inicializa o pixel se ainda não estiver inicializado
    if (!window.fbq) {
      (function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s);
      })(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', '1544777363202622');
    }
    
    // Dispara o evento de compra
    window.fbq('track', 'Purchase');
  }, []);
  const handleAccessSite = () => {
    window.location.href = 'https://aberto-pontuacao-mestre.vercel.app/pontuacao';
  };

  return (
    <>
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-accent/10 p-6">
            <CheckCircle2 className="w-16 h-16 text-accent" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-lg text-foreground">
            Obrigado pela sua compra! Seu acesso foi liberado com sucesso.
          </p>

          <p className="text-muted-foreground">
            Agora você tem acesso ilimitado a todos os exercícios de pontuação da plataforma.
          </p>
        </div>

        <div className="pt-6">
          <Button
            onClick={handleAccessSite}
            size="lg"
            className="w-full md:w-auto h-14 px-8 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elegant"
          >
            Acessar a Plataforma
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <div className="pt-6 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground">
            ✅ Acesso ilimitado a mais de 200 exercícios
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Disponível 24/7 em qualquer dispositivo
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Suporte via WhatsApp
          </p>
        </div>
      </Card>
    </div>
      <noscript>
        <img 
          height="1" 
          width="1" 
          style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=1544777363202622&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
};

export default Obrigado;
