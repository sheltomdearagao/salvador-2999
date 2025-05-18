
import React, { createContext, useContext, useState } from "react";
import { Character, GameContextType, GameScreen, GameState, Mission } from "@/types/game";
import { characters, initialMissions } from "@/data/gameData";
import { useToast } from "@/hooks/use-toast";

const initialGameState: GameState = {
  currentScreen: "start",
  selectedCharacter: null,
  missions: initialMissions,
  currentMission: null,
  missionResponses: {},
  completedMissions: 0
};

export const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();

  const selectCharacter = (character: Character) => {
    setGameState((prev) => ({
      ...prev,
      selectedCharacter: character
    }));
  };

  const startGame = () => {
    if (!gameState.selectedCharacter) {
      toast({
        title: "Selecione um personagem",
        description: "Você precisa escolher um personagem para iniciar a jornada.",
        variant: "destructive"
      });
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentScreen: "missionMap"
    }));
  };

  const selectMission = (mission: Mission) => {
    if (mission.status === "locked") {
      toast({
        title: "Missão bloqueada",
        description: "Complete as missões anteriores para desbloquear esta.",
        variant: "destructive"
      });
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentScreen: "mission",
      currentMission: mission
    }));
  };

  const submitMissionResponse = (missionId: string, response: string) => {
    if (!response.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, escreva uma proposta de intervenção antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    // Update mission status
    const updatedMissions = gameState.missions.map((mission) => {
      if (mission.id === missionId) {
        return { ...mission, status: "completed" as const };
      }
      
      // Unlock the next mission if this is the current one being completed
      if (mission.status === "locked" && gameState.currentMission?.id === missionId) {
        const currentIndex = gameState.missions.findIndex(m => m.id === missionId);
        const isNextMission = gameState.missions.indexOf(mission) === currentIndex + 1;
        
        if (isNextMission) {
          return { ...mission, status: "available" as const };
        }
      }
      
      return mission;
    });

    const newCompletedMissions = gameState.completedMissions + 1;
    
    setGameState((prev) => ({
      ...prev,
      missions: updatedMissions,
      missionResponses: {
        ...prev.missionResponses,
        [missionId]: response
      },
      currentMission: null,
      currentScreen: newCompletedMissions >= 6 ? "end" : "missionMap",
      completedMissions: newCompletedMissions
    }));

    toast({
      title: "Proposta registrada",
      description: "Sua intervenção foi registrada com sucesso!",
      variant: "default"
    });
  };

  const showHelpScreen = () => {
    setGameState((prev) => ({
      ...prev,
      currentScreen: "help"
    }));
  };

  const hideHelpScreen = () => {
    setGameState((prev) => ({
      ...prev,
      currentScreen: prev.currentMission ? "mission" : "missionMap"
    }));
  };

  const resetGame = () => {
    setGameState({
      ...initialGameState,
      missions: initialMissions.map((mission, index) => ({
        ...mission,
        status: index === 0 ? "available" : "locked"
      }))
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        selectCharacter,
        startGame,
        selectMission,
        submitMissionResponse,
        showHelpScreen,
        hideHelpScreen,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
