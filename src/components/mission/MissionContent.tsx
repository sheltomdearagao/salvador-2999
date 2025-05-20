
import React from 'react';
import { Mission } from '@/types/game';

interface MissionContentProps {
  mission: Mission;
}

const MissionContent: React.FC<MissionContentProps> = ({ mission }) => {
  return (
    <div className="card-cyber p-6 mb-8">
      <p className="text-lg mb-6">{mission.description}</p>
      
      {mission.context && (
        <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2 text-cyber-purple">Contexto Adicional:</h3>
          <p>{mission.context}</p>
        </div>
      )}
      
      <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-cyber-blue">Instrução da Missão:</h3>
        <p>{mission.instruction}</p>
      </div>
    </div>
  );
};

export default MissionContent;
