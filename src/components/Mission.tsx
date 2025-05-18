
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, ArrowLeft, Home, Loader2 } from 'lucide-react';
import { useApiKey } from '@/components/ApiKeySetup';
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

const Mission: React.FC = () => {
  const { gameState, submitMissionResponse, showHelpScreen, setCurrentScreen } = useGame();
  const { currentMission, missionResponses } = gameState;
  const [response, setResponse] = useState(
    currentMission ? missionResponses[currentMission.id] || '' : ''
  );
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { apiKey, hasApiKey } = useApiKey();
  const { toast } = useToast();

  if (!currentMission) {
    return <div className="text-center py-16">Carregando missão...</div>;
  }

  const handleSubmit = () => {
    submitMissionResponse(currentMission.id, response);
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

    if (!hasApiKey) {
      toast({
        title: "Chave API não configurada",
        description: "Configure sua chave API OpenAI para usar a avaliação automática.",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const result = await evaluateMissionResponse(
        `${currentMission.description}\n\n${currentMission.instruction}`,
        response,
        apiKey
      );

      if (result.success) {
        setEvaluation(result.evaluation || "");
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
        </div>
      )}

      <div className="flex justify-center gap-4">
        {hasApiKey && (
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
        )}
        
        <Button 
          className="btn-cyber"
          onClick={handleSubmit}
          disabled={!response.trim()}
        >
          Enviar proposta e continuar
        </Button>
      </div>
    </div>
  );
};

export default Mission;
