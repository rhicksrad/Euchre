import { describe, it, expect } from 'vitest';
import { Suit, Rank, type Card } from '../game/rules/deck';
import { isLeftBower, isRightBower, effectiveSuit } from '../game/rules/ordering';
import { legalMoves } from '../game/rules/legal';
import { winningCardIndex } from '../game/rules/trick';
import { scoreHand } from '../game/rules/scoring';

describe('Euchre rules', () => {
  it('left and right bower detection', () => {
    const right: Card = { suit: Suit.Spades, rank: Rank.Jack };
    const left: Card = { suit: Suit.Clubs, rank: Rank.Jack };
    expect(isRightBower(right, Suit.Spades)).toBe(true);
    expect(isLeftBower(left, Suit.Spades)).toBe(true);
    expect(effectiveSuit(left, Suit.Spades)).toBe(Suit.Spades);
  });

  it('legal moves must follow suit considering left bower as trump', () => {
    const trump = Suit.Hearts;
    const left: Card = { suit: Suit.Diamonds, rank: Rank.Jack }; // left bower for hearts
    const hand: Card[] = [left, { suit: Suit.Spades, rank: Rank.Ace }];
    const lead: Card = { suit: Suit.Diamonds, rank: Rank.Ace };
    // lead is diamonds, but left bower is hearts effectively; no diamond in hand, so any card
    const moves = legalMoves(hand, lead.suit, trump);
    expect(moves.length).toBe(2);
    // if lead is hearts (trump), must follow with left
    const moves2 = legalMoves(hand, Suit.Hearts, trump);
    expect(moves2).toEqual([left]);
  });

  it('trick resolution with bowers', () => {
    const trump = Suit.Spades;
    const plays: Card[] = [
      { suit: Suit.Spades, rank: Rank.Nine },
      { suit: Suit.Spades, rank: Rank.Ace },
      { suit: Suit.Hearts, rank: Rank.Ace },
      { suit: Suit.Clubs, rank: Rank.Jack }, // left bower (clubs) is trump when spades trump
    ];
    const idx = winningCardIndex(plays, trump);
    expect(idx).toBe(3); // left bower should win over other trump
  });

  it('scoring points correctly', () => {
    expect(scoreHand({ makersWonTricks: 5, defendersWonTricks: 0, makersWentAlone: false })).toEqual({ makers: 2, defenders: 0 });
    expect(scoreHand({ makersWonTricks: 5, defendersWonTricks: 0, makersWentAlone: true })).toEqual({ makers: 4, defenders: 0 });
    expect(scoreHand({ makersWonTricks: 3, defendersWonTricks: 2, makersWentAlone: false })).toEqual({ makers: 1, defenders: 0 });
    expect(scoreHand({ makersWonTricks: 2, defendersWonTricks: 3, makersWentAlone: false })).toEqual({ makers: 0, defenders: 2 });
  });
});


