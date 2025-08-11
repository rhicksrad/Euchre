import { describe, expect, it } from 'vitest';
import { Card, Rank, Suit } from '../game/rules/deck';
import { effectiveSuit, isLeftBower, isRightBower, isTrump } from '../game/rules/ordering';

const JH: Card = { suit: Suit.Hearts, rank: Rank.Jack };
const JD: Card = { suit: Suit.Diamonds, rank: Rank.Jack };
const JS: Card = { suit: Suit.Spades, rank: Rank.Jack };
const JC: Card = { suit: Suit.Clubs, rank: Rank.Jack };

describe('Ordering and bowers', () => {
  it('identifies right and left bower in red trump', () => {
    expect(isRightBower(JH, Suit.Hearts)).toBe(true);
    expect(isLeftBower(JD, Suit.Hearts)).toBe(true);
    expect(isTrump(JD, Suit.Hearts)).toBe(true);
    expect(effectiveSuit(JD, Suit.Hearts)).toBe(Suit.Hearts);
  });

  it('identifies right and left bower in black trump', () => {
    expect(isRightBower(JS, Suit.Spades)).toBe(true);
    expect(isLeftBower(JC, Suit.Spades)).toBe(true);
    expect(isTrump(JC, Suit.Spades)).toBe(true);
    expect(effectiveSuit(JC, Suit.Spades)).toBe(Suit.Spades);
  });
});


