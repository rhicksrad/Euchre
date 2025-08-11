import { PRNG } from '../../utils/prng';

export enum Suit {
  Clubs = 'C',
  Diamonds = 'D',
  Hearts = 'H',
  Spades = 'S',
}

export enum Rank {
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
}

export type Card = Readonly<{
  suit: Suit;
  rank: Rank;
}>;

export type Deck = ReadonlyArray<Card>;

export const ALL_SUITS: readonly Suit[] = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades] as const;
export const EUCHRE_RANKS: readonly Rank[] = [
  Rank.Nine,
  Rank.Ten,
  Rank.Jack,
  Rank.Queen,
  Rank.King,
  Rank.Ace,
] as const;

export function createOrderedDeck(): Deck {
  const deck: Card[] = [];
  for (const suit of ALL_SUITS) {
    for (const rank of EUCHRE_RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

export function shuffleDeck(seed: number | string): Deck {
  const prng = new PRNG(seed);
  const cards = [...createOrderedDeck()];
  prng.shuffleInPlace(cards);
  return cards;
}


