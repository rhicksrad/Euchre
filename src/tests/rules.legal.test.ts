import { describe, expect, it } from 'vitest';
import { Card, Rank, Suit } from '../game/rules/deck';
import { legalMoves } from '../game/rules/legal';

const AH: Card = { suit: Suit.Hearts, rank: Rank.Ace };
const KH: Card = { suit: Suit.Hearts, rank: Rank.King };
const JD: Card = { suit: Suit.Diamonds, rank: Rank.Jack }; // can be left bower if hearts are trump
const QS: Card = { suit: Suit.Spades, rank: Rank.Queen };

describe('Legal moves', () => {
  it('must follow lead suit when possible (non-trump)', () => {
    const hand = [AH, QS];
    const moves = legalMoves(hand, Suit.Hearts, Suit.Spades);
    expect(moves).toEqual([AH]);
  });

  it('left bower counts as trump for following suit', () => {
    const hand = [JD, KH];
    const moves = legalMoves(hand, Suit.Hearts, Suit.Hearts);
    // lead hearts; JD becomes hearts due to left bower
    expect(moves).toEqual([JD, KH]);
  });

  it('if cannot follow suit, any card is legal', () => {
    const hand = [QS];
    const moves = legalMoves(hand, Suit.Hearts, Suit.Spades);
    expect(moves).toEqual([QS]);
  });
});


