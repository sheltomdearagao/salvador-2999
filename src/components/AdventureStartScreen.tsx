import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
const AdventureStartScreen: React.FC = () => {
  const {
    gameState,
    setCurrentScreen
  } = useGame();
  const {
    selectedCharacter
  } = gameState;
  if (!selectedCharacter) {
    return <div className="text-center py-16">Carregando...</div>;
  }
  const handleStartAdventure = () => {
    setCurrentScreen("missionMap");
  };
  const handleBack = () => {
    setCurrentScreen("characterSelection");
  };
  return <div className="py-8 max-w-4xl mx-auto px-4">
      <Button variant="outline" size="icon" className="rounded-full mb-8" onClick={handleBack}>
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <div className="text-center mb-10">
        <h1 className="text-3xl cyber-heading mb-6 font-bold text-zinc-200 md:text-6xl">
          A Jornada Começa
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-white">
          {selectedCharacter.name}, em 2999, Salvador aguarda pela sua intervenção. 
          Suas decisões podem mudar o destino da última cidade... ou destruí-la para sempre!
        </p>
      </div>

      <div className="card-cyber p-6 flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="character-portrait w-full md:w-1/3">
          <div className="relative pb-[123%] rounded-lg overflow-hidden bg-gray-100">
            <img src={selectedCharacter.imagePath} alt={selectedCharacter.name} className="absolute inset-0 w-full h-full object-contain object-center" />
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-cyber-purple mb-4">
            {selectedCharacter.name}
          </h2>
          <p className="mb-6">{selectedCharacter.description}</p>
          
          <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2 text-cyber-blue">Habilidade Especial:</h3>
            <p>{selectedCharacter.specialSkill}</p>
          </div>
          
          <p className="italic text-cyber-purple">
            "Seis decisões moldarão o início de uma nova era... ou o fim de todas."
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button className="btn-cyber px-8 py-6 text-xl" onClick={handleStartAdventure}>
          Iniciar Aventura
        </Button>
      </div>
    </div>;
};
export default AdventureStartScreen;