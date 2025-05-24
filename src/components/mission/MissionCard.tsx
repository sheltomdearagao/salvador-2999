
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
      className={`mission-card rounded-lg overflow-hidden ${
        mission.status === 'locked'
          ? 'mission-locked'
          : mission.status === 'completed'
          ? 'mission-completed border-2 border-cyber-purple/40'
          : 'mission-available hover:shadow-xl transition-all duration-300'
      }`}
      onClick={mission.status !== 'locked' ? onClick : undefined}
    >
      <div className="bg-white p-5 h-full flex flex-col min-h-[280px]">
        <div className="mb-3 inline-block px-3 py-1.5 rounded-full bg-cyber-blue/20 text-cyber-blue text-sm font-semibold w-fit">
          {mission.zone}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-800 leading-tight">{mission.title}</h3>
        <p className="text-sm mb-4 flex-grow text-slate-600 leading-relaxed line-clamp-4">{mission.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <span className={`flex items-center ${statusInfo.textColor} font-medium`}>
              {statusInfo.icon}
              {statusInfo.text}
            </span>
          </div>
          
          {mission.status !== 'locked' && (
            <Button 
              variant="ghost" 
              size="sm"
              className={`${mission.status === 'completed' ? 'text-cyber-purple hover:text-cyber-purple/80' : 'text-cyber-blue hover:text-cyber-blue/80'} transition-colors font-medium`}
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
