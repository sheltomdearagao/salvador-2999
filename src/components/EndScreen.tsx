
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Trophy, Star, BarChart2 } from 'lucide-react';

const EndScreen: React.FC = () => {
  const { resetGame, gameState } = useGame();
  const { selectedCharacter, missionScores, totalScore } = gameState;

  const getAchievementRank = () => {
    const avgScore = totalScore / Object.keys(missionScores).length;
    
    if (avgScore >= 9) return { title: "Mestre Intervencionista", color: "text-amber-500" };
    if (avgScore >= 8) return { title: "Agente de Mudança Elite", color: "text-cyber-blue" };
    if (avgScore >= 7) return { title: "Intervencionista Experiente", color: "text-cyber-purple" };
    if (avgScore >= 6) return { title: "Interventor Competente", color: "text-emerald-500" };
    return { title: "Interventor Iniciante", color: "text-slate-400" };
  };

  const achievement = getAchievementRank();
  const completedMissions = Object.keys(missionScores).length;
  const maxPossibleScore = completedMissions * 10;
  const scorePercentage = (totalScore / maxPossibleScore) * 100;

  return (
    <div className="py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="mb-10">
        <Trophy className="w-20 h-20 mx-auto text-cyber-orange mb-4" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold cyber-heading mb-6">
          Jornada Completa!
        </h1>
        
        <p className="text-xl mb-8">
          Você completou sua missão como{' '}
          <span className="font-bold">{selectedCharacter?.name}</span> e agora Salvador 
          tem uma chance de construir um futuro melhor!
        </p>
      </div>

      <div className="card-cyber p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
          <Star className="h-6 w-6 text-cyber-orange" />
          Sua Pontuação Final
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div className="text-5xl font-bold mb-2">{totalScore}/{maxPossibleScore}</div>
          <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-cyber-gradient h-4 rounded-full" 
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600">
            {scorePercentage.toFixed(1)}% de aproveitamento
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Detalhamento por Missão
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(missionScores).map(([missionId, score]) => {
              const mission = gameState.missions.find(m => m.id === missionId);
              return (
                <div key={missionId} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <span className="font-medium">{mission?.title}</span>
                  <span className={`font-bold ${score >= 8 ? 'text-cyber-purple' : score >= 6 ? 'text-cyber-blue' : 'text-gray-600'}`}>
                    {score}/10
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 p-4 rounded-lg bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10">
          <h3 className="text-xl font-bold mb-2">Seu Título:</h3>
          <p className={`text-2xl font-bold ${achievement.color}`}>
            {achievement.title}
          </p>
        </div>

        <p className="text-lg">
          Suas intervenções criaram um impacto significativo na Salvador de 2999. 
          O futuro da cidade agora tem novas possibilidades graças à sua visão e ações.
        </p>
      </div>

      <Button 
        onClick={resetGame}
        className="btn-cyber px-8 py-4 text-lg"
      >
        Iniciar Nova Jornada
      </Button>
    </div>
  );
};

export default EndScreen;
