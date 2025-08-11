import { create } from 'zustand';
import { events } from '../services/events';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AchievementId =
  | 'welcome' // first completed game
  | 'leftys_best' // win a trick with the left bower
  | 'solo_canoe' // win a lone hand
  | 'clean_sweep' // 5-trick sweep
  | 'mount_marcy' // win by 6+ margin
  | 'trail_tactician' // win 3 games on Shark
  | 'early_bird' // win first trick of the hand
  | 'euchre_hunters' // euchre opponents 3 times total
  | 'dealer_master' // as dealer, win the hand after ordering up
  | 'lucky_left' // win a hand where left bower wins last trick
  | 'ten_point_finish'; // finish game exactly at 10

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  unlockedAt?: number;
};

export const ACHIEVEMENTS: Readonly<Record<AchievementId, Achievement>> = {
  welcome: { id: 'welcome', title: 'Welcome to the Lodge', description: 'Complete your first game.' },
  leftys_best: { id: 'leftys_best', title: "Lefty’s Best", description: 'Win a trick with the left bower.' },
  solo_canoe: { id: 'solo_canoe', title: 'Solo Canoe', description: 'Win a lone hand.' },
  clean_sweep: { id: 'clean_sweep', title: 'Clean Sweep', description: 'Win all 5 tricks.' },
  mount_marcy: { id: 'mount_marcy', title: 'Mount Marcy', description: 'Win by a margin of 6+ points.' },
  trail_tactician: { id: 'trail_tactician', title: 'Trail Tactician', description: 'Win 3 games on Shark.' },
  early_bird: { id: 'early_bird', title: 'Early Bird', description: 'Win the first trick of a hand.' },
  euchre_hunters: { id: 'euchre_hunters', title: 'Euchre Hunters', description: 'Euchre your opponents three times in total.' },
  dealer_master: { id: 'dealer_master', title: 'Dealer’s Choice', description: 'As dealer, order up and win the hand.' },
  lucky_left: { id: 'lucky_left', title: 'Lucky Left', description: 'Win a hand where the left bower wins the last trick.' },
  ten_point_finish: { id: 'ten_point_finish', title: 'Perfect Ten', description: 'Finish a game exactly at 10 points.' },
} as const;

export type AchievementsState = {
  unlocked: Partial<Record<AchievementId, number>>; // timestamp
  unlock: (id: AchievementId) => void;
  isUnlocked: (id: AchievementId) => boolean;
};

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      unlock: (id) => set((state) => {
        if (state.unlocked[id]) return state;
        const now = Date.now();
        // Emit a UI event so we can show a toast
        events.emit('achievement', { id, title: ACHIEVEMENTS[id].title });
        return { unlocked: { ...state.unlocked, [id]: now } };
      }),
      isUnlocked: (id) => Boolean(get().unlocked[id]),
    }),
    { name: 'achievements-v1', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);


