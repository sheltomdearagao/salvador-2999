
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import MissionCard from './mission/MissionCard';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const MissionMap: React.FC = () => {
  const {
    gameState,
    selectMission,
    showHelpScreen,
    setCurrentScreen
  } = useGame();

  const { missions, selectedCharacter } = gameState;
  const isMobile = useIsMobile();

  const handleBack = () => {
    setCurrentScreen('adventureStart');
  };

  const handleSelectMission = (mission) => {
    selectMission(mission);
  };

  return (
    <motion.div 
      className="py-2 md:py-8 px-2 md:px-6 lg:px-8 max-w-7xl mx-auto" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="flex items-start gap-3 md:gap-4">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "icon"} 
            className="rounded-full shadow-md hover:bg-cyber-purple/10 transition-all bg-white/90 shrink-0 mt-1" 
            onClick={handleBack}
          >
            <ArrowLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-700`} />
            {isMobile && <span className="ml-1 text-xs">Voltar</span>}
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 md:mb-2 cyber-heading-dark text-zinc-300 leading-tight">
              Mapa de Salvador 2999
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-zinc-200 leading-relaxed">
              Selecione uma zona para iniciar sua missão, {selectedCharacter?.name}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "icon"} 
            className="rounded-full shadow-md hover:bg-cyber-blue/10 transition-all bg-white/90 shrink-0 mt-1" 
            onClick={showHelpScreen}
          >
            <HelpCircle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-slate-700`} />
            {isMobile && <span className="ml-1 text-xs">Ajuda</span>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {missions.map((mission) => (
          <motion.div
            key={mission.id}
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <MissionCard 
              mission={mission} 
              onClick={() => handleSelectMission(mission)} 
            />
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-6 md:mt-8 text-center" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="inline-block bg-white/95 p-4 md:p-6 rounded-lg border border-gray-200 shadow-lg max-w-full">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <span className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Progresso da Jornada:
            </span>
            <span className={`${isMobile ? 'text-xl' : 'text-2xl'} font-orbitron text-cyber-purple font-bold`}>
              {gameState.completedMissions} / 6
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-3 md:mb-4">
            <motion.div 
              className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 md:h-3 rounded-full" 
              initial={{ width: 0 }} 
              animate={{ width: `${(gameState.completedMissions / 6) * 100}%` }} 
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          
          {gameState.completedMissions > 0 && (
            <p className={`text-cyber-purple italic font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              Cada decisão molda o futuro de Salvador. Continue sua jornada.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MissionMap;
