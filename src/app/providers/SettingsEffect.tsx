import { useEffect } from 'react';
import { useSettings } from '../../state/settings';

export function SettingsEffect() {
  const s = useSettings();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ui-scale', String(s.textScale));
    root.dataset.highContrast = String(s.highContrast);
    root.dataset.colorBlind = s.colorBlind;
    root.dataset.showSeatLabels = String(s.showSeatLabels);
    root.dataset.tableTheme = s.tableTheme;
    if (s.reducedMotion) {
      root.style.setProperty('scroll-behavior', 'auto');
    }
  }, [s.colorBlind, s.highContrast, s.reducedMotion, s.textScale, s.showSeatLabels, s.tableTheme]);
  return null;
}


