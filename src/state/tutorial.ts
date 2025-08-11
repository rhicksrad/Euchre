import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type TutorialStep = 'off' | 'deal' | 'bidding' | 'playing' | 'scoring' | 'done';

type TutorialState = {
  enabled: boolean;
  step: TutorialStep;
  start: () => void;
  next: () => void;
  setStep: (s: TutorialStep) => void;
  finish: () => void;
  reset: () => void;
  setEnabled: (v: boolean) => void;
};

export const useTutorial = create<TutorialState>()(
  persist(
    (set) => ({
      enabled: true,
      step: 'deal',
      start: () => set({ enabled: true, step: 'deal' }),
      next: () => set((s) => ({ step: s.step === 'deal' ? 'bidding' : s.step === 'bidding' ? 'playing' : s.step === 'playing' ? 'scoring' : 'done' })),
      setStep: (step) => set({ step }),
      finish: () => set({ enabled: false, step: 'done' }),
      reset: () => set({ enabled: true, step: 'deal' }),
      setEnabled: (v) => set({ enabled: v }),
    }),
    {
      name: 'tutorial-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


