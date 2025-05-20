
import React from 'react';
import { AlertTriangle } from 'lucide-react';

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
    <div className="card-cyber p-6 mb-8 bg-cyber-purple/10">
      <h3 className="font-bold mb-2 text-cyber-purple">Avaliação do Mestre:</h3>
      <div className="whitespace-pre-wrap">{evaluation}</div>
      
      {elementsCount !== undefined && (
        <div className="mt-4 flex items-center">
          <span className="font-bold mr-2">Elementos válidos:</span> 
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                  ${i < elementsCount ? 'bg-cyber-purple text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {score !== undefined && (
        <div className="mt-2">
          <span className="font-bold">Pontuação:</span> {score}/10
          {score < minimumScore && (
            <div className="mt-2 flex items-center text-amber-600">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Pontuação mínima necessária: {minimumScore}/10</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionEvaluation;
