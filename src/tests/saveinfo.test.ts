import { describe, it, expect, beforeEach } from 'vitest';
import { getSavedGamePhase } from '../services/saveInfo';

describe('saveInfo', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no save', () => {
    expect(getSavedGamePhase()).toBeNull();
  });

  it('reads phase from persisted state', () => {
    localStorage.setItem('euchre-v1', JSON.stringify({ state: { phase: 'playing' } }));
    expect(getSavedGamePhase()).toBe('playing');
  });
});


