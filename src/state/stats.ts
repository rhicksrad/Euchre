import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type StatsState = {
  gamesPlayed: number;
  gamesWonNS: number;
  gamesWonEW: number;
  handsPlayed: number;
  tricksTakenNS: number;
  tricksTakenEW: number;
  euchres: number; // defenders scoring 2
  loneHands: number;
  updateOnHandEnd: (payload: { makersTeam: 'NS' | 'EW'; makersWonTricks: number; defendersWonTricks: number; makersWentAlone: boolean }) => void;
  updateOnGameEnd: (payload: { winnerTeam: 'NS' | 'EW' }) => void;
  reset: () => void;
};

export const useStats = create<StatsState>()(
  persist(
    (set, get) => ({
      gamesPlayed: 0,
      gamesWonNS: 0,
      gamesWonEW: 0,
      handsPlayed: 0,
      tricksTakenNS: 0,
      tricksTakenEW: 0,
      euchres: 0,
      loneHands: 0,
      updateOnHandEnd: ({ makersTeam, makersWonTricks, defendersWonTricks, makersWentAlone }) => {
        set((s) => ({
          handsPlayed: s.handsPlayed + 1,
          tricksTakenNS: s.tricksTakenNS + (makersTeam === 'NS' ? makersWonTricks : defendersWonTricks),
          tricksTakenEW: s.tricksTakenEW + (makersTeam === 'EW' ? makersWonTricks : defendersWonTricks),
          euchres: s.euchres + (defendersWonTricks >= 3 ? 1 : 0),
          loneHands: s.loneHands + (makersWentAlone ? 1 : 0),
        }));
      },
      updateOnGameEnd: ({ winnerTeam }) => {
        set((s) => ({
          gamesPlayed: s.gamesPlayed + 1,
          gamesWonNS: s.gamesWonNS + (winnerTeam === 'NS' ? 1 : 0),
          gamesWonEW: s.gamesWonEW + (winnerTeam === 'EW' ? 1 : 0),
        }));
      },
      reset: () => set({
        gamesPlayed: 0,
        gamesWonNS: 0,
        gamesWonEW: 0,
        handsPlayed: 0,
        tricksTakenNS: 0,
        tricksTakenEW: 0,
        euchres: 0,
        loneHands: 0,
      }),
    }),
    {
      name: 'stats-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


