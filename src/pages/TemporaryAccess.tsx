import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Lock } from "lucide-react";

const TemporaryAccess = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/checkout");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getBannerColor = () => {
    if (timeLeft > 30) return "bg-[#f97316]";
    if (timeLeft > 10) return "bg-[#ea580c]";
    return "bg-[#dc2626]";
  };

  const getBannerText = () => {
    if (timeLeft <= 10) return "⚠️ ÚLTIMOS 10 SEGUNDOS!";
    if (timeLeft <= 30) return "⏰ Restam 30 segundos!";
    return "Explore a plataforma COMPLETA!";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Banner */}
      <div
        className={`fixed top-0 left-0 right-0 ${getBannerColor()} text-white transition-all duration-300 z-50 shadow-lg`}
      >
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm md:text-base font-semibold mb-2">
            ⏰ SEU TESTE EXPIRA EM:
          </p>
          
          <div
            className={`text-5xl md:text-6xl font-bold mb-2 ${
              timeLeft <= 10 ? "animate-pulse" : ""
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          
          <p className="text-sm md:text-base font-medium">
            {getBannerText()}
          </p>
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 pt-[120px] md:pt-[140px]">
        <iframe
          src="https://aberto-pontuacao-mestre.vercel.app/pontuacao"
          className="w-full h-full border-0"
          title="Plataforma de Exercícios"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default TemporaryAccess;
