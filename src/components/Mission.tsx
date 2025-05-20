
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { evaluateMissionResponse } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';
import MissionHeader from './mission/MissionHeader';
import MissionContent from './mission/MissionContent';
import MissionEvaluation from './mission/MissionEvaluation';

const MINIMUM_SCORE = 8; // Nota mínima para passar (equivalente a 4+ elementos)
const MINIMUM_ELEMENTS = 4; // Número mínimo de elementos válidos necessários

const Mission: React.FC = () => {
  const { gameState, submitMissionResponse, showHelpScreen, setCurrentScreen } = useGame();
  const { currentMission, missionResponses } = gameState;
  const [response, setResponse] = useState(
    currentMission ? missionResponses[currentMission.id] || '' : ''
  );
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number | undefined>(undefined);
  const [elementsCount, setElementsCount] = useState<number | undefined>(undefined);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const { toast } = useToast();

  if (!currentMission) {
    return <div className="text-center py-16">Carregando missão...</div>;
  }

  const handleBack = () => {
    setCurrentScreen('missionMap');
  };

  const handleSubmit = () => {
    if (!isEvaluated) {
      toast({
        title: "Avaliação necessária",
        description: "Você precisa avaliar sua proposta com o mestre antes de continuar.",
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
        
        // Notificar o usuário se sua proposta não atende aos requisitos mínimos
        if ((result.score && result.score < MINIMUM_SCORE) || 
            (result.elementsCount && result.elementsCount < MINIMUM_ELEMENTS)) {
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
        description: "Ocorreu um erro ao conectar com a API OpenAI.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="py-8">
      <MissionHeader 
        mission={currentMission} 
        onBack={handleBack} 
        onHelp={showHelpScreen} 
      />

      <MissionContent 
        mission={currentMission} 
      />

      <div className="mb-6">
        <h3 className="font-bold mb-2">Sua Proposta de Intervenção:</h3>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Digite sua proposta aqui... Lembre-se de incluir: agente, ação, modo, finalidade e detalhamento."
          className="min-h-[200px] p-4 bg-white/80"
        />
        <div className="text-right text-sm mt-2">
          {response.length}/1000 caracteres
        </div>
      </div>

      {evaluation && (
        <MissionEvaluation 
          evaluation={evaluation}
          elementsCount={elementsCount}
          score={score}
          minimumScore={MINIMUM_SCORE}
        />
      )}

      <div className="flex justify-center gap-4">
        <Button 
          className="bg-cyber-purple hover:bg-cyber-purple/80"
          onClick={handleEvaluate}
          disabled={isEvaluating || !response.trim()}
        >
          {isEvaluating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Consultando o mestre...
            </>
          ) : (
            'Consultar o mestre'
          )}
        </Button>
        
        <Button 
          className="btn-cyber"
          onClick={handleSubmit}
          disabled={!isEvaluated || !response.trim() || (score !== undefined && score < MINIMUM_SCORE) || (elementsCount !== undefined && elementsCount < MINIMUM_ELEMENTS)}
        >
          Enviar proposta e continuar
        </Button>
      </div>
    </div>
  );
};

export default Mission;
