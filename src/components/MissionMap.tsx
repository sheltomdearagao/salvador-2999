import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import MissionCard from './mission/MissionCard';
import { motion } from 'framer-motion';
const MissionMap: React.FC = () => {
  const {
    gameState,
    selectMission,
    showHelpScreen,
    setCurrentScreen
  } = useGame();
  const {
    missions,
    selectedCharacter
  } = gameState;
  const handleBack = () => {
    setCurrentScreen('adventureStart');
  };
  const handleSelectMission = mission => {
    selectMission(mission);
  };
  return <motion.div className="py-4 sm:py-8 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="icon" className="rounded-full mr-4 shadow-md hover:bg-cyber-purple/10 transition-all bg-white/90" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 cyber-heading-dark text-zinc-300 text-left">
              Mapa de Salvador 2999
            </h1>
            <p className="text-base sm:text-lg text-zinc-200">
              Selecione uma zona para iniciar sua missão, {selectedCharacter?.name}
            </p>
          </div>
        </div>
        
        <Button variant="outline" size="icon" className="rounded-full self-start md:self-auto shadow-md hover:bg-cyber-blue/10 transition-all bg-white/90" onClick={showHelpScreen}>
          <HelpCircle className="h-5 w-5 text-slate-700" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {missions.map(mission => <motion.div key={mission.id} whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} transition={{
        duration: 0.2
      }}>
            <MissionCard mission={mission} onClick={() => handleSelectMission(mission)} />
          </motion.div>)}
      </div>

      <motion.div className="mt-8 text-center" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.5,
      duration: 0.5
    }}>
        <div className="inline-block bg-white/95 p-6 rounded-lg border border-gray-200 shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="font-bold text-xl text-slate-800">Progresso da Jornada:</span>
            <span className="text-2xl font-orbitron text-cyber-purple font-bold">
              {gameState.completedMissions} / 6
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-3 rounded-full" initial={{
            width: 0
          }} animate={{
            width: `${gameState.completedMissions / 6 * 100}%`
          }} transition={{
            duration: 1,
            delay: 0.7
          }}></motion.div>
          </div>
          
          {gameState.completedMissions > 0 && <p className="text-sm text-cyber-purple italic font-medium">
              Cada decisão molda o futuro de Salvador. Continue sua jornada.
            </p>}
        </div>
      </motion.div>
    </motion.div>;
};
export default MissionMap;