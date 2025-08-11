import { create } from 'zustand';

type Difficulty = 'Casual' | 'Standard' | 'Shark';

type AppState = {
  seed: string;
  difficulty: Difficulty;
  setSeed: (seed: string) => void;
  setDifficulty: (d: Difficulty) => void;
};

export const useAppStore = create<AppState>((set) => ({
  seed: 'lodge-0001',
  difficulty: 'Standard',
  setSeed: (seed) => set({ seed }),
  setDifficulty: (difficulty) => set({ difficulty }),
}));


