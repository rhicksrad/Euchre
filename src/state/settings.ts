import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ColorBlindMode = 'none' | 'deuteranopia' | 'protanopia';

export type SettingsState = {
  colorBlind: ColorBlindMode;
  highContrast: boolean;
  reducedMotion: boolean;
  textScale: number; // 0.9 .. 1.4
  captions: boolean;
  volume: number; // 0..1
  soundEnabled: boolean;
  captionDurationMs: number; // e.g., 2500
  showSeatLabels: boolean;
  showHowTo: boolean;
  tableTheme: 'lakeside' | 'lodge' | 'campfire' | 'winter';
  ambienceEnabled: boolean;
  bgm: 'bg' | 'bg_alt';
  setColorBlind: (m: ColorBlindMode) => void;
  setHighContrast: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setTextScale: (v: number) => void;
  setCaptions: (v: boolean) => void;
  setVolume: (v: number) => void;
  setSoundEnabled: (v: boolean) => void;
  setCaptionDurationMs: (v: number) => void;
  setShowSeatLabels: (v: boolean) => void;
  setShowHowTo: (v: boolean) => void;
  setTableTheme: (t: 'lakeside' | 'lodge' | 'campfire' | 'winter') => void;
  setAmbienceEnabled: (v: boolean) => void;
  setBgm: (v: 'bg' | 'bg_alt') => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      colorBlind: 'none',
      highContrast: false,
      reducedMotion: false,
      textScale: 1,
      captions: true,
      volume: 0.5,
      soundEnabled: true,
      captionDurationMs: 2500,
      showSeatLabels: true,
      showHowTo: false,
      tableTheme: 'lodge',
      ambienceEnabled: false,
      bgm: 'bg',
      setColorBlind: (colorBlind) => set({ colorBlind }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setTextScale: (textScale) => set({ textScale }),
      setCaptions: (captions) => set({ captions }),
      setVolume: (volume) => set({ volume }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setCaptionDurationMs: (captionDurationMs) => set({ captionDurationMs }),
      setShowSeatLabels: (showSeatLabels) => set({ showSeatLabels }),
      setShowHowTo: (showHowTo) => set({ showHowTo }),
      setTableTheme: (tableTheme) => set({ tableTheme }),
      setAmbienceEnabled: (ambienceEnabled) => set({ ambienceEnabled }),
      setBgm: (bgm) => set({ bgm }),
    }),
    {
      name: 'settings-v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


