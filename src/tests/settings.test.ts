import { describe, it, expect } from 'vitest';
import { useSettings } from '../state/settings';

describe('Settings persistence', () => {
  it('saves and loads color-blind mode', () => {
    useSettings.getState().setColorBlind('deuteranopia');
    const stored = useSettings.getState().colorBlind;
    expect(stored).toBe('deuteranopia');
  });
});


