import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText, Clock, Brain, Users, BookOpen } from "lucide-react";

interface Question {
  id: number;
  title: string;
  options: {
    emoji: string;
    text: string;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    title: "Qual concurso você está estudando?",
    options: [
      { emoji: "📝", text: "Tribunais (TJ, TRF, TRT)", value: "tribunais" },
      { emoji: "🏛️", text: "Área Fiscal (Receita Federal, SEFAZ)", value: "fiscal" },
      { emoji: "👮", text: "Área Policial (PF, PRF, PC)", value: "policial" },
      { emoji: "🏥", text: "Área de Saúde", value: "saude" },
      { emoji: "🎓", text: "Magistério/Educação", value: "educacao" },
      { emoji: "📊", text: "Outros concursos", value: "outros" },
    ],
  },
  {
    id: 2,
    title: "Há quanto tempo você estuda para concursos?",
    options: [
      { emoji: "🆕", text: "Estou começando agora", value: "iniciante" },
      { emoji: "⏱️", text: "Menos de 6 meses", value: "menos_6_meses" },
      { emoji: "📅", text: "Entre 6 meses e 1 ano", value: "6_12_meses" },
      { emoji: "💪", text: "Mais de 1 ano", value: "mais_1_ano" },
      { emoji: "🎯", text: "Mais de 2 anos", value: "mais_2_anos" },
    ],
  },
  {
    id: 3,
    title: "Qual sua MAIOR dificuldade com pontuação na redação?",
    options: [
      { emoji: "❌", text: "Uso de vírgulas (nunca sei onde colocar)", value: "virgulas" },
      { emoji: "🤔", text: "Dois-pontos e ponto e vírgula (confundo sempre)", value: "dois_pontos" },
      { emoji: "😰", text: "Parênteses e travessões (não sei quando usar)", value: "parenteses" },
      { emoji: "📝", text: "Todos os sinais de pontuação (tenho dúvida em tudo)", value: "todos" },
      { emoji: "✅", text: "Não tenho muita dificuldade, só quero praticar mais", value: "pratica" },
    ],
  },
  {
    id: 4,
    title: "Você já perdeu pontos na redação por erro de pontuação?",
    options: [
      { emoji: "😢", text: "Sim, já fui reprovado(a) por isso", value: "reprovado" },
      { emoji: "📉", text: "Sim, perdi pontos mas passei", value: "perdi_pontos" },
      { emoji: "🤷", text: "Não sei, mas acho que perdi pontos", value: "nao_sei" },
      { emoji: "❌", text: "Ainda não fiz a prova", value: "nao_fiz" },
      { emoji: "✅", text: "Nunca perdi pontos com isso", value: "nunca_perdi" },
    ],
  },
  {
    id: 5,
    title: "Quantas horas por semana você dedica aos estudos?",
    options: [
      { emoji: "⏰", text: "Menos de 5 horas", value: "menos_5" },
      { emoji: "📚", text: "Entre 5 e 10 horas", value: "5_10" },
      { emoji: "💼", text: "Entre 10 e 20 horas", value: "10_20" },
      { emoji: "🔥", text: "Mais de 20 horas (dedicação exclusiva)", value: "mais_20" },
      { emoji: "😅", text: "Estudo quando posso (rotina irregular)", value: "irregular" },
    ],
  },
];

const loadingMessages = [
  "Enviando suas respostas...",
  "Analisando seu perfil...",
  "Identificando suas necessidades...",
  "Preparando seu diagnóstico...",
  "Liberando seu acesso de 60 segundos...",
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);

      const timeout = setTimeout(() => {
        console.log("Quiz concluído! Respostas:", answers);
        navigate("/acesso-temporario");
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoading, answers]);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    
    const newAnswers = { ...answers, [currentQuestion + 1]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setIsLoading(true);
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
          <p className="text-xl font-semibold text-foreground animate-pulse">
            {loadingMessages[loadingMessageIndex]}
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 bg-card shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground text-center font-medium">
            Pergunta {currentQuestion + 1} de {questions.length}
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center leading-tight">
            {question.title}
          </h1>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full min-h-[70px] px-6 py-4 rounded-xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                  selectedOption === option.value
                    ? "bg-accent border-accent text-accent-foreground shadow-lg scale-[1.02]"
                    : "bg-card border-border hover:border-primary hover:bg-primary/5 hover:shadow-card"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{option.emoji}</span>
                <span className={`text-base md:text-lg font-medium ${
                  selectedOption === option.value ? "text-accent-foreground" : "text-foreground"
                }`}>
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
