
import React from "react";
import { GameProvider } from "@/contexts/GameContext";
import GameContainer from "@/components/GameContainer";

const Index = () => {
  return (
    <>
      {/* Preload the background image for better performance */}
      <link
        rel="preload"
        as="image"
        href="/lovable-uploads/836022e2-c450-402d-89af-08fd5a5f0c6f.png"
      />
      
      <GameProvider>
        <div className="min-h-screen relative">
          {/* Optimized background with better mobile performance */}
          <div className="game-background" />
          <GameContainer />
        </div>
      </GameProvider>
    </>
  );
};

export default Index;
