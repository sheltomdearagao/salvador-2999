
import React from 'react';
import { Mission } from '@/types/game';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';

interface MissionHeaderProps {
  mission: Mission;
  onBack: () => void;
  onHelp: () => void;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({ mission, onBack, onHelp }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button 
        variant="outline" 
        size="icon"
        className="rounded-full"
        onClick={onBack}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div>
        <h2 className="text-sm text-cyber-orange font-medium">{mission.zone}</h2>
        <h1 className="text-3xl md:text-4xl font-bold cyber-heading">
          {mission.title}
        </h1>
      </div>
      <div className="ml-auto">
        <Button 
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={onHelp}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MissionHeader;
