
export type Character = {
  id: string;
  name: string;
  imagePath: string;
  description: string;
  specialSkill: string;
};

export type MissionStatus = 'locked' | 'available' | 'completed';

export type Mission = {
  id: string;
  title: string;
  zone: string;
  description: string;
  instruction: string;
  imagePath?: string;
  status: MissionStatus;
};

export type GameScreen = 'start' | 'characterSelection' | 'missionMap' | 'mission' | 'help' | 'end';

export type GameState = {
  currentScreen: GameScreen;
  selectedCharacter: Character | null;
  missions: Mission[];
  currentMission: Mission | null;
  missionResponses: Record<string, string>;
  completedMissions: number;
};

export type GameContextType = {
  gameState: GameState;
  selectCharacter: (character: Character) => void;
  startGame: () => void;
  selectMission: (mission: Mission) => void;
  submitMissionResponse: (missionId: string, response: string) => void;
  showHelpScreen: () => void;
  hideHelpScreen: () => void;
  resetGame: () => void;
};
