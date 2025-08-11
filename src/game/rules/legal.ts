import { Card, Suit } from './deck';
import { effectiveSuit } from './ordering';

export function canFollowSuit(hand: readonly Card[], leadSuit: Suit, trump: Suit): boolean {
  return hand.some((c) => effectiveSuit(c, trump) === leadSuit);
}

export function legalMoves(hand: readonly Card[], leadSuit: Suit | null, trump: Suit): Card[] {
  if (leadSuit == null) return [...hand];
  const followable = hand.filter((c) => effectiveSuit(c, trump) === leadSuit);
  return followable.length > 0 ? followable : [...hand];
}


