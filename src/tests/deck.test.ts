import { describe, expect, it } from 'vitest';
import { createOrderedDeck, shuffleDeck, Suit, EUCHRE_RANKS } from '../game/rules/deck';

describe('Deck', () => {
  it('creates a 24-card euchre deck', () => {
    const deck = createOrderedDeck();
    expect(deck.length).toBe(24);
    const suits = new Set(deck.map((c) => c.suit));
    expect(suits).toEqual(new Set([Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades]));
    const ranks = new Set(deck.map((c) => c.rank));
    expect(ranks).toEqual(new Set(EUCHRE_RANKS));
  });

  it('shuffle is deterministic by seed', () => {
    const a = shuffleDeck('pine');
    const b = shuffleDeck('pine');
    expect(a).toEqual(b);
  });
});


