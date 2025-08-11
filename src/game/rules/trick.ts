import { Card, Suit } from './deck';
import { compareNonTrumpSameSuit, compareTrump, effectiveSuit, isTrump } from './ordering';

/**
 * Determine index of winning card in a trick.
 * cards are in play order starting with leader.
 */
export function winningCardIndex(cards: readonly Card[], trump: Suit): number {
  if (cards.length === 0) throw new Error('No cards in trick');
  const leadSuit = effectiveSuit(cards[0], trump);
  let winner = 0;
  for (let i = 1; i < cards.length; i += 1) {
    const a = cards[winner];
    const b = cards[i];
    // trump vs non-trump
    const aTrump = isTrump(a, trump);
    const bTrump = isTrump(b, trump);
    if (aTrump && !bTrump) continue;
    if (!aTrump && bTrump) {
      winner = i;
      continue;
    }
    if (aTrump && bTrump) {
      if (compareTrump(b, a, trump) > 0) winner = i;
      continue;
    }
    // neither trump: only cards of lead suit can win over others
    const aSuit = effectiveSuit(a, trump);
    const bSuit = effectiveSuit(b, trump);
    if (bSuit === leadSuit && aSuit !== leadSuit) {
      winner = i;
    } else if (bSuit === leadSuit && aSuit === leadSuit) {
      if (compareNonTrumpSameSuit(b, a) > 0) winner = i;
    }
  }
  return winner;
}


