
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionActionsProps {
  onEvaluate: () => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  isEvaluated: boolean;
  response: string;
  score?: number;
  elementsCount?: number;
  minimumScore: number;
  minimumElements: number;
}

const MissionActions: React.FC<MissionActionsProps> = memo(({
  onEvaluate,
  onSubmit,
  isEvaluating,
  isEvaluated,
  response,
  score,
  elementsCount,
  minimumScore,
  minimumElements
}) => {
  const isMobile = useIsMobile();
  
  const isSubmitDisabled = !isEvaluated || 
    !response.trim() || 
    (score !== undefined && score < minimumScore) || 
    (elementsCount !== undefined && elementsCount < minimumElements);

  const isEvaluateDisabled = isEvaluating || !response.trim();

  return (
    <motion.div 
      className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8" 
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        className="bg-cyber-purple hover:bg-cyber-purple/80 text-white font-medium py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg transition-all duration-300 text-sm md:text-base w-full" 
        onClick={onEvaluate} 
        disabled={isEvaluateDisabled}
        aria-label={isEvaluating ? 'Consultando especialista...' : 'Consultar especialista'}
      >
        {isEvaluating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isMobile ? 'Consultando...' : 'Consultando o especialista...'}
          </>
        ) : (
          isMobile ? 'Consultar especialista' : 'Consultar o especialista'
        )}
      </Button>
      
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitDisabled}
        className="bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-lg transition-all duration-300 text-sm md:text-base w-full"
        aria-label="Enviar proposta e continuar"
      >
        {isMobile ? 'Enviar e continuar' : 'Enviar proposta e continuar'}
      </Button>
    </motion.div>
  );
});

MissionActions.displayName = 'MissionActions';

export default MissionActions;
