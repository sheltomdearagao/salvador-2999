
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { characters } from '@/data/gameData';
import { ArrowLeft, User, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CharacterSelection: React.FC = () => {
  const { gameState, selectCharacter, startGame, setCurrentScreen } = useGame();
  
  const handleBack = () => {
    setCurrentScreen('start');
  };

  const characterVariants = {
    inactive: { scale: 0.95, opacity: 0.7 },
    active: { scale: 1, opacity: 1 },
    hover: { scale: 1.03, opacity: 1 }
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
        
        <h1 className="text-3xl md:text-4xl font-bold cyber-heading text-white">
          Escolha seu Personagem
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {characters.map((character) => (
          <motion.div
            key={character.id}
            className={`character-card overflow-hidden ${
              gameState.selectedCharacter?.id === character.id
                ? 'character-card-active'
                : 'character-card-inactive'
            }`}
            onClick={() => selectCharacter(character)}
            initial="inactive"
            animate={gameState.selectedCharacter?.id === character.id ? "active" : "inactive"}
            whileHover="hover"
            variants={characterVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative pb-[100%] overflow-hidden">
              <img
                src={character.imagePath}
                alt={character.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300"
              />
              {gameState.selectedCharacter?.id === character.id && (
                <div className="absolute inset-0 bg-cyber-purple/20 flex items-center justify-center">
                  <div className="bg-cyber-purple text-white rounded-full p-2">
                    <User className="h-8 w-8" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-parchment">
              <h4 className="font-bold text-xl">{character.name}</h4>
              <p className="mb-2">{character.description}</p>
              <div className="text-sm italic bg-cyber-blue/10 p-3 rounded-md border border-cyber-blue/30">
                <div className="flex items-center text-cyber-blue mb-1">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="font-semibold">Habilidade especial:</span>
                </div>
                <p>{character.specialSkill}</p>
              </div>
            </div>
          </motion.div>
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
