
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

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen />;
      case 'characterSelection':
        return <CharacterSelection />;
      case 'adventureStart':
        return <AdventureStartScreen />;
      case 'missionMap':
        return <MissionMap />;
      case 'mission':
        return <Mission />;
      case 'help':
        return <HelpScreen />;
      case 'end':
        return <EndScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="game-container">
      <div className="relative z-10 min-h-[85vh]">
        <div className="absolute top-2 right-3 z-20">
          <span className="bg-emerald-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
            Versão Demo
          </span>
        </div>

        <div className="w-full">
          {renderCurrentScreen()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GameContainer;
