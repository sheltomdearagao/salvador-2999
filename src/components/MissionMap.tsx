
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft, CheckCircle, LockIcon, Clipboard } from 'lucide-react';
import MissionCard from './mission/MissionCard';

const MissionMap: React.FC = () => {
  const { gameState, selectMission, showHelpScreen, setCurrentScreen } = useGame();
  const { missions, selectedCharacter } = gameState;

  const handleBack = () => {
    setCurrentScreen('adventureStart');
  };

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 cyber-heading">
              Mapa de Salvador 2999
            </h1>
            <p className="text-lg">
              Selecione uma zona para iniciar sua missão, {selectedCharacter?.name}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full self-start md:self-auto"
          onClick={showHelpScreen}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {missions.map((mission) => (
          <MissionCard 
            key={mission.id}
            mission={mission}
            onClick={() => selectMission(mission)}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-block bg-parchment/80 p-4 rounded-lg border border-dark-parchment">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-bold text-lg">Progresso da Jornada:</span>
            <span className="text-xl font-orbitron text-cyber-purple">
              {gameState.completedMissions} / 6
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-cyber-gradient h-2.5 rounded-full"
              style={{width: `${(gameState.completedMissions / 6) * 100}%`}}
            ></div>
          </div>
          
          {gameState.completedMissions > 0 && (
            <p className="text-sm text-cyber-purple italic">
              Cada decisão molda o futuro de Salvador. Continue sua jornada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionMap;
