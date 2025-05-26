
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Loader2 } from 'lucide-react';
import MissionHeader from './mission/MissionHeader';
import MissionContent from './mission/MissionContent';
import MissionEvaluation from './mission/MissionEvaluation';
import MissionResponseSection from './mission/MissionResponseSection';
import MissionActions from './mission/MissionActions';
import { motion } from "framer-motion";
import { useMissionLogic } from '@/hooks/useMissionLogic';

const Mission: React.FC = () => {
  const { gameState, showHelpScreen } = useGame();
  const { currentMission } = gameState;
  
  const {
    response,
    setResponse,
    evaluation,
    isEvaluating,
    score,
    elementsCount,
    isEvaluated,
    handleBack,
    handleSubmit,
    handleEvaluate,
    MINIMUM_ELEMENTS
  } = useMissionLogic();

  if (!currentMission) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center py-8 px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Loader2 className="animate-spin h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 text-cyber-purple" />
          <p className="text-base md:text-lg text-cyber-purple">Carregando missão...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-2 md:py-8 px-2 md:px-4 max-w-4xl mx-auto"
    >
      <MissionHeader 
        mission={currentMission} 
        onBack={handleBack} 
        onHelp={showHelpScreen} 
      />

      <MissionContent mission={currentMission} />

      <MissionResponseSection 
        response={response}
        onResponseChange={setResponse}
      />

      {evaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MissionEvaluation 
            evaluation={evaluation}
            elementsCount={elementsCount}
            score={score}
            minimumScore={4}
          />
        </motion.div>
      )}

      <MissionActions
        onEvaluate={handleEvaluate}
        onSubmit={handleSubmit}
        isEvaluating={isEvaluating}
        isEvaluated={isEvaluated}
        response={response}
        score={score}
        elementsCount={elementsCount}
        minimumScore={160}
        minimumElements={MINIMUM_ELEMENTS}
      />
    </motion.div>
  );
};

export default Mission;
