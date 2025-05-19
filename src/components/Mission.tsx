
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, ArrowLeft, Home, Loader2, AlertTriangle } from 'lucide-react';
import { evaluateMissionResponse } from '@/utils/openaiService';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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

  const handleSubmit = () => {
    if (!isEvaluated) {
      toast({
        title: "Avaliação necessária",
        description: "Você precisa avaliar sua proposta com a IA antes de continuar.",
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
            variant: "warning"
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
      <div className="flex items-center gap-4 mb-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="rounded-full"
            >
              <Home className="h-6 w-6" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Voltar para a tela inicial?</AlertDialogTitle>
              <AlertDialogDescription>
                Se você sair agora, qualquer resposta não salva será perdida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => setCurrentScreen('missionMap')}>
                Voltar para o Mapa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div>
          <h2 className="text-sm text-cyber-orange font-medium">{currentMission.zone}</h2>
          <h1 className="text-3xl md:text-4xl font-bold cyber-heading">
            {currentMission.title}
          </h1>
        </div>
        <div className="ml-auto">
          <Button 
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={showHelpScreen}
          >
            <HelpCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="card-cyber p-6 mb-8">
        <p className="text-lg mb-6">{currentMission.description}</p>
        
        {currentMission.context && (
          <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2 text-cyber-purple">Contexto Adicional:</h3>
            <p>{currentMission.context}</p>
          </div>
        )}
        
        <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4">
          <h3 className="font-bold mb-2 text-cyber-blue">Instrução da Missão:</h3>
          <p>{currentMission.instruction}</p>
        </div>
      </div>

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
        <div className="card-cyber p-6 mb-8 bg-cyber-purple/10">
          <h3 className="font-bold mb-2 text-cyber-purple">Avaliação da IA:</h3>
          <div className="whitespace-pre-wrap">{evaluation}</div>
          
          {elementsCount !== undefined && (
            <div className="mt-4 flex items-center">
              <span className="font-bold mr-2">Elementos válidos:</span> 
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center 
                      ${i < elementsCount ? 'bg-cyber-purple text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {score !== undefined && (
            <div className="mt-2">
              <span className="font-bold">Pontuação:</span> {score}/10
              {score < MINIMUM_SCORE && (
                <div className="mt-2 flex items-center text-amber-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span>Pontuação mínima necessária: {MINIMUM_SCORE}/10</span>
                </div>
              )}
            </div>
          )}
        </div>
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
              Avaliando...
            </>
          ) : (
            'Avaliar com IA'
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
