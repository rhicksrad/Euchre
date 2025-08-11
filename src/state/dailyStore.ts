import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getTodayId } from '../services/daily';

type DailyState = {
  completed: Record<string, boolean>;
  euchresThisGame: number;
  markCompleted: (id: string) => void;
  trackHandEnd: (payload: { makersTeam: 'NS' | 'EW'; defendersWonTricks: number }) => void;
  trackGameEnd: (payload: { winnerTeam: 'NS' | 'EW' }) => void;
  resetGameRun: () => void;
  isCompletedToday: () => boolean;
};

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      completed: {},
      euchresThisGame: 0,
      markCompleted: (id) => set((s) => ({ completed: { ...s.completed, [id]: true } })),
      trackHandEnd: ({ makersTeam, defendersWonTricks }) => {
        const playerTeam: 'NS' | 'EW' = 'NS';
        const defendersTeam: 'NS' | 'EW' = makersTeam === 'NS' ? 'EW' : 'NS';
        if (defendersWonTricks >= 3 && defendersTeam === playerTeam) {
          set((s) => ({ euchresThisGame: s.euchresThisGame + 1 }));
        }
      },
      trackGameEnd: ({ winnerTeam }) => {
        const id = getTodayId();
        const { euchresThisGame } = get();
        const playerTeam: 'NS' | 'EW' = 'NS';
        if (winnerTeam === playerTeam && euchresThisGame >= 2) {
          set((s) => ({ completed: { ...s.completed, [id]: true } }));
        }
        set({ euchresThisGame: 0 });
      },
      resetGameRun: () => set({ euchresThisGame: 0 }),
      isCompletedToday: () => {
        const id = getTodayId();
        return Boolean(get().completed[id]);
      },
    }),
    {
      name: 'daily-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


