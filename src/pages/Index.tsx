
import React from "react";
import { GameProvider } from "@/contexts/GameContext";
import GameContainer from "@/components/GameContainer";

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-100">
        <GameContainer />
      </div>
    </GameProvider>
  );
};

export default Index;
