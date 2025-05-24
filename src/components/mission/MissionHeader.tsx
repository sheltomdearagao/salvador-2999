
import React from 'react';
import { Mission } from '@/types/game';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionHeaderProps {
  mission: Mission;
  onBack: () => void;
  onHelp: () => void;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({
  mission,
  onBack,
  onHelp
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-8" 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Button 
        variant="outline" 
        size={isMobile ? "sm" : "icon"} 
        className="rounded-full shadow-md hover:bg-cyber-purple/10 transition-all bg-white/90 shrink-0" 
        onClick={onBack}
      >
        <ArrowLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-700`} />
        {isMobile && <span className="ml-1 text-xs">Voltar</span>}
      </Button>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-xs md:text-sm text-cyber-orange font-medium uppercase tracking-wider truncate">
          {mission.zone}
        </h2>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold cyber-heading-dark text-zinc-200 leading-tight">
          {mission.title}
        </h1>
      </div>
      
      <div className="sm:ml-auto mt-1 sm:mt-0 shrink-0">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "icon"} 
          className="rounded-full shadow-md hover:bg-cyber-blue/10 transition-all bg-white/90" 
          onClick={onHelp}
        >
          <HelpCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-700`} />
          {isMobile && <span className="ml-1 text-xs">Ajuda</span>}
        </Button>
      </div>
    </motion.div>
  );
};

export default MissionHeader;
