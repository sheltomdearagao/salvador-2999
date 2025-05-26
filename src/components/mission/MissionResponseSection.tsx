
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface MissionResponseSectionProps {
  response: string;
  onResponseChange: (value: string) => void;
}

const MissionResponseSection: React.FC<MissionResponseSectionProps> = ({
  response,
  onResponseChange
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 md:mb-6">
      <h3 className="font-bold mb-2 md:mb-3 text-zinc-100 text-lg md:text-2xl">
        Sua Proposta de Intervenção:
      </h3>
      <Textarea
        value={response}
        onChange={(e) => onResponseChange(e.target.value)}
        placeholder="Digite sua proposta aqui... Lembre-se de incluir: agente, ação, modo, finalidade e detalhamento."
        className={`${isMobile ? 'min-h-[150px]' : 'min-h-[200px]'} p-3 md:p-4 bg-white border-2 border-gray-200 text-slate-800 text-sm md:text-base focus:border-cyber-blue`}
      />
      <div className="text-right text-xs md:text-sm mt-1 md:mt-2 text-slate-600">
        {response.length}/1000 caracteres
      </div>
    </div>
  );
};

export default MissionResponseSection;
