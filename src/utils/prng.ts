/**
 * Seedable pseudo-random number generator using Mulberry32.
 * Deterministic across sessions for the same seed.
 */
export class PRNG {
  private state: number;

  constructor(seed: number | string) {
    this.state = PRNG.hashSeed(seed);
  }

  /** Returns a float in [0, 1). */
  next(): number {
    // Mulberry32
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return result;
  }

  /** Integer in [min, max] inclusive. */
  nextInt(min: number, max: number): number {
    if (!Number.isFinite(min) || !Number.isFinite(max)) throw new Error('Bounds must be finite');
    if (Math.floor(min) !== min || Math.floor(max) !== max) throw new Error('Bounds must be integers');
    if (max < min) throw new Error('max must be >= min');
    const r = this.next();
    return Math.floor(r * (max - min + 1)) + min;
  }

  /** Shuffle array in-place using Fisher-Yates with this PRNG. */
  shuffleInPlace<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = this.nextInt(0, i);
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
    return array;
  }

  static hashSeed(seed: number | string): number {
    if (typeof seed === 'number') {
      const s = seed >>> 0;
      return s === 0 ? 0xdeadbeef : s;
    }
    // xfnv1a 32-bit hash
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0 || 0xdeadbeef;
  }
}


