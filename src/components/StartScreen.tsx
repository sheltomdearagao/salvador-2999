import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { characters } from '@/data/gameData';
const StartScreen: React.FC = () => {
  const {
    gameState,
    selectCharacter,
    startGame
  } = useGame();
  const handleStartClick = () => {
    if (gameState.selectedCharacter) {
      startGame();
    } else {
      document.getElementById('character-selection')?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 cyber-heading">
        Salvador 2999
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-700">
        Crônicas da Última Cidade
      </h2>
      
      <div className="max-w-2xl mx-auto mb-12 card-cyber p-6">
        <p className="mb-6 text-lg text-slate-700">O ano é 2999. A cidade de Salvador entrou em colapso. Desigualdade, exclusão e abandono criaram zonas isoladas onde cada morador sobrevive como pode.</p>
        
        <p className="mb-6 text-lg font-semibold text-cyber-purple">
          Uma antiga profecia anuncia:
          <br />
          <span className="italic">"Seis decisões moldarão o fim... ou o início."</span>
        </p>
        
        <p className="text-lg text-slate-700">
          Você é parte de uma equipe que tentará salvar o que restou. Mas sua arma será a escrita. Seu poder: argumentar.
        </p>
      </div>
      
      <Button className="btn-cyber text-xl" onClick={handleStartClick}>
        {gameState.selectedCharacter ? "Começar a Jornada" : "Escolher Personagem"}
      </Button>
      
      {!gameState.selectedCharacter && <div id="character-selection" className="pt-20">
          <CharacterSelectionSection />
        </div>}
    </div>;
};
const CharacterSelectionSection: React.FC = () => {
  const {
    gameState,
    selectCharacter
  } = useGame();
  return <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-center text-zinc-200">Escolha seu Personagem</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {characters.map(character => <div key={character.id} className={`character-card ${gameState.selectedCharacter?.id === character.id ? 'character-card-active' : 'character-card-inactive'}`} onClick={() => selectCharacter(character)}>
            <div className="relative h-72 overflow-hidden bg-gray-100">
              <img src={character.imagePath} alt={character.name} className="w-full h-full object-contain object-center" />
            </div>
            <div className="p-4 bg-white">
              <h4 className="font-bold text-lg text-slate-800">{character.name}</h4>
              <p className="text-sm text-slate-600">{character.description}</p>
            </div>
          </div>)}
      </div>
      {gameState.selectedCharacter && <div className="flex justify-center mt-8">
          <Button className="btn-cyber" onClick={() => document.getElementById('top')?.scrollIntoView({
        behavior: 'smooth'
      })}>
            Continuar com {gameState.selectedCharacter.name}
          </Button>
        </div>}
    </div>;
};
export default StartScreen;