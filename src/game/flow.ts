import type { Card, Suit } from './rules/deck';
import { legalMoves } from './rules/legal';
import { winningCardIndex } from './rules/trick';
import { isLeftBower, isRightBower, isTrump } from './rules/ordering';

export function nextPlayerId(id: number): 0 | 1 | 2 | 3 {
  return (((id + 1) % 4) as 0 | 1 | 2 | 3);
}

export function determineTrickWinner(played: readonly Card[], trump: Suit): number {
  return winningCardIndex(played, trump);
}

export function computeLegalMoves(
  hand: readonly Card[],
  played: readonly Card[],
  trump: Suit,
): Card[] {
  const leadSuit = played.length > 0 ? played[0] : null;
  // If no lead yet, any card legal
  return legalMoves(hand, leadSuit ? leadSuit.suit : null, trump);
}

/**
 * Dealer discard heuristic when picking up the upcard.
 * Prefers lowest non-trump; avoids discarding bowers.
 */
export function computeDealerDiscardIndex(hand: Card[], trump: Suit): number {
  let bestIdx = 0;
  let bestScore = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < hand.length; i += 1) {
    const c = hand[i];
    if (isRightBower(c, trump) || isLeftBower(c, trump)) continue; // never discard bowers
    const trumpiness = isTrump(c, trump) ? 100 : 0;
    const rankScore = c.rank; // 9..14
    const score = trumpiness + rankScore; // prefer non-trump low cards
    if (score < bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}


