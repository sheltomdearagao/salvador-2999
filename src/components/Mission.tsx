
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { evaluateMissionResponse } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';
import MissionHeader from './mission/MissionHeader';
import MissionContent from './mission/MissionContent';
import MissionEvaluation from './mission/MissionEvaluation';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

const MINIMUM_SCORE = 160; // 4 elementos na escala de 200
const MINIMUM_ELEMENTS = 4;

const Mission: React.FC = () => {
  const {
    gameState,
    submitMissionResponse,
    showHelpScreen,
    setCurrentScreen
  } = useGame();

  const { currentMission, missionResponses } = gameState;
  const [response, setResponse] = useState(currentMission ? missionResponses[currentMission.id] || '' : '');
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [elementsCount, setElementsCount] = useState<number | undefined>(undefined);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  if (!currentMission) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center py-8 px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Loader2 className="animate-spin h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 text-cyber-purple" />
          <p className="text-base md:text-lg text-cyber-purple">Carregando missão...</p>
        </motion.div>
      </div>
    );
  }

  const handleBack = () => {
    setCurrentScreen('missionMap');
  };

  const handleSubmit = () => {
    if (!isEvaluated) {
      toast({
        title: "Avaliação necessária",
        description: "Você precisa avaliar sua proposta com o especialista antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if ((score && score < MINIMUM_SCORE) || (elementsCount && elementsCount < MINIMUM_ELEMENTS)) {
      toast({
        title: "Proposta insuficiente",
        description: `Sua proposta precisa conter pelo menos ${MINIMUM_ELEMENTS} elementos válidos para avançar.`,
        variant: "destructive"
      });
      return;
    }

    submitMissionResponse(currentMission.id, response, score);
  };

  const handleEvaluate = async () => {
    if (!response.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, escreva uma proposta de intervenção antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    setScore(undefined);
    setElementsCount(undefined);
    setIsEvaluated(false);

    try {
      const result = await evaluateMissionResponse(
        `${currentMission.description}\n\n${currentMission.instruction}`,
        response
      );

      if (result.success) {
        setEvaluation(result.evaluation || "");
        setScore(result.score);
        setElementsCount(result.elementsCount);
        setIsEvaluated(true);

        if ((result.score && result.score < MINIMUM_SCORE) || (result.elementsCount && result.elementsCount < MINIMUM_ELEMENTS)) {
          toast({
            title: "Proposta precisa de melhorias",
            description: `Sua proposta deve conter pelo menos ${MINIMUM_ELEMENTS} elementos válidos para avançar.`,
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Erro na avaliação",
          description: result.error || "Ocorreu um erro ao avaliar sua resposta.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao avaliar resposta:", error);
      toast({
        title: "Erro na avaliação",
        description: "Ocorreu um erro ao conectar com o serviço de avaliação.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-2 md:py-8 px-2 md:px-4 max-w-4xl mx-auto"
    >
      <MissionHeader 
        mission={currentMission} 
        onBack={handleBack} 
        onHelp={showHelpScreen} 
      />

      <MissionContent mission={currentMission} />

      <div className="mb-4 md:mb-6">
        <h3 className="font-bold mb-2 md:mb-3 text-zinc-100 text-lg md:text-2xl">Sua Proposta de Intervenção:</h3>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Digite sua proposta aqui... Lembre-se de incluir: agente, ação, modo, finalidade e detalhamento."
          className={`${isMobile ? 'min-h-[150px]' : 'min-h-[200px]'} p-3 md:p-4 bg-white border-2 border-gray-200 text-slate-800 text-sm md:text-base focus:border-cyber-blue`}
        />
        <div className="text-right text-xs md:text-sm mt-1 md:mt-2 text-slate-600">
          {response.length}/1000 caracteres
        </div>
      </div>

      {evaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MissionEvaluation 
            evaluation={evaluation}
            elementsCount={elementsCount}
            score={score}
            minimumScore={4}
          />
        </motion.div>
      )}

      <motion.div 
        className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8"
        whileHover={{ scale: isMobile ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          className="bg-cyber-purple hover:bg-cyber-purple/80 text-white font-medium py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg transition-all duration-300 text-sm md:text-base w-full"
          onClick={handleEvaluate}
          disabled={isEvaluating || !response.trim()}
        >
          {isEvaluating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isMobile ? 'Consultando...' : 'Consultando o especialista...'}
            </>
          ) : (
            isMobile ? 'Consultar especialista' : 'Consultar o especialista'
          )}
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={
            !isEvaluated || 
            !response.trim() || 
            (score !== undefined && score < MINIMUM_SCORE) || 
            (elementsCount !== undefined && elementsCount < MINIMUM_ELEMENTS)
          }
          className="bg-cyber-blue hover:bg-cyber-purple text-white font-medium py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg transition-all duration-300 animate-float text-sm md:text-base w-full"
        >
          {isMobile ? 'Enviar e continuar' : 'Enviar proposta e continuar'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Mission;
