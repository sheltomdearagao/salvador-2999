
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const MissionMap: React.FC = () => {
  const { gameState, selectMission, showHelpScreen } = useGame();
  const { missions, selectedCharacter } = gameState;

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 cyber-heading">
            Mapa de Salvador 2999
          </h1>
          <p className="text-lg">
            Selecione uma zona para iniciar sua missão, {selectedCharacter?.name}
          </p>
        </div>
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={showHelpScreen}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`mission-card ${
              mission.status === 'locked'
                ? 'mission-locked'
                : mission.status === 'completed'
                ? 'mission-completed'
                : 'mission-available'
            }`}
            onClick={() => selectMission(mission)}
          >
            <div className="bg-parchment p-5 h-full">
              <h3 className="text-xl font-bold mb-2">{mission.title}</h3>
              <div className="mb-3 inline-block px-3 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue text-sm font-semibold">
                {mission.zone}
              </div>
              <p className="line-clamp-3 text-sm mb-4">{mission.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  {mission.status === 'locked' && (
                    <span className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Bloqueada
                    </span>
                  )}
                  {mission.status === 'available' && (
                    <span className="flex items-center text-cyber-blue">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Disponível
                    </span>
                  )}
                  {mission.status === 'completed' && (
                    <span className="flex items-center text-cyber-purple">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Concluída
                    </span>
                  )}
                </div>
                
                {mission.status !== 'locked' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`${mission.status === 'completed' ? 'text-cyber-purple' : 'text-cyber-blue'}`}
                  >
                    {mission.status === 'completed' ? 'Ver detalhes' : 'Iniciar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg mb-4">
          Missões Completadas: {gameState.completedMissions} de 6
        </p>
        {gameState.completedMissions > 0 && (
          <p className="text-sm text-cyber-purple">
            Cada decisão molda o futuro de Salvador. Continue sua jornada.
          </p>
        )}
      </div>
    </div>
  );
};

export default MissionMap;
