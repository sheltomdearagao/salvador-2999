
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import StartScreen from './StartScreen';
import CharacterSelection from './CharacterSelection';
import AdventureStartScreen from './AdventureStartScreen';
import MissionMap from './MissionMap';
import Mission from './Mission';
import HelpScreen from './HelpScreen';
import EndScreen from './EndScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();
  const { currentScreen } = gameState;

  return (
    <div className="game-container">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] pointer-events-none"></div>
      <div className="relative z-10">
        {currentScreen === 'start' && <StartScreen />}
        {currentScreen === 'characterSelection' && <CharacterSelection />}
        {currentScreen === 'adventureStart' && <AdventureStartScreen />}
        {currentScreen === 'missionMap' && <MissionMap />}
        {currentScreen === 'mission' && <Mission />}
        {currentScreen === 'help' && <HelpScreen />}
        {currentScreen === 'end' && <EndScreen />}
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 bg-black/50 mt-8 text-center">
        <p className="text-sm text-white mb-2">
          Salvador 2999: Crônicas da Última Cidade - Criado pelo Professor Sheltom de Aragão
        </p>
        <a 
          href="https://profsheltom.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-cyber-purple/80 hover:bg-cyber-purple text-white rounded-md transition-colors"
        >
          profsheltom.com.br
        </a>
      </footer>
    </div>
  );
};

export default GameContainer;
