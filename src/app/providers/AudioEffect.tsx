import { useEffect } from 'react';
import { events } from '../../services/events';
import { audio } from '../../services/audio';
import { useSettings } from '../../state/settings';

export function AudioEffect() {
  const soundEnabled = useSettings((s) => s.soundEnabled);
  const volume = useSettings((s) => s.volume);
  const bgm = useSettings((s) => s.bgm);
  useEffect(() => {
    audio.setVolume(soundEnabled ? volume : 0);
    // Start BGM only after a user gesture per browser autoplay policies
    const startOnGesture = async () => {
      await audio.initialize();
      if (soundEnabled) audio.play(bgm);
      window.removeEventListener('pointerdown', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
    };
    window.addEventListener('pointerdown', startOnGesture, { once: true });
    window.addEventListener('keydown', startOnGesture, { once: true });
    const unsubs = [
      events.on('deal', async () => { await audio.initialize(); if (soundEnabled) audio.play('deal'); }),
      events.on('playCard', async () => { await audio.initialize(); if (soundEnabled) audio.play('trick'); }),
      events.on('trickWon', async () => {
        await audio.initialize();
        if (soundEnabled) audio.play('trick');
      }),
      events.on('handEnd', async () => {
        await audio.initialize();
        if (soundEnabled) audio.play('hand');
      }),
    ];
    return () => {
      unsubs.forEach((u) => u());
      window.removeEventListener('pointerdown', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
    };
  }, [soundEnabled, volume, bgm]);
  return null;
}


