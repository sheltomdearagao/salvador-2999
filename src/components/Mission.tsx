
import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const Mission: React.FC = () => {
  const { gameState, submitMissionResponse, showHelpScreen } = useGame();
  const { currentMission, missionResponses } = gameState;
  const [response, setResponse] = useState(
    currentMission ? missionResponses[currentMission.id] || '' : ''
  );

  if (!currentMission) {
    return <div className="text-center py-16">Carregando missão...</div>;
  }

  const handleSubmit = () => {
    submitMissionResponse(currentMission.id, response);
  };

  return (
    <div className="py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
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

      <div className="flex justify-center">
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
