import { describe, it, expect } from 'vitest';
import { CHARACTERS } from '../game/characters';
import { PRNG } from '../utils/prng';

describe('Characters', () => {
  it('deterministic NPC shuffling for a seed', () => {
    const seed = 'test-seed';
    const prngA = new PRNG(`${seed}-chars`);
    const prngB = new PRNG(`${seed}-chars`);
    const poolA = prngA.shuffleInPlace([...CHARACTERS]);
    const poolB = prngB.shuffleInPlace([...CHARACTERS]);
    expect(poolA).toEqual(poolB);
  });
});


