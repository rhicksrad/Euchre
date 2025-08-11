import { describe, expect, it } from 'vitest';
import { Card, Rank, Suit } from '../game/rules/deck';
import { winningCardIndex } from '../game/rules/trick';

const AH: Card = { suit: Suit.Hearts, rank: Rank.Ace };
const KS: Card = { suit: Suit.Spades, rank: Rank.King };
const JH: Card = { suit: Suit.Hearts, rank: Rank.Jack };
const JD: Card = { suit: Suit.Diamonds, rank: Rank.Jack };
const TH: Card = { suit: Suit.Hearts, rank: Rank.Ten };

describe('Trick winner', () => {
  it('trump beats non-trump regardless of lead suit', () => {
    const idx = winningCardIndex([AH, KS], Suit.Spades);
    expect(idx).toBe(1);
  });

  it('right bower is strongest trump over left bower', () => {
    const idx = winningCardIndex([JH, JD], Suit.Hearts);
    expect(idx).toBe(0); // right over left
  });

  it('within lead suit non-trump, rank order decides', () => {
    const idx = winningCardIndex([TH, AH], Suit.Spades);
    expect(idx).toBe(1);
  });
});


