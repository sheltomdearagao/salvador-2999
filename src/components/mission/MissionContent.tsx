
import React from 'react';
import { Mission } from '@/types/game';
import { motion } from "framer-motion";

interface MissionContentProps {
  mission: Mission;
}

const MissionContent: React.FC<MissionContentProps> = ({ mission }) => {
  return (
    <motion.div 
      className="card-cyber p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-base sm:text-lg mb-6 text-slate-800">{mission.description}</p>
      
      {mission.context && (
        <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2 text-cyber-purple">Contexto Adicional:</h3>
          <p className="text-slate-800">{mission.context}</p>
        </div>
      )}
      
      <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-cyber-blue">Instrução da Missão:</h3>
        <p className="text-slate-800">{mission.instruction}</p>
      </div>
    </motion.div>
  );
};

export default MissionContent;
