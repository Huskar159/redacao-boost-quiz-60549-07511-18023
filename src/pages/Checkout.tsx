import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  Flame,
  Zap,
  Smartphone,
  Calendar,
  HeadphonesIcon,
  Gift,
  Star,
} from "lucide-react";

const Checkout = () => {
  const [urgencyTimer, setUrgencyTimer] = useState(15 * 60); // 15 minutos em segundos
  const [email, setEmail] = useState("");
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    payment_id: string;
  } | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setUrgencyTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatUrgencyTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCTAClick = () => {
    const checkoutSection = document.getElementById('checkout-area');
    if (checkoutSection) {
      checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGeneratePix = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, confirme seu email",
        variant: "destructive",
      });
      return;
    }
    
    setIsGeneratingPix(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-pix-payment', {
        body: { email, amount: 19.90 },
      });

      if (error) throw error;

      if (data.success) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
          payment_id: data.payment_id,
        });
        setShowPixModal(true);
        toast({
          title: "PIX gerado com sucesso!",
          description: "Escaneie o QR Code para realizar o pagamento",
        });
        
        // Simular confirmação de pagamento após 5 segundos (em produção, usar webhook)
        setTimeout(() => {
          navigate('/obrigado');
        }, 5000);
      } else {
        throw new Error(data.error || "Erro ao gerar PIX");
      }
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      toast({
        title: "Erro ao gerar PIX",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* TOPO - ARGUMENTO PRINCIPAL */}
          <section className="text-center space-y-6 animate-fade-in">
            <Badge className="bg-accent text-accent-foreground text-base px-6 py-2">
              ✅ VOCÊ ACABOU DE TESTAR
            </Badge>

            <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
              Você acabou de experimentar EXATAMENTE o que vai receber!
            </h1>

            <div className="space-y-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              <p>Sem pegadinhas. Sem surpresas. O que você testou é o que você terá.</p>
              <p className="font-semibold text-foreground">
                A diferença? Acesso ilimitado a TUDO, quando quiser.
              </p>
            </div>
          </section>

          {/* SEÇÃO 1 - REFORÇO DA EXPERIÊNCIA */}
          <Card className="p-8 bg-accent/5 border-accent/20 animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              ✅ Você acabou de ver que é REAL
            </h2>

            <div className="space-y-4 mb-6">
              {[
                "Você navegou pela plataforma de verdade",
                "Viu que funciona",
                "Testou os exercícios",
                "Conheceu a interface",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-xl font-semibold text-primary italic border-t border-border pt-6">
              Agora imagine ter acesso ILIMITADO a isso, 24 horas por dia, 7 dias por semana...
            </p>
          </Card>

          {/* SEÇÃO 2 - O QUE ESTÁ INCLUÍDO */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-primary text-center">
              🎯 Aqui está TUDO que você terá com o acesso completo:
            </h2>

            <div className="grid gap-4">
              {[
                { icon: CheckCircle2, text: "Mais de 200 exercícios", highlight: "de pontuação para redação" },
                { icon: Clock, text: "Acesso ilimitado", highlight: "24/7" },
                { icon: Zap, text: "Exercícios atualizados", highlight: "constantemente" },
                { icon: Calendar, text: "Estude no seu ritmo,", highlight: "sem pressão" },
                { icon: Flame, text: "Pratique", highlight: "quantas vezes quiser" },
                { icon: Smartphone, text: "Acesso em qualquer dispositivo", highlight: "(celular, tablet, computador)" },
                { icon: HeadphonesIcon, text: "Suporte via", highlight: "WhatsApp" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/5 transition-smooth">
                  <item.icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg text-foreground">
                    <span className="font-semibold">{item.text}</span>{" "}
                    {item.highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SEÇÃO 3 - QUEBRA DE OBJEÇÃO */}
          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              🔒 Pode confiar, você JÁ testou!
            </h2>

            <p className="text-lg text-foreground mb-6">
              Diferente de outros cursos que você compra "no escuro", aqui você{" "}
              <span className="font-semibold">EXPERIMENTOU primeiro</span>. Você viu com seus próprios olhos que:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-destructive mb-3">O que NÃO é:</h3>
                {[
                  "Não é um site fake",
                  "Não são promessas vazias",
                  "Não é conteúdo de baixa qualidade",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-accent mb-3">O que É:</h3>
                {[
                  "É uma plataforma REAL e FUNCIONAL",
                  "São exercícios de VERDADE",
                  "É exatamente o que você precisa para treinar pontuação",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* SEÇÃO 4 - PREÇO */}
          <Card id="checkout-area" className="p-8 md:p-12 border-2 border-accent shadow-elegant text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              💰 Quanto custa ter acesso ilimitado a tudo isso?
            </h2>

            <div className="mb-6">
              <p className="text-muted-foreground line-through text-xl mb-2">De R$ 97,00</p>
              <p className="text-lg mb-2">Por apenas:</p>
              <div className="text-6xl md:text-7xl font-bold text-accent mb-2">
                R$ 19,90
              </div>
            </div>

            <div className="space-y-2 text-muted-foreground mb-8">
              <p className="text-base">Menos que um lanche por mês</p>
              <p className="text-base">O preço de um café por semana</p>
              <p className="text-lg font-semibold text-foreground">
                Investimento que pode mudar seu resultado no concurso
              </p>
            </div>

            {/* Campo de Email e Botão PIX */}
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-left">
                <Label htmlFor="checkout-email" className="text-foreground font-semibold text-base mb-2 block">
                  Confirme seu email:
                </Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <Button
                onClick={handleGeneratePix}
                disabled={isGeneratingPix}
                size="lg"
                className="w-full h-16 text-xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elegant"
              >
                {isGeneratingPix ? "GERANDO PIX..." : "GERAR PIX"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                🔒 Pagamento 100% seguro • ⚡ PIX: Acesso em segundos
              </p>
            </div>
          </Card>

          {/* SEÇÃO 5 - URGÊNCIA */}
          <Card className="p-6 border-2 border-secondary bg-secondary/5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-secondary flex-shrink-0" />
                <p className="text-lg font-semibold text-foreground">
                  ⏰ Oferta expira em{" "}
                  <span className="text-secondary text-xl">{formatUrgencyTime(urgencyTimer)}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-secondary flex-shrink-0" />
                <p className="text-lg font-semibold text-foreground">
                  🔥 Apenas 15 vagas disponíveis hoje
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-secondary flex-shrink-0" />
                <p className="text-lg font-semibold text-foreground">
                  🎁 Bônus exclusivo para quem testou a plataforma
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-secondary flex-shrink-0" />
                <p className="text-lg font-semibold text-foreground">
                  ⚡ Pagamento via PIX - Acesso liberado em SEGUNDOS
                </p>
              </div>
            </div>
          </Card>

          {/* SEÇÃO 6 - PROVA SOCIAL */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
              ⭐ Veja quem já está treinando e sendo aprovado:
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  text: "A plataforma me salvou! Consegui melhorar muito minha pontuação nas redações e fui aprovada no concurso do TJ.",
                  name: "Maria Silva",
                  position: "Aprovada no TJ-SP",
                },
                {
                  text: "Praticidade incrível! Estudava no celular durante o trajeto para o trabalho. Os exercícios são diretos ao ponto.",
                  name: "João Santos",
                  position: "Aprovado na Receita Federal",
                },
                {
                  text: "Nunca imaginei que pontuação faria tanta diferença. Com os exercícios, passei a dominar o assunto completamente.",
                  name: "Ana Paula",
                  position: "Aprovada no TRF",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 shadow-card">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                </Card>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-center">
              <p className="text-lg font-bold text-foreground">
                ✅ Mais de 500 alunos aprovados
              </p>
              <p className="text-lg font-bold text-foreground">
                📊 Nota média: 95 pontos na redação
              </p>
            </div>
          </section>

          {/* CTA PRINCIPAL 2 */}
          <div className="space-y-4">
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elegant transition-smooth"
            >
              GARANTIR MEU ACESSO POR R$ 19,90
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              🔒 Pagamento 100% seguro • ⚡ PIX: Acesso em segundos
            </p>
          </div>

          {/* SEÇÃO 7 - COMPARAÇÃO */}
          <section className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
              ⚖️ O que você perde ficando de fora?
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-2 border-border rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="bg-destructive/10 p-4 text-left font-bold text-foreground border-b border-border">
                      ❌ SEM a plataforma
                    </th>
                    <th className="bg-accent/10 p-4 text-left font-bold text-foreground border-b border-border">
                      ✅ COM a plataforma
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      without: "Treina pontuação sozinho, sem direção",
                      with: "+200 exercícios direcionados",
                    },
                    {
                      without: "Não sabe se está evoluindo",
                      with: "Pratica até dominar",
                    },
                    {
                      without: "Perde tempo procurando material",
                      with: "Tudo em um só lugar",
                    },
                    {
                      without: "Fica na dúvida",
                      with: "Aprende de forma estruturada",
                    },
                    {
                      without: "Pode perder a vaga por falta de treino",
                      with: "Preparo completo para garantir a aprovação",
                    },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="bg-destructive/5 p-4 border-b border-border text-foreground">
                        {row.without}
                      </td>
                      <td className="bg-accent/5 p-4 border-b border-border text-foreground font-semibold">
                        {row.with}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* SEÇÃO 8 - GARANTIA */}
          <Card className="p-8 bg-accent/10 border-2 border-accent text-center">
            <div className="inline-block mb-4">
              <Badge className="bg-accent text-accent-foreground text-lg px-6 py-3">
                <Shield className="w-5 h-5 mr-2" />
                🛡️ GARANTIA DE 7 DIAS
              </Badge>
            </div>

            <div className="space-y-4 text-lg text-foreground max-w-2xl mx-auto">
              <p>
                Se você não gostar, <span className="font-bold">devolvemos 100% do seu dinheiro</span>.
                Sem perguntas, sem burocracia.
              </p>
              <p className="font-semibold">Você literalmente não tem NADA a perder.</p>
              <p className="font-bold text-xl text-accent">O risco é TODO NOSSO.</p>
            </div>
          </Card>

          {/* CTA PRINCIPAL 3 */}
          <div className="space-y-4">
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elegant transition-smooth"
            >
              GARANTIR MEU ACESSO POR R$ 19,90
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              🔒 Pagamento 100% seguro • ⚡ PIX: Acesso em segundos
            </p>
          </div>

          {/* SEÇÃO 9 - FAQ */}
          <section className="space-y-6 pt-16 border-t-2 border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
              ❓ Ainda tem dúvidas?
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "Quando terei acesso?",
                  a: "Logo após a confirmação do pagamento via PIX (em segundos)",
                },
                {
                  q: "Por quanto tempo terei acesso?",
                  a: "Acesso vitalício à plataforma e todos os exercícios",
                },
                {
                  q: "Funciona no celular?",
                  a: "Sim! Funciona perfeitamente em qualquer dispositivo - celular, tablet ou computador.",
                },
                {
                  q: "E se eu não gostar?",
                  a: "7 dias de garantia incondicional. Devolvemos 100% do valor, sem perguntas.",
                },
                {
                  q: "São quantos exercícios?",
                  a: "Mais de 200 exercícios específicos de pontuação para redação de concurso público",
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-bold text-lg text-primary mb-2">{faq.q}</h3>
                  <p className="text-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <div className="space-y-4">
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="w-full h-16 md:h-20 text-xl md:text-2xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-elegant transition-smooth"
            >
              GARANTIR MEU ACESSO POR R$ 19,90
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              🔒 Pagamento 100% seguro • ⚡ PIX: Acesso em segundos • 🛡️ 7 dias de garantia
            </p>
          </div>
        </div>
      </main>

      {/* Modal do PIX */}
      <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>PIX Gerado com Sucesso!</DialogTitle>
            <DialogDescription>
              Escaneie o QR Code ou copie o código PIX para realizar o pagamento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pixData?.qr_code_base64 && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <img 
                  src={`data:image/png;base64,${pixData.qr_code_base64}`} 
                  alt="QR Code PIX"
                  className="w-64 h-64"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Código PIX Copia e Cola</Label>
              <div className="flex gap-2">
                <Input 
                  value={pixData?.qr_code || ''} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button onClick={copyPixCode} variant="outline">
                  Copiar
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              <p>Valor: R$ 19,90</p>
              <p className="mt-2">Após o pagamento, seu acesso será liberado automaticamente em segundos!</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
