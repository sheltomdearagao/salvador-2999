import React from 'react';
import { Mission } from '@/types/game';
import { motion } from "framer-motion";
interface MissionContentProps {
  mission: Mission;
}
const MissionContent: React.FC<MissionContentProps> = ({
  mission
}) => {
  return <motion.div className="card-cyber p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }}>
      <p className="text-base sm:text-lg mb-6 text-slate-800 text-justify">{mission.description}</p>
      
      {mission.context && <div className="bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-2 text-cyber-purple">Contexto Adicional:</h3>
          <p className="text-slate-800 text-justify">{mission.context}</p>
        </div>}
      
      <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-2 text-cyber-blue">Instrução da Missão:</h3>
        <p className="text-slate-800">{mission.instruction}</p>
      </div>

      <div className="bg-green-100 border border-green-300 rounded-lg p-4">
        <h3 className="font-bold mb-2 text-green-700">Lembre-se:</h3>
        <p className="text-slate-800">Uma proposta de intervenção completa deve conter cinco elementos:</p>
        <ul className="list-disc ml-5 mt-2 text-slate-800">
          <li><strong>Ação</strong> (O quê?) - O que deve ser feito para solucionar o problema</li>
          <li><strong>Agente</strong> (Quem?) - Quem será o responsável por executar a ação</li>
          <li><strong>Modo/Meio</strong> (Como?) - De que maneira ou através de qual recurso a ação será realizada</li>
          <li><strong>Efeito</strong> (Para quê?) - Finalidade ou resultado esperado da ação</li>
          <li><strong>Detalhamento</strong> - Informação adicional sobre algum dos elementos anteriores</li>
        </ul>
      </div>
    </motion.div>;
};
export default MissionContent;