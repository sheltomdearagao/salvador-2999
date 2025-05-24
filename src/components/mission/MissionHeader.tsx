import React from 'react';
import { Mission } from '@/types/game';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";
interface MissionHeaderProps {
  mission: Mission;
  onBack: () => void;
  onHelp: () => void;
}
const MissionHeader: React.FC<MissionHeaderProps> = ({
  mission,
  onBack,
  onHelp
}) => {
  return <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <Button variant="outline" size="icon" className="rounded-full shadow-md hover:bg-cyber-purple/10 transition-all bg-white/90" onClick={onBack}>
        <ArrowLeft className="h-5 w-5 text-slate-700" />
      </Button>
      <div className="flex-1">
        <h2 className="text-sm text-cyber-orange font-medium uppercase tracking-wider">{mission.zone}</h2>
        <h1 className="text-2xl sm:text-3xl font-bold cyber-heading-dark text-zinc-200 md:text-4xl">
          {mission.title}
        </h1>
      </div>
      <div className="sm:ml-auto mt-2 sm:mt-0">
        <Button variant="outline" size="icon" className="rounded-full shadow-md hover:bg-cyber-blue/10 transition-all bg-white/90" onClick={onHelp}>
          <HelpCircle className="h-5 w-5 text-slate-700" />
        </Button>
      </div>
    </motion.div>;
};
export default MissionHeader;