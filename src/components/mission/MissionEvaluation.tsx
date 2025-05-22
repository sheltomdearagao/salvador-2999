
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from "framer-motion";

interface MissionEvaluationProps {
  evaluation: string;
  elementsCount?: number;
  score?: number;
  minimumScore: number;
}

const MissionEvaluation: React.FC<MissionEvaluationProps> = ({ 
  evaluation, 
  elementsCount, 
  score, 
  minimumScore 
}) => {
  return (
    <motion.div 
      className="card-cyber p-4 sm:p-6 mb-6 sm:mb-8 bg-cyber-purple/10 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold mb-3 text-cyber-purple text-lg">Avaliação do Mestre:</h3>
      <div className="whitespace-pre-wrap text-slate-800">{evaluation}</div>
      
      {elementsCount !== undefined && (
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="font-bold text-slate-800">Elementos válidos:</span> 
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md
                  ${i < elementsCount ? 'bg-cyber-purple text-white' : 'bg-gray-200 text-gray-500'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {score !== undefined && (
        <div className="mt-3">
          <span className="font-bold text-slate-800">Pontuação:</span>{" "}
          <span className="text-lg font-semibold text-cyber-purple">{score}/10</span>
          {score < minimumScore && (
            <div className="mt-3 flex items-center bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
              <span className="text-amber-700">Pontuação mínima necessária: {minimumScore}/10</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MissionEvaluation;
