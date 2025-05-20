
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { characters } from '@/data/gameData';
import { ArrowLeft } from 'lucide-react';

const CharacterSelection: React.FC = () => {
  const { gameState, selectCharacter, startGame, setCurrentScreen } = useGame();
  
  const handleBack = () => {
    setCurrentScreen('start');
  };
  
  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full mr-4"
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold cyber-heading">
          Escolha seu Personagem
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`character-card ${
              gameState.selectedCharacter?.id === character.id
                ? 'character-card-active'
                : 'character-card-inactive'
            }`}
            onClick={() => selectCharacter(character)}
          >
            <div className="relative pb-[100%] overflow-hidden">
              <img
                src={character.imagePath}
                alt={character.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-4 bg-parchment">
              <h4 className="font-bold text-xl">{character.name}</h4>
              <p className="mb-2">{character.description}</p>
              <p className="text-sm italic">
                <span className="font-semibold">Habilidade especial:</span> {character.specialSkill}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          className="btn-cyber"
          onClick={startGame}
          disabled={!gameState.selectedCharacter}
        >
          {gameState.selectedCharacter ? `Seguir com ${gameState.selectedCharacter.name}` : 'Selecione um personagem'}
        </Button>
      </div>
    </div>
  );
};

export default CharacterSelection;
