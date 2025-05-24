import React from "react";
import { GameProvider } from "@/contexts/GameContext";
import GameContainer from "@/components/GameContainer";
const Index = () => {
  return <GameProvider>
      <div className="min-h-screen steampunk-bg bg-fixed rounded-none bg-zinc-200">
        <GameContainer />
      </div>
    </GameProvider>;
};
export default Index;