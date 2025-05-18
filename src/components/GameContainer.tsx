
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import StartScreen from './StartScreen';
import CharacterSelection from './CharacterSelection';
import MissionMap from './MissionMap';
import Mission from './Mission';
import HelpScreen from './HelpScreen';
import EndScreen from './EndScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGame();
  const { currentScreen } = gameState;

  return (
    <div className="game-container parchment-bg">
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
      <div className="relative z-10">
        {currentScreen === 'start' && <StartScreen />}
        {currentScreen === 'characterSelection' && <CharacterSelection />}
        {currentScreen === 'missionMap' && <MissionMap />}
        {currentScreen === 'mission' && <Mission />}
        {currentScreen === 'help' && <HelpScreen />}
        {currentScreen === 'end' && <EndScreen />}
      </div>
    </div>
  );
};

export default GameContainer;
