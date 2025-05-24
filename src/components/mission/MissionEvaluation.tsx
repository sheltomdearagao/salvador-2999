
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
  // Função para renderizar o texto da avaliação preservando a formatação
  const renderEvaluation = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Títulos com ##
        if (line.startsWith('## ')) {
          return (
            <h4 key={index} className="font-bold text-lg text-cyber-purple mt-4 mb-2">
              {line.replace('## ', '')}
            </h4>
          );
        }
        
        // Texto em negrito **texto**
        if (line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={index} className="mb-2">
              {parts.map((part, partIndex) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                }
                return part;
              })}
            </p>
          );
        }
        
        // Listas que começam com -
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-1 list-disc">
              {line.replace('- ', '')}
            </li>
          );
        }
        
        // Texto normal
        if (line.trim()) {
          return <p key={index} className="mb-2">{line}</p>;
        }
        
        return <br key={index} />;
      });
  };

  return (
    <motion.div 
      className="card-cyber p-6 mb-8 bg-white shadow-lg border-l-4 border-l-cyber-purple" 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-bold mb-4 text-cyber-purple text-xl">Avaliação do Especialista:</h3>
      
      <div className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border">
        {renderEvaluation(evaluation)}
      </div>
      
      {elementsCount !== undefined && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <span className="font-bold text-slate-800 text-lg">Elementos válidos:</span> 
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md font-bold
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
        <div className="mt-4">
          <span className="font-bold text-slate-800 text-lg">Pontuação:</span>{" "}
          <span className="text-2xl font-bold text-cyber-purple">{score}/200</span>
          {score < (minimumScore * 20) && (
            <div className="mt-4 flex items-center bg-amber-50 p-4 rounded-lg border border-amber-200">
              <AlertTriangle className="mr-3 h-6 w-6 text-amber-500" />
              <span className="text-amber-700 font-medium">
                Pontuação mínima necessária: {minimumScore * 20}/200
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MissionEvaluation;
