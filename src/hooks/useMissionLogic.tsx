
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { evaluateMissionResponse } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';

const MINIMUM_SCORE = 160;
const MINIMUM_ELEMENTS = 4;

export const useMissionLogic = () => {
  const { gameState, submitMissionResponse, setCurrentScreen } = useGame();
  const { currentMission, missionResponses } = gameState;
  const [response, setResponse] = useState(currentMission ? missionResponses[currentMission.id] || '' : '');
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [elementsCount, setElementsCount] = useState<number | undefined>(undefined);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const { toast } = useToast();

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

    if (currentMission) {
      submitMissionResponse(currentMission.id, response, score);
    }
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

    if (!currentMission) return;

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

  return {
    response,
    setResponse,
    evaluation,
    isEvaluating,
    score,
    elementsCount,
    isEvaluated,
    handleBack,
    handleSubmit,
    handleEvaluate,
    MINIMUM_SCORE,
    MINIMUM_ELEMENTS
  };
};
