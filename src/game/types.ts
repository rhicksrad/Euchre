import type { Card, Deck, Suit } from './rules/deck';

export type PlayerId = 0 | 1 | 2 | 3; // 0: South(player), 1: West, 2: North, 3: East by convention

export enum TeamId {
  NS = 'NS',
  EW = 'EW',
}

export function teamOf(player: PlayerId): TeamId {
  return player % 2 === 0 ? TeamId.NS : TeamId.EW;
}

export type DealResult = {
  hands: Record<PlayerId, Card[]>;
  kitty: Card[]; // 4 cards, kitty[0] is face-up upcard
  deckRemainder: Deck;
};

export type Phase = 'idle' | 'dealing' | 'bidding1' | 'bidding2' | 'playing' | 'hand_end' | 'game_end';

export type BiddingState = {
  dealer: PlayerId;
  current: PlayerId;
  upcardSuit: Suit;
  round: 1 | 2; // 1: order up, 2: name trump (not upcard suit)
  passes: number;
  trump: Suit | null;
  maker: PlayerId | null;
  makerWentAlone: boolean;
};


