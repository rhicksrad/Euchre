import { describe, expect, it } from 'vitest';
import { Rank, Suit, type Card } from '../game/rules/deck';
import { pickBidRound1, pickCardToPlay } from '../game/ai/policy';
import type { PlayerId } from '../game/types';

const hand: Card[] = [
  { suit: Suit.Hearts, rank: Rank.Jack },
  { suit: Suit.Diamonds, rank: Rank.Jack },
  { suit: Suit.Spades, rank: Rank.Nine },
  { suit: Suit.Spades, rank: Rank.Ten },
  { suit: Suit.Clubs, rank: Rank.Ace },
];

describe('AI policy', () => {
  it('orders up with bower presence', () => {
    const upcard: Card = { suit: Suit.Hearts, rank: Rank.Nine };
    const res = pickBidRound1(hand, upcard, 1, false, 'Standard');
    expect(res.action).toBe('order');
  });

  it('plays a legal card', () => {
    const card = pickCardToPlay(hand, [], Suit.Spades, (2 as unknown) as PlayerId, [], 'Standard');
    expect(card).toBeDefined();
  });
});


