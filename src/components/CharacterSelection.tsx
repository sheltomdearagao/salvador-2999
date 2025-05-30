
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { characters } from '@/data/gameData';
import { ArrowLeft, User, Star } from 'lucide-react';

const CharacterSelection: React.FC = () => {
  const {
    gameState,
    selectCharacter,
    startGame,
    setCurrentScreen
  } = useGame();

  const handleBack = () => {
    setCurrentScreen('start');
  };

  return (
    <div className="py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="icon" className="rounded-full mr-4 bg-white/80 hover:bg-white" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <h1 className="text-3xl font-bold cyber-heading text-zinc-200 md:text-4xl">
          Escolha seu Personagem
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {characters.map(character => (
          <div 
            key={character.id} 
            className={`character-card ${gameState.selectedCharacter?.id === character.id ? 'character-card-active' : 'character-card-inactive'}`} 
            onClick={() => selectCharacter(character)}
          >
            <div className="relative h-72 overflow-hidden bg-gray-100">
              <img src={character.imagePath} alt={character.name} className="w-full h-full object-contain object-center" />
              {gameState.selectedCharacter?.id === character.id && (
                <div className="absolute inset-0 bg-cyber-purple/20 flex items-center justify-center">
                  <div className="bg-cyber-purple text-white rounded-full p-2">
                    <User className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-white">
              <h4 className="font-bold text-xl text-slate-800 mb-2">{character.name}</h4>
              <p className="text-slate-600 mb-3 text-sm leading-relaxed">{character.description}</p>
              <div className="text-sm bg-cyber-blue/10 p-3 rounded-md border border-cyber-blue/30">
                <div className="flex items-center text-cyber-blue mb-1">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="font-semibold">Habilidade especial:</span>
                </div>
                <p className="text-slate-700">{character.specialSkill}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button className="btn-cyber text-lg px-8 py-3" onClick={startGame} disabled={!gameState.selectedCharacter}>
          {gameState.selectedCharacter ? `Seguir com ${gameState.selectedCharacter.name}` : 'Selecione um personagem'}
        </Button>
      </div>
    </div>
  );
};

export default CharacterSelection;
