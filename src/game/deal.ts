import { PRNG } from '../utils/prng';
import { createOrderedDeck, Deck, type Card } from './rules/deck';
import type { DealResult, PlayerId } from './types';

export function shuffleDeckWithSeed(seed: string | number): Deck {
  const prng = new PRNG(seed);
  const deck = [...createOrderedDeck()];
  prng.shuffleInPlace(deck);
  return deck;
}

/**
 * Deals 5 cards to each player (dealer deals last). Remaining 4 form kitty with kitty[0] as upcard.
 * Uses 3-2 / 2-3 pattern.
 */
export function dealHands(deck: Deck, dealer: PlayerId): DealResult {
  const hands: Record<PlayerId, Card[]> = { 0: [], 1: [], 2: [], 3: [] };
  const order: PlayerId[] = [((dealer + 1) % 4) as PlayerId, ((dealer + 2) % 4) as PlayerId, ((dealer + 3) % 4) as PlayerId, dealer];
  let idx = 0;
  // two rounds: 3 then 2
  for (const count of [3, 2]) {
    for (const p of order) {
      for (let i = 0; i < count; i += 1) {
        hands[p].push(deck[idx]);
        idx += 1;
      }
    }
  }
  const kitty = deck.slice(idx, idx + 4);
  const deckRemainder = deck.slice(idx + 4);
  return { hands, kitty, deckRemainder } as DealResult;
}


