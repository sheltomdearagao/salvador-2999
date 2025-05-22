
import React from 'react';
import { Mission } from '@/types/game';
import { Button } from '@/components/ui/button';
import { CheckCircle, LockIcon, Clipboard } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onClick: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onClick }) => {
  const getMissionStatusInfo = () => {
    switch(mission.status) {
      case 'locked':
        return {
          icon: <LockIcon className="h-5 w-5 mr-1" />,
          text: 'Bloqueada',
          textColor: 'text-gray-500'
        };
      case 'available':
        return {
          icon: <Clipboard className="h-5 w-5 mr-1" />,
          text: 'Disponível',
          textColor: 'text-cyber-blue'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 mr-1" />,
          text: 'Concluída',
          textColor: 'text-cyber-purple'
        };
    }
  };
  
  const statusInfo = getMissionStatusInfo();

  return (
    <div
      className={`mission-card rounded-lg overflow-hidden shadow-md ${
        mission.status === 'locked'
          ? 'mission-locked opacity-75'
          : mission.status === 'completed'
          ? 'mission-completed border-2 border-cyber-purple/30'
          : 'mission-available hover:shadow-xl transition-shadow'
      }`}
      onClick={mission.status !== 'locked' ? onClick : undefined}
    >
      <div className="bg-parchment p-4 sm:p-5 h-full flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-slate-800">{mission.title}</h3>
        <div className="mb-3 inline-block px-3 py-1 rounded-full bg-cyber-blue/20 text-cyber-blue text-sm font-semibold">
          {mission.zone}
        </div>
        <p className="line-clamp-3 text-sm mb-4 flex-grow text-slate-700">{mission.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className={`flex items-center ${statusInfo.textColor}`}>
              {statusInfo.icon}
              {statusInfo.text}
            </span>
          </div>
          
          {mission.status !== 'locked' && (
            <Button 
              variant="ghost" 
              size="sm"
              className={`${mission.status === 'completed' ? 'text-cyber-purple hover:text-cyber-purple/80' : 'text-cyber-blue hover:text-cyber-blue/80'} transition-colors`}
            >
              {mission.status === 'completed' ? 'Ver detalhes' : 'Iniciar'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
