import { describe, expect, it } from 'vitest';
import { PRNG } from '../utils/prng';

describe('PRNG', () => {
  it('produces deterministic sequence for same seed', () => {
    const a = new PRNG('seed');
    const b = new PRNG('seed');
    const seqA = Array.from({ length: 5 }, () => a.next());
    const seqB = Array.from({ length: 5 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('nextInt respects inclusive bounds', () => {
    const rng = new PRNG(123);
    for (let i = 0; i < 100; i += 1) {
      const n = rng.nextInt(0, 3);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(3);
    }
  });

  it('shuffleInPlace permutes array elements', () => {
    const rng = new PRNG(42);
    const data = [1, 2, 3, 4, 5, 6];
    const copy = [...data];
    rng.shuffleInPlace(copy);
    expect(copy.sort()).toEqual(data);
  });
});


