import { describe, expect, it } from 'vitest';
import { __internal } from '../ui/components/ScoreKitty';

describe('ScoreKitty mapping', () => {
  it('maps 0..10 to six/four pips correctly', () => {
    const map = (n: number) => __internal.sixAndFourFromScore(n);
    expect(map(0)).toEqual({ six: 0, four: 0 });
    expect(map(3)).toEqual({ six: 3, four: 0 });
    expect(map(5)).toEqual({ six: 5, four: 0 });
    expect(map(6)).toEqual({ six: 5, four: 1 });
    expect(map(9)).toEqual({ six: 5, four: 4 });
    expect(map(10)).toEqual({ six: 5, four: 4 });
  });
});


