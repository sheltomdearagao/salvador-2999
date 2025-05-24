
import React from 'react';
import { Mission } from '@/types/game';
import { motion } from "framer-motion";
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionContentProps {
  mission: Mission;
}

const MissionContent: React.FC<MissionContentProps> = ({ mission }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className="card-cyber p-3 md:p-6 mb-4 md:mb-8 shadow-lg" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-sm md:text-lg mb-4 md:mb-6 text-slate-800 text-justify leading-relaxed">
        {mission.description}
      </p>
      
      {mission.context && (
        <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <h3 className="font-bold mb-2 text-cyber-purple text-sm md:text-base">
            Contexto Adicional:
          </h3>
          <p className="text-slate-800 text-justify text-sm md:text-base leading-relaxed">
            {mission.context}
          </p>
        </div>
      )}
      
      <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
        <h3 className="font-bold mb-2 text-cyber-blue text-sm md:text-base">
          Instrução da Missão:
        </h3>
        <p className="text-slate-800 text-sm md:text-base leading-relaxed">
          {mission.instruction}
        </p>
      </div>

      <div className="bg-green-100 border border-green-300 rounded-lg p-3 md:p-4">
        <h3 className="font-bold mb-2 text-green-700 text-sm md:text-base">
          Lembre-se:
        </h3>
        <p className="text-slate-800 text-sm md:text-base mb-2">
          Uma proposta de intervenção completa deve conter cinco elementos:
        </p>
        <ul className="list-disc ml-4 md:ml-5 mt-2 text-slate-800 space-y-1">
          <li className="text-xs md:text-sm">
            <strong>Ação</strong> (O quê?) - O que deve ser feito para solucionar o problema
          </li>
          <li className="text-xs md:text-sm">
            <strong>Agente</strong> (Quem?) - Quem será o responsável por executar a ação
          </li>
          <li className="text-xs md:text-sm">
            <strong>Modo/Meio</strong> (Como?) - De que maneira ou através de qual recurso a ação será realizada
          </li>
          <li className="text-xs md:text-sm">
            <strong>Efeito</strong> (Para quê?) - Finalidade ou resultado esperado da ação
          </li>
          <li className="text-xs md:text-sm">
            <strong>Detalhamento</strong> - Informação adicional sobre algum dos elementos anteriores
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default MissionContent;
