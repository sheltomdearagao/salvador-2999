
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const EndScreen: React.FC = () => {
  const { resetGame, gameState } = useGame();
  const { selectedCharacter } = gameState;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 cyber-heading">
        Salvador Renascerá
      </h1>
      
      <div className="max-w-2xl mx-auto mb-12 card-cyber p-6">
        <p className="mb-6 text-lg">
          Você completou as seis decisões.
          Em meio às ruínas e à resistência, suas palavras construíram novos caminhos.
        </p>
        
        <p className="mb-6 text-lg">
          Salvador ainda pulsa. E o amanhã depende de quem escreve hoje.
        </p>
        
        {selectedCharacter && (
          <div className="mb-8">
            <p className="mb-4 text-lg font-semibold text-cyber-purple">
              Como {selectedCharacter.name}, você ajudou a traçar um novo destino para a cidade.
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyber-purple animate-pulse-glow">
                <img 
                  src={selectedCharacter.imagePath} 
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
        
        <p className="text-lg font-semibold">
          A profecia se cumpriu... mas isso é apenas o começo.
        </p>
      </div>
      
      <Button 
        className="btn-cyber text-xl"
        onClick={resetGame}
      >
        Jogar com outro personagem
      </Button>
    </div>
  );
};

export default EndScreen;
