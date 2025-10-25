import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Responda 5 perguntas",
      description: "30 segundos",
      icon: Target,
    },
    {
      number: "2",
      title: "TESTE GRÁTIS",
      description: "60 segundos",
      icon: Zap,
    },
    {
      number: "3",
      title: "Viu que funciona?",
      description: "Acesso completo por R$19,90",
      icon: CheckCircle2,
    },
    {
      number: "4",
      title: "Pague via PIX",
      description: "Comece a treinar agora mesmo",
      icon: CheckCircle2,
    },
  ];

  const handleCTAClick = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Pare de Perder Pontos por Vírgula!
              <br />
              <span className="text-foreground">
                Treine Pontuação e Aumente Sua Nota na Redação
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Teste <span className="font-semibold text-accent">GRÁTIS</span> por 60 segundos nossa plataforma com{" "}
              <span className="font-semibold text-primary">+200 exercícios</span> de pontuação para concursos.
              <br />
              Depois, acesso ilimitado por apenas{" "}
              <span className="font-bold text-secondary text-2xl">R$19,90</span>
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-accent text-accent-foreground">
                TESTE GRÁTIS
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2 border-primary/30">
                +200 EXERCÍCIOS
              </Badge>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16 animate-slide-up">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center flex items-center justify-center gap-2">
              <Target className="w-8 h-8" />
              Como funciona
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className="p-6 shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-primary">{step.number}️⃣</span>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Card className="p-8 shadow-elegant">
              <div className="space-y-6">
                <Button
                  type="button"
                  variant="cta"
                  size="xl"
                  className="w-full"
                  onClick={handleCTAClick}
                >
                  COMEÇAR TESTE GRÁTIS AGORA
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>Teste grátis</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-accent" />
                    <span>Sem cartão</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-accent" />
                    <span>Acesso em segundos</span>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
