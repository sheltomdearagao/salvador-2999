
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import StartScreen from './StartScreen';
import CharacterSelection from './CharacterSelection';
import AdventureStartScreen from './AdventureStartScreen';
import MissionMap from './MissionMap';
import Mission from './Mission';
import HelpScreen from './HelpScreen';
import EndScreen from './EndScreen';
import Footer from './layout/Footer';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();
  const { currentScreen } = gameState;

  return (
    <div className="game-container">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-none"></div>
      
      <div className="relative z-10 min-h-[85vh]">
        <div className="absolute top-2 right-3 z-20">
          <span className="bg-emerald-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            Versão Demo
          </span>
        </div>

        <div className="w-full">
          {currentScreen === 'start' && <StartScreen />}
          {currentScreen === 'characterSelection' && <CharacterSelection />}
          {currentScreen === 'adventureStart' && <AdventureStartScreen />}
          {currentScreen === 'missionMap' && <MissionMap />}
          {currentScreen === 'mission' && <Mission />}
          {currentScreen === 'help' && <HelpScreen />}
          {currentScreen === 'end' && <EndScreen />}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GameContainer;
